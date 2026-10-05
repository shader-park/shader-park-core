#!/usr/bin/env node
// Compiles a corpus of real sculptures with the working tree and with the base
// commit (merge-base with main), and compares the generated shaders for the
// minimal renderer, three.js and TouchDesigner targets.
//
//   npm run corpus                       uses test/.corpus/{examples,sculptures}.json
//   npm run corpus -- --download         refresh the corpus from shaderpark.com
//   npm run corpus -- --base <ref>
//
// The corpus is the public sculptures from shaderpark.com's Firebase database.
// It's user content, so it's kept out of git (test/.corpus/).
// Report: test/out/corpus-report.json

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { resolveBase, buildBaseline } from './baseline.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const corpusDir = path.join(root, 'test/.corpus');
const DB = 'https://shader-park-core.firebaseio.com';
const args = process.argv.slice(2);
const baseOpt = args.indexOf('--base');
const BATCH = 100;
const TIMEOUT_MS = 120000;

if (args.includes('--download') || !fs.existsSync(path.join(corpusDir, 'sculptures.json'))) {
  fs.mkdirSync(corpusDir, { recursive: true });
  for (const collection of ['examples', 'sculptures']) {
    console.log(`downloading ${collection}...`);
    const res = await fetch(`${DB}/${collection}.json`);
    fs.writeFileSync(path.join(corpusDir, `${collection}.json`), await res.text());
  }
}

const jobs = [];
for (const collection of ['examples', 'sculptures']) {
  const data = JSON.parse(fs.readFileSync(path.join(corpusDir, `${collection}.json`), 'utf8'));
  for (const [id, s] of Object.entries(data)) {
    if (s.visibility !== 'public' || typeof s.shaderSource !== 'string') continue;
    if (s.type !== 'js' && s.type !== 'glsl') continue;
    jobs.push({ name: `${collection}/${id}`, kind: s.type === 'glsl' ? 'glsl' : 'sculpt', src: s.shaderSource, title: s.title });
  }
}

const base = resolveBase(root, baseOpt >= 0 ? args[baseOpt + 1] : undefined);
const { bundlePath } = await buildBaseline(root, base.sha);
console.log(`${jobs.length} public sculptures; base ${base.ref} @ ${base.sha.slice(0, 8)}`);

// Compile a list of jobs, splitting batches that time out (infinite loops)
function compileAll(entry, list) {
  try {
    const out = execFileSync(process.execPath, [path.join(root, 'test/harness/compile.mjs'), entry], {
      input: JSON.stringify(list.map(({ name, kind, src }) => ({ name, kind, src }))),
      maxBuffer: 1024 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'ignore'],
      timeout: TIMEOUT_MS,
    });
    return JSON.parse(out.toString()).results;
  } catch (e) {
    if (list.length === 1) return [{ name: list[0].name, error: `compiler process failed: ${e.code || e.signal || e.message}` }];
    const mid = list.length >> 1;
    return [...compileAll(entry, list.slice(0, mid)), ...compileAll(entry, list.slice(mid))];
  }
}

const firstError = (e) => String(e).split('\n')[0].slice(0, 160);
const categories = { identical: [], bothError: [], different: [], onlyNowFails: [], onlyBaseFails: [] };
const start = performance.now();
for (let i = 0; i < jobs.length; i += BATCH) {
  const batch = jobs.slice(i, i + BATCH);
  const now = compileAll(path.join(root, 'test/harness/entry.mjs'), batch);
  const then = compileAll(bundlePath, batch);
  batch.forEach((job, j) => {
    const n = now[j], b = then[j];
    const entry = { name: job.name, title: job.title };
    if (n.error && b.error) categories.bothError.push({ ...entry, now: firstError(n.error), base: firstError(b.error) });
    else if (n.error) categories.onlyNowFails.push({ ...entry, error: firstError(n.error) });
    else if (b.error) categories.onlyBaseFails.push({ ...entry, error: firstError(b.error) });
    else {
      const diffs = [];
      if (n.frag !== b.frag) diffs.push('minimal');
      for (const t of ['three', 'td']) if (JSON.stringify(n.targets[t]) !== JSON.stringify(b.targets[t])) diffs.push(t);
      if (diffs.length) {
        const a = n.frag.split('\n'), c = b.frag.split('\n');
        const line = a.findIndex((l, k) => l !== c[k]);
        categories.different.push({ ...entry, targets: diffs, line: line + 1, now: a[line], base: c[line] });
      } else categories.identical.push(entry);
    }
  });
  process.stdout.write(`\r${Math.min(i + BATCH, jobs.length)}/${jobs.length} compiled`);
}
console.log(` in ${((performance.now() - start) / 1000).toFixed(0)} s\n`);

for (const [k, v] of Object.entries(categories)) console.log(`${k.padEnd(14)} ${v.length}`);
const show = (k, n = 8) => {
  if (!categories[k].length) return;
  console.log(`\n${k}:`);
  for (const e of categories[k].slice(0, n)) console.log(`  ${e.name} "${e.title}": ${e.error ?? `${e.targets} line ${e.line}\n    now:  ${e.now}\n    base: ${e.base}`}`);
};
show('onlyNowFails');
show('different');
show('onlyBaseFails');

fs.mkdirSync(path.join(root, 'test/out'), { recursive: true });
fs.writeFileSync(path.join(root, 'test/out/corpus-report.json'), JSON.stringify(categories, null, 2));
console.log('\nreport: test/out/corpus-report.json');
process.exit(categories.onlyNowFails.length || categories.different.length ? 1 : 0);
