#!/usr/bin/env node
// Tests the published shape of the package rather than the repo: packs it with
// `npm pack`, installs the tarball into throwaway projects and checks that each
// kind of user gets the right file.
//
//   npm run test:package     (builds first)
//
// 1. Vite app using three.js + createSculpture: one copy of three in the
//    bundle, renders, no "Multiple instances of Three.js" warning
// 2. Vite app using only the minimal renderer: renders
// 3. Node import() and require(): resolve to the external builds and compile
// 4. Deep dist/ paths still resolve, and the bare CDN URLs (unpkg, jsdelivr)
//    point at the same files as before "exports" was added

import fs from 'fs';
import os from 'os';
import path from 'path';
import http from 'http';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THREE_VERSION = '0.186.1';
const VITE_VERSION = '^7';
const DUPLICATE_WARNING = 'Multiple instances of Three.js being imported';

let failures = 0;
const check = (ok, message) => {
  console.log(`${ok ? '  ✔' : '  ✘'} ${message}`);
  if (!ok) failures++;
};
function run(cmd, args, cwd) {
  try {
    return execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
  } catch (e) {
    throw new Error(`${cmd} ${args.join(' ').slice(0, 80)} failed:\n${e.stderr?.toString() || e.message}`);
  }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sp-package-test-'));
console.log(`packing into ${tmp}`);
const tarball = path.join(tmp, JSON.parse(run('npm', ['pack', '--json', '--pack-destination', tmp], root))[0].filename);

function makeProject(name, files, deps) {
  const dir = path.join(tmp, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name, private: true, type: 'module' }, null, 2));
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), content);
  }
  run('npm', ['install', '--no-audit', '--no-fund', '--prefer-offline', tarball, ...deps], dir);
  return dir;
}

// Serves a directory and renders its index.html headlessly
async function renderPage(browser, dir) {
  const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
      res.writeHead(204).end();
      return;
    }
    const file = path.join(dir, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    if (!fs.existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    const type = file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'text/javascript' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type }).end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 300 });
  const messages = [];
  page.on('console', (m) => messages.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => messages.push(`pageerror: ${e.message}`));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForFunction(() => window.__rendered === true, { timeout: 20000 }).catch(() => {
    messages.push('error: timed out waiting for the page to render');
  });
  const png = PNG.sync.read(await page.screenshot());
  let drawn = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i] < 250 || png.data[i + 1] < 250 || png.data[i + 2] < 250) drawn++;
  }
  await page.close();
  server.closeAllConnections();
  server.close();
  return { messages, drawnPct: (100 * drawn) / (png.width * png.height) };
}

const html = `<!DOCTYPE html><html><head><style>html, body { margin: 0; background: white; }</style></head>
<body><canvas id="c" width="400" height="300" style="width: 400px; height: 300px"></canvas>
<script type="module" src="/main.js"></script></body></html>`;

const threeApp = `
import * as THREE from 'three';
import { createSculpture } from 'shader-park-core';
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c') });
renderer.setPixelRatio(1);
renderer.setSize(400, 300, false);
renderer.setClearColor(0xffffff, 1);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 400 / 300, 0.1, 100);
camera.position.set(0, 0, 4);
scene.add(createSculpture(() => { sphere(0.5); }));
let frames = 0;
(function frame() {
  renderer.render(scene, camera);
  if (++frames === 2) window.__rendered = true;
  requestAnimationFrame(frame);
})();
`;

const minimalApp = `
import { sculptToMinimalRenderer } from 'shader-park-core';
sculptToMinimalRenderer(document.getElementById('c'), 'sphere(0.4);');
let frames = 0;
(function frame() {
  if (++frames === 3) window.__rendered = true;
  requestAnimationFrame(frame);
})();
`;

const browser = await puppeteer.launch({
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
    ...(process.env.CI ? ['--no-sandbox'] : [])],
});

