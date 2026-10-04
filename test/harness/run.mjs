#!/usr/bin/env node
// Fast local test harness. Compiles every example with your working tree and
// with the base commit (where this branch forked from main), then:
//   1. compares the generated GLSL; identical GLSL means an identical image, so
//      those examples pass without rendering
//   2. for examples whose GLSL changed, renders both versions in one persistent
//      headless WebGL page and compares the pixels
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
import puppeteer from 'puppeteer';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { resolveBase, buildBaseline } from './baseline.mjs';

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

// Mirrors fragToMinimalRenderer in targets/minimalRenderer.js, with time pinned to 0
const PAGE_HTML = `<!DOCTYPE html><html><head><style>
  html, body { margin: 0; padding: 0; border: 0; background: white; }
  canvas { display: block; width: ${WIDTH}px; height: ${HEIGHT}px; }
</style></head><body><canvas width="${WIDTH}" height="${HEIGHT}"></canvas><script>
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl2');
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), gl.STATIC_DRAW);
  const indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2]), gl.STATIC_DRAW);

  function compileShader(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(log);
    }
    return shader;
  }

  window.renderFrag = async (vert, frag) => {
    const start = performance.now();
    let program;
    try {
      const vs = compileShader(gl.VERTEX_SHADER, vert);
      const fs = compileShader(gl.FRAGMENT_SHADER, frag);
      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('link failed: ' + gl.getProgramInfoLog(program));
      }
    } catch (e) {
      if (program) gl.deleteProgram(program);
      return { error: e.message };
    }
    gl.useProgram(program);
    const coord = gl.getAttribLocation(program, 'coordinates');
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    gl.clearColor(1.0, 1.0, 1.0, 0.9);
    gl.enable(gl.DEPTH_TEST);
    const u = (name) => gl.getUniformLocation(program, name);
    gl.uniform1f(u('opacity'), 1.0);
    gl.uniform1f(u('_scale'), 1.0);
    gl.uniform1f(u('time'), 0.0);
    gl.uniform2fv(u('resolution'), [canvas.width, canvas.height]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
    gl.finish();
    // Read pixels directly (much faster than a page screenshot)
    const pixels = new Uint8Array(canvas.width * canvas.height * 4);
    gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const ms = performance.now() - start;
    gl.deleteProgram(program);
    let binary = '';
    for (let i = 0; i < pixels.length; i += 0x8000) {
      binary += String.fromCharCode.apply(null, pixels.subarray(i, i + 0x8000));
    }
    return { ms, pixels: btoa(binary) };
  };
</script></body></html>`;

async function launch() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      ...(process.env.CI ? ['--no-sandbox'] : []),
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  await page.setContent(PAGE_HTML);
  return { browser, page };
}

// WebGL pixels are bottom-up and premultiplied (the context default). Flip them
// and composite over the white page the way the browser compositor does.
function pixelsToImage(raw) {
  const png = new PNG({ width: WIDTH, height: HEIGHT });
  for (let y = 0; y < HEIGHT; y++) {
    const src = (HEIGHT - 1 - y) * WIDTH * 4;
    const dst = y * WIDTH * 4;
    for (let x = 0; x < WIDTH * 4; x += 4) {
      const a = raw[src + x + 3];
      for (let c = 0; c < 3; c++) {
        png.data[dst + x + c] = Math.min(255, raw[src + x + c] + (255 - a));
      }
      png.data[dst + x + 3] = 255;
    }
  }
  return png;
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
let browserPromise;
const getPage = () => (browserPromise ??= launch()).then((b) => b.page);

async function render(vert, frag, pngPath) {
  const page = await getPage();
  const result = await page.evaluate((v, f) => window.renderFrag(v, f), vert, frag);
  if (result.error) return { error: result.error.trim().split('\n').slice(0, 3).join(' | ') };
  const png = pixelsToImage(Buffer.from(result.pixels, 'base64'));
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
    for (const suffix of ['.diff.png', '.base.png', '.base.frag']) fs.rmSync(out(suffix), { force: true });

    if (r.error) {
      row.glsl = red('sp error');
      row.detail = r.error.split('\n')[0];
      ok = false;
      continue;
    }
    fs.writeFileSync(out('.frag'), r.frag);

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
  console.log(dim(pad('example', 14) + pad('glsl', 10) + pad('pixels', 22) + pad('sp ms', 8) + pad('gl ms', 8)));
  for (const row of rows) {
    console.log(
      pad(row.name, 14) + pad(row.glsl, 10) + pad(row.pixels, 22) +
      pad(row.compileMs?.toFixed(0), 8) + pad(row.renderMs?.toFixed(0), 8) +
      (row.detail ? dim(row.detail) : '')
    );
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
  if (browserPromise) await (await browserPromise).browser.close();
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
