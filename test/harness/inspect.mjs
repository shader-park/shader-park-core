#!/usr/bin/env node
// Headless visual inspection of Shader Park output. Renders a sculpture (an
// example, a file, or inline code) into one labeled contact sheet: several
// debug views x camera angles x times, plus numeric stats per cell.
//
//   npm run inspect -- twirl
//   npm run inspect -- test/sculptExamples/disco.js --views beauty,steps --times 0,1,2
//   npm run inspect -- --code "box(.2,.2,.2); blend(.1); sphere(.25);" --angles front,top
//   npm run inspect -- twirl --base          A/B against main: adds @base rows and a diff row
//   npm run inspect -- --serve               keep a warm renderer; later calls use it automatically
//
// Views
//   beauty   the real minimal-renderer footer (identical output at the front angle)
//   normals  surface normals as RGB
//   steps    ray-march step count heatmap; magenta = counted as a hit but never
//            converged (iteration limit), the usual source of speckles/holes
//   depth    distance along the ray, near = light
//   albedo   material color without lighting
//   slice    signed distance on an axis-aligned plane through the origin
//            (orange outside, blue inside, white = surface, bands every ~0.04)
//   grad     |gradient| of the distance on that plane; must be <= 1 for safe
//            ray marching. Pink/magenta = overestimated distance (overstepping)
//
// Options
//   --views a,b,...        default beauty,normals,steps,slice
//   --angles a,b,...       front | back | left | right | top | bottom | three-quarter | yaw:pitch (degrees)
//                          default front,three-quarter,right,top
//   --times t,...          default 0
//   --axes z,y,x           slice/grad planes (default z,y,x); --slice-offset, --slice-scale (half-height, default 1)
//   --size WxH             cell size (default 256x192)
//   --zoom k               >1 zooms in (default 1)
//   --set name=v[,v...]    set a uniform, e.g. an input() slider or mouse=0,0.5,-0.5
//   --base [ref]           also render with the base commit's compiler (default: merge-base with main)
//   --out file.png         sheet path (default test/out/inspect.png)
//   --json                 print all stats as JSON
//   --local                don't use a running --serve instance
//   --serve [port] / --stop

import fs from 'fs';
import path from 'path';
import http from 'http';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { launchRenderer } from './renderer.mjs';
import { resolveBase, buildBaseline } from './baseline.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DEFAULT_PORT = 47123;

// ---------- argument parsing ----------

const VALUE_OPTIONS = ['--views', '--angles', '--times', '--axes', '--slice-offset', '--slice-scale',
  '--size', '--zoom', '--set', '--out', '--code', '--serve', '--base'];

function parseArgs(argv) {
  const opts = { set: [] };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { positional.push(a); continue; }
    const key = a.slice(2);
    const next = argv[i + 1];
    const hasValue = next !== undefined && !next.startsWith('--');
    if (VALUE_OPTIONS.includes(a) && hasValue) {
      i++;
      if (key === 'set') opts.set.push(next);
      else opts[key] = next;
    } else {
      opts[key] = true;
    }
  }
  opts.target = positional[0];
  return opts;
}

const ANGLE_PRESETS = {
  front: [0, 0], back: [180, 0], left: [-90, 0], right: [90, 0],
  top: [0, 90], bottom: [0, -90], 'three-quarter': [35, 25],
};

function parseAngles(s) {
  return s.split(',').map((a) => {
    if (ANGLE_PRESETS[a]) return { label: a, yaw: ANGLE_PRESETS[a][0], pitch: ANGLE_PRESETS[a][1] };
    const [yaw, pitch = '0'] = a.split(':');
    if (isNaN(+yaw) || isNaN(+pitch)) throw new Error(`Bad angle '${a}'`);
    return { label: `${yaw}:${pitch}`, yaw: +yaw, pitch: +pitch };
  });
}

// Camera basis = rotateY(yaw) * rotateX(pitch), column-major for uniformMatrix3fv
function cameraMatrix(yawDeg, pitchDeg) {
  const y = (yawDeg * Math.PI) / 180, p = (pitchDeg * Math.PI) / 180;
  const cy = Math.cos(y), sy = Math.sin(y), cp = Math.cos(p), sp = Math.sin(p);
  // rows of Ry * Rx
  const m = [
    [cy, sy * sp, sy * cp],
    [0, cp, -sp],
    [-sy, cy * sp, cy * cp],
  ];
  // identity must be exact so the front view matches the minimal renderer
  const clean = (v) => (Math.abs(v) < 1e-12 ? 0 : v);
  return [m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]].map(clean);
}

