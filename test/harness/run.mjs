#!/usr/bin/env node
// Fast local test harness. Compiles every example with your working tree and
// with the base commit (where this branch forked from main), then:
//   1. compares the generated GLSL; identical GLSL means an identical image, so
//      those examples pass without rendering
//   2. for examples whose GLSL changed, renders both versions in one persistent
//      headless WebGL page and compares the pixels
//   3. compares the three.js and TouchDesigner shader text; changes are listed
//      with diff commands for review (they can't be rendered here)
// Nothing is stored in git: the base compiler is built from `git archive` and
// cached in test/.baseline/, and images are written to test/out/.
//
// Usage:
//   npm run harness                      all examples vs merge-base with main
//   npm run harness -- twirl disco       only examples whose name matches
//   npm run harness -- --base <ref>      compare against another commit/branch
//   npm run harness -- --watch           re-run when source or examples change
//   npm run harness -- --render          also render unchanged examples (compile + not-blank check)
//   npm run harness -- --code "sphere(.3)" [--out file.png]
//                                        render ad-hoc sculpt code, print GLSL path
//
// Renders use the same shader and uniforms as the minimal renderer, with time
// pinned to 0, on SwiftShader. The p5 example needs the built bundle, so it's
// only covered by `npm test`.

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { resolveBase, buildBaseline } from './baseline.mjs';
import { launchRenderer, pixelsToImage } from './renderer.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dirs = {
  sculpt: path.join(root, 'test/sculptExamples'),
  glsl: path.join(root, 'test/glslExamples'),
  out: path.join(root, 'test/out'),
};
const currentEntry = path.join(root, 'test/harness/entry.mjs');
const WIDTH = 400;
const HEIGHT = 300;
const PIXEL_THRESHOLD = 0.1;
const MAX_DIFF_RATIO = Number(process.env.MAX_DIFF_RATIO ?? 0.002);
const WATCH_DIRS = ['generators', 'glsl', 'targets', 'test/sculptExamples', 'test/glslExamples'];

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const valueOptions = ['--code', '--out', '--base'];
const watch = flag('--watch');
const forceRender = flag('--render');
const adHocCode = option('--code');
const adHocOut = option('--out');
const baseRef = option('--base');
const filters = args.filter((a, i) => !a.startsWith('--') && !valueOptions.includes(args[i - 1]));

const color = (code) => (s) => (process.stdout.isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);
const green = color(32), red = color(31), yellow = color(33), dim = color(2);

function loadJobs() {
  if (adHocCode !== undefined) {
    return [{ name: 'adhoc', kind: 'sculpt', src: adHocCode }];
  }
  const jobs = [];
  for (const [kind, dir, ext] of [['glsl', dirs.glsl, '.glsl'], ['sculpt', dirs.sculpt, '.js']]) {
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(ext)).sort()) {
      const name = path.basename(file, ext);
      if (filters.length && !filters.some((f) => name.includes(f))) continue;
      jobs.push({ name, kind, src: fs.readFileSync(path.join(dir, file), 'utf8') });
    }
  }
  return jobs;
}