try {
  // 1. Vite + three.js
  console.log(`\nVite app with three@${THREE_VERSION} + createSculpture`);
  const threeDir = makeProject('vite-three', { 'index.html': html, 'main.js': threeApp },
    [`three@${THREE_VERSION}`, `vite@${VITE_VERSION}`]);
  run('npx', ['vite', 'build', '--logLevel', 'error'], threeDir);
  const assets = path.join(threeDir, 'dist/assets');
  const bundle = fs.readdirSync(assets).filter((f) => f.endsWith('.js'))
    .map((f) => fs.readFileSync(path.join(assets, f), 'utf8')).join('\n');
  const copies = bundle.split(DUPLICATE_WARNING).length - 1;
  check(copies === 1, `bundle contains one copy of three (found ${copies})`);
  check(!bundle.includes("REVISION = '155'") && !/["']155["']/.test(bundle.match(/REVISION\s*=\s*["']\d+["']/)?.[0] ?? ''),
    'bundle does not contain the r155 copy the self-contained builds carry');
  const threeResult = await renderPage(browser, path.join(threeDir, 'dist'));
  check(threeResult.drawnPct > 0.1, `renders (${threeResult.drawnPct.toFixed(2)}% of pixels drawn)`);
  const threeProblems = threeResult.messages.filter((m) => m.includes(DUPLICATE_WARNING) || /^(error|pageerror)/.test(m));
  check(threeProblems.length === 0, `no errors or duplicate-three warnings${threeProblems.length ? ': ' + threeProblems.join(' | ') : ''}`);

  // 2. Vite + minimal renderer only
  console.log('\nVite app using only the minimal renderer');
  const minimalDir = makeProject('vite-minimal', { 'index.html': html, 'main.js': minimalApp }, [`vite@${VITE_VERSION}`]);
  const installedThree = fs.existsSync(path.join(minimalDir, 'node_modules/three/package.json'));
  check(installedThree, 'npm installed three automatically as a peer dependency');
  run('npx', ['vite', 'build', '--logLevel', 'error'], minimalDir);
  const minimalResult = await renderPage(browser, path.join(minimalDir, 'dist'));
  check(minimalResult.drawnPct > 0.1, `renders (${minimalResult.drawnPct.toFixed(2)}% of pixels drawn)`);
  const minimalProblems = minimalResult.messages.filter((m) => /^(error|pageerror)/.test(m));
  check(minimalProblems.length === 0, `no errors${minimalProblems.length ? ': ' + minimalProblems.join(' | ') : ''}`);

  // 3. Node import() and require()
  console.log('\nNode');
  const nodeDir = threeDir;
  const esm = run('node', ['--input-type=module', '-e', `
    import { sculptToGLSL } from 'shader-park-core';
    const glsl = sculptToGLSL('sphere(0.3);');
    console.log(JSON.stringify({ resolved: import.meta.resolve('shader-park-core'), ok: glsl.geoGLSL.includes('sphere(') }));
  `], nodeDir).trim().split('\n').pop();
  const esmResult = JSON.parse(esm);
  check(esmResult.resolved.endsWith('dist/shader-park-core.external.esm.js'), `import resolves to the external ESM build (${path.basename(esmResult.resolved)})`);
  check(esmResult.ok, 'import() compiles a sculpture');
  const cjs = run('node', ['--input-type=commonjs', '-e', `
    const { sculptToGLSL } = require('shader-park-core');
    const glsl = sculptToGLSL('sphere(0.3);');
    console.log(JSON.stringify({ resolved: require.resolve('shader-park-core'), ok: glsl.geoGLSL.includes('sphere(') }));
  `], nodeDir).trim().split('\n').pop();
  const cjsResult = JSON.parse(cjs);
  check(cjsResult.resolved.endsWith('dist/shader-park-core.external.cjs'), `require resolves to the external CJS build (${path.basename(cjsResult.resolved)})`);
  check(cjsResult.ok, 'require() compiles a sculpture');

  // 4. Deep paths and CDN fields
  console.log('\nFile paths and CDN fields');
  const deep = run('node', ['--input-type=commonjs', '-e', `
    for (const f of ['shader-park-core/dist/shader-park-core.umd.js', 'shader-park-core/dist/shader-park-core.esm.js',
                     'shader-park-core/dist/shader-park-minimal-renderer.esm.js', 'shader-park-core/package.json']) {
      require.resolve(f);
    }
    console.log('ok');
  `], nodeDir).trim();
  check(deep.endsWith('ok'), 'deep dist/ paths and package.json resolve');
  const pkgDir = path.join(nodeDir, 'node_modules/shader-park-core');
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
  check(pkg.unpkg === 'dist/shader-park-core.esm.js', `unpkg serves ${pkg.unpkg} (same as before)`);
  check(pkg.jsdelivr === 'dist/shader-park-core.umd.js', `jsdelivr serves ${pkg.jsdelivr} (same as before)`);
  for (const f of [pkg.unpkg, pkg.jsdelivr]) {
    check(/REVISION = '155'/.test(fs.readFileSync(path.join(pkgDir, f), 'utf8')), `${f} is self-contained (bundles three r155)`);
  }
} finally {
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(failures ? `\n${failures} check(s) failed` : '\nall package checks passed');
process.exit(failures ? 1 : 0);