// ---------- shader assembly ----------

const VIEWS = {
  beauty: { mode: 0 },
  normals: { mode: 1 },
  steps: { mode: 2, decode: 'steps' },
  depth: { mode: 3 },
  albedo: { mode: 4 },
  slice: { mode: 5, plane: true },
  grad: { mode: 6, plane: true, decode: 'grad' },
};

// Swap the minimal header's fixed camera for an orbitable one. With an identity
// _spCam, _spDist = 2 and _spPlane = 1.75 the math is unchanged.
function patchHeader(header) {
  const cam = '#define cameraPosition vec3(0.0,0.0,-2.0)';
  const world = /#define worldPos vec4\((.*)\*1\.75,0\.0,0\.0\)/;
  if (!header.includes(cam) || !world.test(header)) {
    throw new Error('minimalHeader changed shape; update patchHeader() in test/harness/inspect.mjs');
  }
  return header
    .replace(cam, 'uniform mat3 _spCam;\nuniform float _spDist;\nuniform float _spPlane;\n' +
      '#define cameraPosition (_spCam*vec3(0.0,0.0,-_spDist))')
    .replace(world, '#define worldPos vec4(_spCam*vec3($1*_spPlane,0.0),0.0)');
}

const DEBUG_FOOTER = `
// ---- inspect debug footer (test/harness/inspect.mjs) ----
uniform int _spSliceAxis;
uniform float _spSliceOffset;
uniform float _spSliceScale;

// Same loop as intersect() in glsl-lib, but also reports the step count
float _spMarch(vec3 ro, vec3 rd, out float steps, out bool converged) {
    float t = 0.0;
    steps = 0.0;
    converged = false;
    for (int i = 0; i < MAX_ITERATIONS; ++i) {
        float h = surfaceDistance(ro + rd*t);
        steps += 1.0;
        if (h < intersection_threshold) { converged = true; break; }
        if (t > max_dist) break;
        t += h*STEP_SIZE_CONSTANT;
    }
    return t;
}

vec3 _spSlicePoint() {
    vec2 uv = (gl_FragCoord.xy - 0.5*resolution) / resolution.y * 2.0 * _spSliceScale;
    if (_spSliceAxis == 0) return vec3(_spSliceOffset, uv.y, uv.x);
    if (_spSliceAxis == 1) return vec3(uv.x, _spSliceOffset, uv.y);
    return vec3(uv.x, uv.y, _spSliceOffset);
}

void main() {
    vec3 rayOrigin = (cameraPosition - sculptureCenter) / max(intersection_threshold, _scale);
    vec3 rayDirection = getRayDirection();
#if SP_MODE == 5 || SP_MODE == 6
    vec3 P = _spSlicePoint();
    float d = surfaceDistance(P);
  #if SP_MODE == 5
    vec3 col = (d > 0.0) ? vec3(0.9, 0.6, 0.3) : vec3(0.65, 0.85, 1.0);
    col *= 1.0 - exp(-6.0*abs(d));
    col *= 0.8 + 0.2*cos(150.0*d);
    col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.01, abs(d)));
    vec2 q = abs(gl_FragCoord.xy - 0.5*resolution);
    if (min(q.x, q.y) < 0.5) col = mix(col, vec3(0.0), 0.25);
    pc_fragColor = vec4(col, 1.0);
  #else
    float e = 0.0005;
    vec3 g = vec3(
        surfaceDistance(P + vec3(e, 0.0, 0.0)) - surfaceDistance(P - vec3(e, 0.0, 0.0)),
        surfaceDistance(P + vec3(0.0, e, 0.0)) - surfaceDistance(P - vec3(0.0, e, 0.0)),
        surfaceDistance(P + vec3(0.0, 0.0, e)) - surfaceDistance(P - vec3(0.0, 0.0, e))) / (2.0*e);
    float gm = clamp(floor(length(g)*1000.0 + 0.5), 0.0, 65535.0);
    float hi = floor(gm/256.0);
    pc_fragColor = vec4(hi/255.0, (gm - hi*256.0)/255.0, d < 0.0 ? 1.0 : 0.0, 1.0);
  #endif
#else
    float steps;
    bool converged;
    float t = _spMarch(rayOrigin, rayDirection, steps, converged);
    bool hit = t < max_dist;
  #if SP_MODE == 2
    float hi = floor(steps/256.0);
    float flags = (hit ? 128.0 : 0.0) + (converged ? 64.0 : 0.0);
    pc_fragColor = vec4(hi/255.0, (steps - hi*256.0)/255.0, flags/255.0, 1.0);
  #else
    if (!hit) discard;
    vec3 p = rayOrigin + rayDirection*t;
    vec3 normal = calcNormal(p);
    #if SP_MODE == 1
    pc_fragColor = vec4(normal*0.5 + 0.5, 1.0);
    #elif SP_MODE == 3
    pc_fragColor = vec4(vec3(1.0 - clamp((t - 1.0)/2.5, 0.0, 1.0)), 1.0);
    #elif SP_MODE == 4
      #ifdef SP_RAW_GLSL
    pc_fragColor = vec4(shade(p, normal), 1.0);
      #else
    pc_fragColor = vec4(shade(p, normal).mat.albedo, 1.0);
      #endif
    #endif
  #endif
#endif
}
`;