function compile(entry, jobs) {
  const out = execFileSync(process.execPath, [path.join(root, 'test/harness/compile.mjs'), entry], {
    input: JSON.stringify(jobs),
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return JSON.parse(out.toString());
}

// Catches renders that failed outright (all white / all black)
function blankCheck(png) {
  let sum = 0;
  for (let i = 0; i < png.data.length; i++) sum += png.data[i];
  const avg = sum / png.data.length;
  if (avg <= 2) return 'all black';
  if (avg >= 254.9) return 'blank (all white)';
  return null;
}

// The browser is only launched once something actually needs rendering
let rendererPromise;
const getRenderer = () => (rendererPromise ??= launchRenderer());

async function render(vert, frag, pngPath) {
  const renderer = await getRenderer();
  const result = await renderer.renderFrag(vert, frag, WIDTH, HEIGHT);
  if (result.error) return { error: result.error.trim().split('\n').slice(0, 3).join(' | ') };
  const png = pixelsToImage(Buffer.from(result.pixels, 'base64'), WIDTH, HEIGHT);
  fs.writeFileSync(pngPath, PNG.sync.write(png));
  return { png, ms: result.ms };
}

let baseline;
async function getBaseline() {
  if (!baseline) {
    const base = resolveBase(root, baseRef);
    const t = performance.now();
    const { bundlePath, cached } = await buildBaseline(root, base.sha);
    baseline = { ...base, bundlePath };
    console.log(dim(`base: ${base.ref} @ ${base.sha.slice(0, 8)}` +
      (cached ? ' (cached)' : ` (built in ${(performance.now() - t).toFixed(0)} ms)`)));
  }
  return baseline;
}

async function runOnce() {
  const t0 = performance.now();
  const jobs = loadJobs();
  if (!jobs.length) {
    console.log(red(`No examples match: ${filters.join(', ')}`));
    return false;
  }

  let current, base;
  try {
    current = compile(currentEntry, jobs);
    if (adHocCode === undefined) base = compile((await getBaseline()).bundlePath, jobs);
  } catch (e) {
    console.log(red('Compiler crashed:\n') + (e.stderr?.toString() || e.message));
    return false;
  }
  const tCompile = performance.now() - t0;
  fs.mkdirSync(dirs.out, { recursive: true });

  let ok = true;
  const rows = [];
  for (let i = 0; i < current.results.length; i++) {
    const r = current.results[i];
    const b = base?.results[i];
    const row = { name: r.name, compileMs: r.ms };
    rows.push(row);
    const out = (suffix) => path.join(dirs.out, `${r.name}${suffix}`);
    for (const suffix of ['.diff.png', '.base.png', '.base.frag', '.three.frag', '.three.base.frag', '.td.frag', '.td.base.frag']) {
      fs.rmSync(out(suffix), { force: true });
    }

    if (r.error) {
      row.glsl = red('sp error');
      row.detail = r.error.split('\n')[0];
      ok = false;
      continue;
    }
    fs.writeFileSync(out('.frag'), r.frag);

    // three.js and TouchDesigner shader text vs base. These targets can't be
    // rendered here (three.js is rendered by npm test), so a change is
    // reported for review rather than failing.
    for (const target of ['three', 'td']) {
      const now = r.targets?.[target];
      const then = b?.targets?.[target];
      if (adHocCode !== undefined) {
        row[target] = dim('-');
      } else if (now?.error) {
        row[target] = red('error');
        row.detail = `${target}: ${now.error}`;
        ok = false;
      } else if (!b || b.error || then === undefined || then?.error) {
        row[target] = yellow('new');
      } else if (now === then) {
        row[target] = green('same');
      } else {
        row[target] = yellow('changed');
        fs.writeFileSync(out(`.${target}.frag`), now);
        fs.writeFileSync(out(`.${target}.base.frag`), then);
        row.targetDiffs = [...(row.targetDiffs ?? []), `diff test/out/${r.name}.${target}.base.frag test/out/${r.name}.${target}.frag`];
      }
    }

    // 1. GLSL vs base
    let mustRender = forceRender || adHocCode !== undefined;
    let compareToBase = false;
    if (adHocCode !== undefined) {
      row.glsl = dim('-');
    } else if (b.error) {
      row.glsl = yellow('new');
      row.detail = 'base compiler fails on this example';
      mustRender = true;
    } else if (b.frag === r.frag) {
      row.glsl = green('same');
    } else {
      row.glsl = yellow('changed');
      fs.writeFileSync(out('.base.frag'), b.frag);
      row.detail = `diff test/out/${r.name}.base.frag test/out/${r.name}.frag`;
      mustRender = compareToBase = true;
    }
    if (!mustRender) {
      row.pixels = dim('skipped');
      continue;
    }

    // 2. Render, and compare against the base render if the GLSL changed
    const pngPath = adHocOut ? path.resolve(adHocOut) : out('.png');
    const now = await render(current.vert, r.frag, pngPath);
    if (now.error) {
      row.pixels = red('glsl error');
      row.detail = now.error;
      ok = false;
      continue;
    }
    row.renderMs = now.ms;
    row.png = path.relative(root, pngPath);
    const blank = blankCheck(now.png);
    if (blank) {
      row.pixels = red(blank);
      ok = false;
      continue;
    }
    if (!compareToBase) {
      row.pixels = green('rendered');
      continue;
    }
    const then = await render(base.vert, b.frag, out('.base.png'));
    if (then.error) {
      row.pixels = yellow('base glsl error');
      continue;
    }
    const diff = new PNG({ width: WIDTH, height: HEIGHT });
    const n = pixelmatch(now.png.data, then.png.data, diff.data, WIDTH, HEIGHT, { threshold: PIXEL_THRESHOLD });
    const ratio = n / (WIDTH * HEIGHT);
    if (ratio > MAX_DIFF_RATIO) {
      ok = false;
      fs.writeFileSync(out('.diff.png'), PNG.sync.write(diff));
      row.pixels = red(`DIFF ${(ratio * 100).toFixed(2)}%`);
      row.detail = `see test/out/${r.name}.png, .base.png, .diff.png`;
    } else {
      row.pixels = green(ratio > 0 ? `same (${(ratio * 100).toFixed(2)}%)` : 'same');
    }
  }

  const pad = (s, n) => {
    const visible = String(s ?? '').replace(/\x1b\[[0-9;]*m/g, '');
    return String(s ?? '') + ' '.repeat(Math.max(0, n - visible.length));
  };
  console.log(dim(pad('example', 14) + pad('glsl', 10) + pad('pixels', 22) + pad('three', 9) + pad('td', 9) + pad('sp ms', 8) + pad('gl ms', 8)));
  for (const row of rows) {
    console.log(
      pad(row.name, 14) + pad(row.glsl, 10) + pad(row.pixels, 22) + pad(row.three, 9) + pad(row.td, 9) +
      pad(row.compileMs?.toFixed(0), 8) + pad(row.renderMs?.toFixed(0), 8) +
      (row.detail ? dim(row.detail) : '')
    );
    for (const d of row.targetDiffs ?? []) console.log(dim(`    ${d}`));
  }
  if (adHocCode !== undefined && rows[0]?.png) {
    console.log(dim(`image: ${rows[0].png}  glsl: test/out/adhoc.frag`));
  }
  const total = performance.now() - t0;
  console.log(
    (ok ? green('PASS') : red('FAIL')) +
    dim(`  ${rows.length} example(s) in ${total.toFixed(0)} ms (compile ${tCompile.toFixed(0)} ms)`)
  );
  return ok;
}

if (!watch) {
  const ok = await runOnce();
  if (rendererPromise) await (await rendererPromise).close();
  process.exit(ok ? 0 : 1);
}

await runOnce();
console.log(dim(`watching ${WATCH_DIRS.join(', ')} ...`));
let timer;
let running = false;
let pending = false;
const trigger = () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    if (running) { pending = true; return; }
    running = true;
    console.log(dim(`\n--- ${new Date().toLocaleTimeString()} ---`));
    await runOnce();
    running = false;
    if (pending) { pending = false; trigger(); }
  }, 50);
};
for (const dir of WATCH_DIRS) {
  fs.watch(path.join(root, dir), { recursive: true }, trigger);
}
