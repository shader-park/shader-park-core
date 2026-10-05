#!/usr/bin/env node
// Runs the starter templates from the shader-park-examples repo against this
// repo's packed build, next to the shader-park-core version each template pins
// today, so the effect of a packaging change is visible per real-world setup.
//
//   npm run test:examples [-- --examples ../shader-park-examples] [-- template-name ...]
//
// For each template (copied to a temp dir; the checkout isn't modified):
//   published  the template as-is, with the shader-park-core version it pins
//   local      the same template with shader-park-core from `npm pack` of this repo
// Each is built the way the template is (Vite, Parcel, or plain files), loaded
// in headless Chrome, and checked for rendering, errors, three.js's
// "Multiple instances" warning and how many copies of three the build contains.
//
// Needs a sibling checkout of https://github.com/shader-park/shader-park-examples
// (not run in CI).

import fs from 'fs';
import os from 'os';
import path from 'path';
import http from 'http';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const examplesOpt = args.indexOf('--examples');
const examplesDir = path.resolve(examplesOpt >= 0 ? args[examplesOpt + 1] : path.join(root, '../shader-park-examples'));
const only = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--examples');
const DUPLICATE_WARNING = 'Multiple instances of Three.js being imported';

// How each template is built and where its output lives
const TEMPLATES = {
  'es6-three-starter-template': { build: ['npm', 'run', 'build'], out: 'dist', three: true },
  'es6-vite-prebuild-three-template': { build: ['npx', 'vite', 'build'], out: 'dist', three: true },
  'vite-fxhash-template': { build: ['npx', 'vite', 'build'], out: 'dist', three: true },
  'nft-hicetnunc-three-template': { vendored: true, three: true },
  'es6-starter-template': { build: ['npx', 'vite', 'build'], out: 'dist', three: false },
};

if (!fs.existsSync(examplesDir)) {
  console.error(`No shader-park-examples checkout at ${examplesDir} (use --examples <path>)`);
  process.exit(1);
}

function run(cmd, cmdArgs, cwd) {
  try {
    return execFileSync(cmd, cmdArgs, { cwd, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
  } catch (e) {
    const out = (e.stderr?.toString() || '') + (e.stdout?.toString() || '');
    throw new Error(`${cmd} ${cmdArgs.join(' ')} failed:\n${out.split('\n').filter(Boolean).slice(-12).join('\n')}`);
  }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sp-examples-test-'));
console.log(`building and packing shader-park-core (temp dir ${tmp})`);
run('npm', ['run', 'build'], root);
const tarball = path.join(tmp, JSON.parse(run('npm', ['pack', '--json', '--pack-destination', tmp], root))[0].filename);

function copyTemplate(name, variant) {
  const dest = path.join(tmp, `${name}-${variant}`);
  fs.cpSync(path.join(examplesDir, name), dest, {
    recursive: true,
    filter: (src) => !/node_modules|\.parcel-cache|[\\/]dist$/.test(src),
  });
  return dest;
}

function prepare(name, variant) {
  const t = TEMPLATES[name];
  const dir = copyTemplate(name, variant);
  if (t.vendored) {
    if (variant === 'local') {
      fs.copyFileSync(path.join(root, 'dist/shader-park-core.esm.js'), path.join(dir, 'shader-park-core.esm.js'));
    }
    return { dir, serveDir: dir };
  }
  if (variant === 'local') {
    const pkgPath = path.join(dir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    for (const field of ['dependencies', 'devDependencies']) {
      if (pkg[field]?.['shader-park-core']) pkg[field]['shader-park-core'] = `file:${tarball}`;
    }
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }
  // Fresh installs on both sides so only shader-park-core differs (old
  // lockfiles also pin native modules that don't build on current Node)
  for (const lock of ['package-lock.json', 'yarn.lock']) fs.rmSync(path.join(dir, lock), { force: true });
  run('npm', ['install', '--no-audit', '--no-fund', '--prefer-offline'], dir);
  run(t.build[0], t.build.slice(1), dir);
  return { dir, serveDir: path.join(dir, t.out) };
}

function countThreeCopies(dir) {
  let count = 0;
  const walk = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.m?js$/.test(f.name)) count += fs.readFileSync(p, 'utf8').split(DUPLICATE_WARNING).length - 1;
    }
  };
  walk(dir);
  return count;
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

async function renderPage(browser, dir) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(dir, url.endsWith('/') ? url + 'index.html' : url);
    if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(url === '/favicon.ico' ? 204 : 404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' }).end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => {
    window.__frames = 0;
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => raf((t) => { window.__frames++; cb(t); });
  });
  const messages = [];
  page.on('console', (m) => messages.push({ type: m.type(), text: m.text() }));
  page.on('pageerror', (e) => messages.push({ type: 'pageerror', text: (e.stack || e.message || String(e)).split('\n').slice(0, 3).join(' / ') }));
  page.on('requestfailed', (r) => messages.push({ type: 'error', text: `request failed: ${r.url()}` }));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForFunction(() => window.__frames >= 5, { timeout: 30000 }).catch(() => {
    messages.push({ type: 'error', text: 'timed out waiting for frames' });
  });
  const png = PNG.sync.read(await page.screenshot());
  let drawn = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i] < 245 || png.data[i + 1] < 245 || png.data[i + 2] < 245) drawn++;
  }
  await page.close();
  server.closeAllConnections();
  server.close();
  return { messages, drawnPct: (100 * drawn) / (png.width * png.height), png };
}

const browser = await puppeteer.launch({
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
    ...(process.env.CI ? ['--no-sandbox'] : [])],
});

const outDir = path.join(root, 'test/out/examples');
fs.mkdirSync(outDir, { recursive: true });
let regressions = 0;

try {
  for (const name of Object.keys(TEMPLATES)) {
    if (only.length && !only.some((o) => name.includes(o))) continue;
    console.log(`\n${name}`);
    const results = {};
    for (const variant of ['published', 'local']) {
      const r = { variant };
      results[variant] = r;
      try {
        const { serveDir } = prepare(name, variant);
        r.threeCopies = countThreeCopies(serveDir);
        const page = await renderPage(browser, serveDir);
        r.drawnPct = page.drawnPct;
        r.duplicate = page.messages.some((m) => m.text.includes(DUPLICATE_WARNING));
        r.errors = page.messages.filter((m) => m.type === 'error' || m.type === 'pageerror').map((m) => m.text);
        fs.writeFileSync(path.join(outDir, `${name}.${variant}.png`), PNG.sync.write(page.png));
        r.ok = r.errors.length === 0 && r.drawnPct > 0.5;
      } catch (e) {
        r.ok = false;
        r.buildError = e.message;
      }
      const summary = r.buildError
        ? `BUILD FAILED\n      ${r.buildError.split('\n').join('\n      ')}`
        : `${r.ok ? 'renders' : 'BROKEN'} (${r.drawnPct.toFixed(1)}% drawn)` +
          (TEMPLATES[name].three ? `, three copies in build: ${r.threeCopies}, duplicate warning: ${r.duplicate ? 'yes' : 'no'}` : '') +
          (r.errors.length ? `\n      errors: ${r.errors.slice(0, 4).join(' | ')}` : '');
      console.log(`  ${variant.padEnd(10)} ${summary}`);
    }
    if (results.published.ok && !results.local.ok) {
      regressions++;
      console.log('  ✘ works with the published version but not with this build');
    }
  }
} finally {
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(`\nscreenshots: ${path.relative(process.cwd(), outDir)}/`);
console.log(regressions ? `${regressions} template(s) regressed` : 'no regressions compared to the published versions');
process.exit(regressions ? 1 : 0);