// Same order as sculptToFullGLSLSource / glslToFullGLSLSource
function assembleFrag(lib, kind, parts, view) {
  const { mode } = VIEWS[view];
  const footer = mode === 0
    ? (kind === 'glsl' ? lib.glslFragFooter : lib.fragFooter)
    : `#define SP_MODE ${mode}\n` + (kind === 'glsl' ? '#define SP_RAW_GLSL\n' : '') + DEBUG_FOOTER;
  return (
    patchHeader(lib.minimalHeader) +
    lib.usePBRHeader +
    lib.useHemisphereLight +
    parts.uniformsGLSL +
    'const float STEP_SIZE_CONSTANT = ' + parts.stepSizeConstant + ';\n' +
    'const int MAX_ITERATIONS = ' + parts.maxIterations + ';\n' +
    '#define MAX_REFLECTIONS ' + parts.maxReflections + (kind === 'glsl' ? ' \n' : '\n') +
    lib.sculptureStarterCode +
    parts.body +
    footer
  );
}

// ---------- compiling ----------

function loadTarget(opts) {
  if (opts.code !== undefined) return { name: 'code', kind: 'sculpt', src: opts.code };
  if (!opts.target) throw new Error('Give an example name, a .js/.glsl file, or --code "..."');
  for (const [kind, dir, ext] of [['sculpt', 'test/sculptExamples', '.js'], ['glsl', 'test/glslExamples', '.glsl']]) {
    const file = path.join(root, dir, opts.target + ext);
    if (fs.existsSync(file)) return { name: opts.target, kind, src: fs.readFileSync(file, 'utf8') };
  }
  const file = path.resolve(opts.cwd ?? process.cwd(), opts.target);
  if (fs.existsSync(file)) {
    return {
      name: path.basename(file).replace(/\.[^.]+$/, ''),
      kind: file.endsWith('.glsl') ? 'glsl' : 'sculpt',
      src: fs.readFileSync(file, 'utf8'),
    };
  }
  throw new Error(`No example or file named '${opts.target}'`);
}

