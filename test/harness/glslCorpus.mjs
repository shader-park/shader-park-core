#!/usr/bin/env node
// Checks the browser-side glslFunc validation (generators/validateGLSL.js)
// against every public sculpture that uses glslFunc / glslFuncES3 / glslSDF.
//
//   npm run build && node test/harness/glslCorpus.mjs
//
// For each sculpture: does the validation reject it in the browser, and does
// its complete shader actually compile on the GPU (the ground truth)? A
// sculpture that's rejected although its shader compiles is a false positive.
// Uses the test/.corpus/ download from `npm run corpus`.

import fs from 'fs';
import path from 'path';
import http from 'http';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const jobs = [];
for (const collection of ['examples', 'sculptures']) {
  const file = path.join(root, 'test/.corpus', `${collection}.json`);
  for (const [id, s] of Object.entries(JSON.parse(fs.readFileSync(file, 'utf8')))) {
    if (s.visibility !== 'public' || s.type !== 'js' || typeof s.shaderSource !== 'string') continue;
    if (!/glslFunc(ES3)?\s*\(|glslSDF\s*\(/.test(s.shaderSource)) continue;
    jobs.push({ name: `${collection}/${id}`, kind: 'sculpt', src: s.shaderSource, title: s.title });
  }
}

// Ground truth: compile each sculpture's complete minimal-renderer shader in
// Node (no validation there), then on the GPU below
const compiled = JSON.parse(execFileSync(process.execPath,
  [path.join(root, 'test/harness/compile.mjs'), path.join(root, 'test/harness/entry.mjs')],
  { input: JSON.stringify(jobs), maxBuffer: 1024 * 1024 * 1024, stdio: ['pipe', 'pipe', 'ignore'] })).results;

const html = `<!DOCTYPE html><script type="module">
import * as sp from '/dist/shader-park-core.esm.js';
const gl = document.createElement('canvas').getContext('webgl2');
window.check = (src, frag) => {
  let validation = null;
  try { sp.sculptToGLSL(src); } catch (e) { validation = String(e); }
  let shaderCompiles = null;
  if (frag) {
    const s = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(s, frag);
    gl.compileShader(s);
    shaderCompiles = gl.getShaderParameter(s, gl.COMPILE_STATUS);
    gl.deleteShader(s);
  }
  return { validation, shaderCompiles };
};
window.ready = true;
</script>`;
const server = http.createServer((req, res) => {
  if (req.url === '/') return res.writeHead(200, { 'Content-Type': 'text/html' }).end(html);
  const f = path.join(root, req.url);
  if (!fs.existsSync(f)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': 'text/javascript' }).end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await puppeteer.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.on('console', () => {});
await page.goto(`http://127.0.0.1:${server.address().port}/`);
await page.waitForFunction(() => window.ready);

const result = { falsePositive: [], caught: [], missed: [], ok: [], failsBeforeGLSL: [] };
for (let i = 0; i < jobs.length; i++) {
  const job = jobs[i];
  const node = compiled[i];
  if (node.error) {
    result.failsBeforeGLSL.push(job.name);
    continue;
  }
  const r = await page.evaluate((src, frag) => window.check(src, frag), job.src, node.frag);
  const entry = { name: job.name, title: job.title, validation: r.validation?.split('\n').slice(0, 2).join(' | ') };
  if (r.validation && r.shaderCompiles) result.falsePositive.push(entry);
  else if (r.validation) result.caught.push(entry);
  else if (!r.shaderCompiles) result.missed.push(entry);
  else result.ok.push(entry);
}
await browser.close();
server.close();

console.log(`${jobs.length} public sculptures use glslFunc / glslFuncES3 / glslSDF\n`);
console.log(`valid, accepted                     ${result.ok.length}`);
console.log(`invalid, rejected with a message    ${result.caught.length}`);
console.log(`invalid, error outside glslFunc     ${result.missed.length}`);
console.log(`FALSE POSITIVES (valid, rejected)   ${result.falsePositive.length}`);
console.log(`fail before GLSL (JS errors etc.)   ${result.failsBeforeGLSL.length}`);
for (const k of ['falsePositive', 'caught', 'missed']) {
  if (!result[k].length) continue;
  console.log(`\n${k}:`);
  for (const e of result[k].slice(0, 10)) console.log(`  ${e.name} "${e.title}"${e.validation ? `\n    ${e.validation}` : ''}`);
}
process.exit(result.falsePositive.length ? 1 : 0);