function compileParts(entry, job) {
  let out;
  try {
    out = execFileSync(process.execPath, [path.join(root, 'test/harness/compile.mjs'), entry, '--parts'], {
      input: JSON.stringify([job]),
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (e) {
    throw new Error('Compiler crashed:\n' + (e.stderr?.toString() || e.message));
  }
  const { vert, lib, results } = JSON.parse(out.toString());
  if (results[0].error) throw new Error('Shader Park compile error:\n' + results[0].error);
  return { vert, lib, parts: results[0].parts };
}

// ---------- the inspect job ----------

function userUniforms(parts, sets) {
  const base = new Set(['time', 'opacity', '_scale', 'mouse', 'stepSize', 'resolution']);
  const out = [];
  // input()/input2D() sliders start at their default values (the minimal
  // renderer leaves them at 0 unless you pass updateUniforms)
  for (const u of parts.uniforms) {
    if (base.has(u.name)) continue;
    if (u.type === 'float') out.push({ name: u.name, type: 'float', value: u.value });
    else if (u.type === 'vec2') out.push({ name: u.name, type: 'vec2', value: [u.value.x, u.value.y] });
  }
  for (const s of sets) {
    const [name, v] = s.split('=');
    const values = v.split(',').map(Number);
    const type = ['float', 'float', 'vec2', 'vec3', 'vec4'][values.length];
    out.push({ name, type, value: values.length === 1 ? values[0] : values });
  }
  return out;
}

function annotateError(message, frag) {
  const lines = frag.split('\n');
  return message.split('\n').map((l) => {
    const m = l.match(/ERROR: \d+:(\d+):/);
    return m ? `${l}\n    > ${(lines[+m[1] - 1] ?? '').trim()}` : l;
  }).join('\n');
}

export async function runInspect(opts, renderer) {
  const start = performance.now();
  const job = loadTarget(opts);
  const views = (opts.views ?? 'beauty,normals,steps,slice').split(',');
  for (const v of views) if (!VIEWS[v]) throw new Error(`Unknown view '${v}'. Views: ${Object.keys(VIEWS).join(', ')}`);
  const angles = parseAngles(opts.angles ?? 'front,three-quarter,right,top');
  const times = (opts.times ?? '0').split(',').map(Number);
  const axes = (opts.axes ?? 'z,y,x').split(',');
  const [cellW, cellH] = (opts.size ?? '256x192').split('x').map(Number);
  const zoom = Number(opts.zoom ?? 1);
  const sliceScale = Number(opts['slice-scale'] ?? 1) / zoom;
  const sliceOffset = Number(opts['slice-offset'] ?? 0);

  const sides = [{ suffix: '', ...compileParts(path.join(root, 'test/harness/entry.mjs'), job) }];
  if (opts.base) {
    const base = resolveBase(root, opts.base === true ? undefined : opts.base);
    const { bundlePath } = await buildBaseline(root, base.sha);
    try {
      sides.push({ suffix: ` @${base.ref === 'origin/main' || base.ref === 'main' ? 'base' : base.ref}`, ...compileParts(bundlePath, job) });
    } catch (e) {
      sides.push({ suffix: ' @base', error: e.message });
    }
  }

  const fragDir = path.join(root, 'test/out/inspect');
  fs.mkdirSync(fragDir, { recursive: true });

  const rows = [];
  const cells = [];
  const frags = [];
  let cols = 0;
  for (const view of views) {
    const { plane, decode } = VIEWS[view];
    const columns = plane
      ? axes.flatMap((axis) => times.map((t) => ({ label: `${axis}=${sliceOffset}${times.length > 1 ? ` t=${t}` : ''}`, axis, t })))
      : angles.flatMap((a) => times.map((t) => ({ label: `${a.label}${times.length > 1 ? ` t=${t}` : ''}`, a, t })));
    cols = Math.max(cols, columns.length);
    const firstCellOfSide = [];
    for (const side of sides) {
      const row = rows.length;
      rows.push(view + side.suffix);
      firstCellOfSide.push(cells.length);
      if (side.error) {
        cells.push({ row, col: 0, label: 'error', frag: 'compile error', uniforms: [], error: side.error });
        continue;
      }
      const frag = assembleFrag(side.lib, job.kind, side.parts, view);
      frags.push({ view, side: side.suffix, frag });
      fs.writeFileSync(path.join(fragDir, `${view}${side.suffix.replace(/\W+/g, '-')}.frag`), frag);
      const uniforms = userUniforms(side.parts, opts.set ?? []);
      columns.forEach((c, col) => {
        const u = [
          ...uniforms,
          { name: 'time', type: 'float', value: c.t },
          { name: '_spCam', type: 'mat3', value: cameraMatrix(c.a?.yaw ?? 0, c.a?.pitch ?? 0) },
          { name: '_spDist', type: 'float', value: 2.0 },
          { name: '_spPlane', type: 'float', value: 1.75 / zoom },
          { name: '_spSliceAxis', type: 'int', value: { x: 0, y: 1, z: 2 }[c.axis] ?? 2 },
          { name: '_spSliceOffset', type: 'float', value: sliceOffset },
          { name: '_spSliceScale', type: 'float', value: sliceScale },
        ];
        cells.push({ row, col, label: c.label, frag, uniforms: u, decode, maxIterations: side.parts.maxIterations });
      });
    }
    // diff row: current vs base, beauty only (diff any view with --diff-all)
    if (sides.length === 2 && !sides[1].error && (view === 'beauty' || opts['diff-all'])) {
      const row = rows.length;
      rows.push(`${view} diff`);
      columns.forEach((c, col) => {
        cells.push({ row, col, label: c.label, diffOf: [firstCellOfSide[0] + col, firstCellOfSide[1] + col] });
      });
    }
  }

  const result = await renderer.renderSheet({
    cellW, cellH, cols, rows,
    vert: sides[0].vert,
    cells: cells.map(({ error, ...c }) => (error ? { ...c, frag: '#error' } : c)),
  });
  // annotate shader errors with the offending source line
  result.cells.forEach((c, i) => {
    if (cells[i].error) c.error = cells[i].error;
    else if (c.error && cells[i].frag) c.error = annotateError(c.error, cells[i].frag);
  });

  const outPath = path.resolve(opts.cwd ?? process.cwd(), opts.out ?? path.join(root, 'test/out/inspect.png'));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(result.sheet, 'base64'));
  return {
    target: job.name,
    sheet: outPath,
    frags: path.relative(root, fragDir),
    ms: Math.round(performance.now() - start),
    cells: result.cells,
  };
}

function summarize(s) {
  if (!s) return '';
  const parts = [];
  if (s.coveragePct !== undefined) parts.push(`cover ${s.coveragePct}%`);
  if (s.meanColor) parts.push(`mean rgb(${s.meanColor.join(',')})`);
  if (s.avgSteps !== undefined) parts.push(`steps avg ${s.avgSteps} max ${s.maxSteps}/${s.maxIterations}`);
  if (s.hitNotConvergedPct) parts.push(`UNCONVERGED HITS ${s.hitNotConvergedPct}%`);
  if (s.maxGrad !== undefined) parts.push(`|grad| avg ${s.avgGrad} max ${s.maxGrad}`);
  if (s.overestimatePct) parts.push(`OVERESTIMATE ${s.overestimatePct}%`);
  if (s.changedPct !== undefined) parts.push(`changed ${s.changedPct}%`);
  return parts.join('  ');
}

function printResult(r, json) {
  if (json) {
    console.log(JSON.stringify(r, null, 2));
    return;
  }
  for (const c of r.cells) {
    const head = `${c.row.padEnd(16)} ${c.label.padEnd(16)}`;
    if (c.error) console.log(`${head} ERROR ${c.error.split('\n').slice(0, 6).join('\n' + ' '.repeat(34))}`);
    else console.log(`${head} ${summarize(c.stats)}`);
  }
  console.log(`sheet: ${path.relative(process.cwd(), r.sheet)}  frags: ${r.frags}/  (${r.ms} ms)`);
}

// ---------- server / client ----------

function request(port, route, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: route, method: 'POST', timeout: 300000 }, (res) => {
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end(JSON.stringify(body ?? {}));
  });
}

async function serve(port) {
  const renderer = await launchRenderer();
  let queue = Promise.resolve();
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      if (req.url === '/stop') {
        res.end('{}');
        server.close();
        renderer.close().then(() => process.exit(0));
        return;
      }
      // one render at a time; the page has a single GL context
      queue = queue.then(async () => {
        try {
          const r = await runInspect(JSON.parse(body), renderer);
          res.writeHead(200).end(JSON.stringify(r));
        } catch (e) {
          res.writeHead(500).end(JSON.stringify({ error: e.message }));
        }
      });
    });
  });
  server.listen(port, '127.0.0.1', () => console.log(`inspect server on 127.0.0.1:${port} (stop with --stop)`));
}

const opts = parseArgs(process.argv.slice(2));
const port = Number(opts.port ?? DEFAULT_PORT);

if (opts.serve) {
  await serve(opts.serve === true ? port : Number(opts.serve));
} else if (opts.stop) {
  await request(port, '/stop').catch(() => console.log('no server running'));
} else {
  opts.cwd = process.cwd();
  let result;
  if (!opts.local) {
    try {
      const res = await request(port, '/inspect', opts);
      const body = JSON.parse(res.body);
      if (res.status !== 200) {
        console.error(body.error);
        process.exit(1);
      }
      result = body;
    } catch (e) {
      if (e.code !== 'ECONNREFUSED') throw e;
    }
  }
  if (!result) {
    const renderer = await launchRenderer();
    try {
      result = await runInspect(opts, renderer);
    } catch (e) {
      console.error(e.message);
      await renderer.close();
      process.exit(1);
    }
    await renderer.close();
  }
  printResult(result, opts.json);
  process.exit(result.cells.some((c) => c.error) ? 1 : 0);
}
