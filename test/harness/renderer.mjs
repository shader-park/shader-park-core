// Headless WebGL renderer shared by the harness tools. One Chrome page with a
// WebGL2 canvas (SwiftShader) that stays open across renders.
//
//   renderFrag(vert, frag)  one image, same uniforms/state as the minimal renderer
//   renderSheet(job)        many cells (views/angles/times) composed into one
//                           labeled contact sheet, plus per-cell stats

import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

// Runs inside the page. Kept as a real function (not a string) so it's
// syntax-checked and readable.
function pageMain() {
  const glCanvas = document.createElement('canvas');
  const gl = glCanvas.getContext('webgl2');
  window.glAvailable = !!gl;
  if (!gl) return;

  // Same full-screen triangle as targets/minimalRenderer.js
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), gl.STATIC_DRAW);
  const indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2]), gl.STATIC_DRAW);

  const programs = new Map();

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

  function getProgram(vert, frag) {
    const key = vert + '\0' + frag;
    if (programs.has(key)) return { program: programs.get(key), compileMs: 0 };
    const start = performance.now();
    const vs = compileShader(gl.VERTEX_SHADER, vert);
    const fs = compileShader(gl.FRAGMENT_SHADER, frag);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error('link failed: ' + log);
    }
    // keep the cache small; shaders are big
    if (programs.size > 24) {
      const [oldKey, old] = programs.entries().next().value;
      gl.deleteProgram(old);
      programs.delete(oldKey);
    }
    programs.set(key, program);
    return { program, compileMs: performance.now() - start };
  }

  function setUniform(program, { name, type, value }) {
    const loc = gl.getUniformLocation(program, name);
    if (loc === null) return;
    switch (type) {
      case 'float': gl.uniform1f(loc, value); break;
      case 'int': gl.uniform1i(loc, value); break;
      case 'vec2': gl.uniform2fv(loc, value); break;
      case 'vec3': gl.uniform3fv(loc, value); break;
      case 'vec4': gl.uniform4fv(loc, value); break;
      case 'mat3': gl.uniformMatrix3fv(loc, false, value); break;
    }
  }

  // Mirrors fragToMinimalRenderer: opacity 1, _scale 1, time, resolution.
  // Extra uniforms (camera, user inputs, debug settings) are set on top.
  function draw(vert, frag, width, height, uniforms = []) {
    const { program, compileMs } = getProgram(vert, frag);
    if (glCanvas.width !== width || glCanvas.height !== height) {
      glCanvas.width = width;
      glCanvas.height = height;
    }
    gl.useProgram(program);
    const coord = gl.getAttribLocation(program, 'coordinates');
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    gl.clearColor(1.0, 1.0, 1.0, 0.9);
    gl.enable(gl.DEPTH_TEST);
    setUniform(program, { name: 'opacity', type: 'float', value: 1.0 });
    setUniform(program, { name: '_scale', type: 'float', value: 1.0 });
    setUniform(program, { name: 'time', type: 'float', value: 0.0 });
    setUniform(program, { name: 'resolution', type: 'vec2', value: [width, height] });
    for (const u of uniforms) setUniform(program, u);
    const start = performance.now();
    // The minimal renderer only clears color, but the browser resets the depth
    // buffer whenever it composites a frame. This canvas is never composited,
    // so clear depth explicitly or repeat draws fail the depth test.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, width, height);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
    gl.finish();
    return { compileMs, drawMs: performance.now() - start };
  }

  function readPixels(width, height) {
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels;
  }

  function toBase64(bytes) {
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  }

  window.renderFrag = (vert, frag, width, height, uniforms) => {
    try {
      const { compileMs, drawMs } = draw(vert, frag, width, height, uniforms);
      return { ms: compileMs + drawMs, pixels: toBase64(readPixels(width, height)) };
    } catch (e) {
      return { error: e.message };
    }
  };

  // ---- decoders for data-encoded debug views ----

  // Rough turbo colormap, t in [0, 1]
  function turbo(t) {
    t = Math.min(1, Math.max(0, t));
    const r = 34.61 + t * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - t * 14825.05))));
    const g = 23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + t * 707.56))));
    const b = 27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - t * 6838.66))));
    return [r, g, b].map((v) => Math.max(0, Math.min(255, v)));
  }

  // steps view: R,G = 16-bit step count, B bit 7 = hit, bit 6 = converged
  function decodeSteps(raw, width, height, maxIterations) {
    const out = new ImageData(width, height);
    let hits = 0, total = 0, sumSteps = 0, maxSteps = 0, exhausted = 0, hitNotConverged = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = ((height - 1 - y) * width + x) * 4;
        const o = (y * width + x) * 4;
        const steps = raw[i] * 256 + raw[i + 1];
        const hit = (raw[i + 2] & 128) !== 0;
        const converged = (raw[i + 2] & 64) !== 0;
        total++;
        sumSteps += steps;
        maxSteps = Math.max(maxSteps, steps);
        if (steps >= maxIterations) exhausted++;
        if (hit) hits++;
        if (hit && !converged) hitNotConverged++;
        let c = turbo(steps / maxIterations);
        if (!hit) c = c.map((v) => v * 0.35 + 255 * 0.15);
        if (hit && !converged) c = [255, 0, 255];
        out.data.set([c[0], c[1], c[2], 255], o);
      }
    }
    const pct = (n) => +(100 * n / total).toFixed(2);
    return {
      image: out,
      stats: {
        coveragePct: pct(hits),
        avgSteps: +(sumSteps / total).toFixed(1),
        maxSteps,
        maxIterations,
        exhaustedPct: pct(exhausted),
        hitNotConvergedPct: pct(hitNotConverged),
      },
    };
  }

  // grad view: R,G = |grad d| * 1000 (16-bit), B = 255 inside the surface
  function decodeGrad(raw, width, height) {
    const out = new ImageData(width, height);
    let sum = 0, max = 0, over = 0, under = 0, total = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = ((height - 1 - y) * width + x) * 4;
        const o = (y * width + x) * 4;
        const g = (raw[i] * 256 + raw[i + 1]) / 1000;
        const inside = raw[i + 2] > 127;
        total++;
        sum += g;
        max = Math.max(max, g);
        if (g > 1.05) over++;
        if (g < 0.5) under++;
        let c;
        if (g > 1.05) {
          const k = Math.min(1, (g - 1.05) / 1.0);
          c = [255, 60 * (1 - k), 160 + 95 * k];          // overestimate: pink -> magenta
        } else {
          const v = 40 + 200 * Math.min(1, g);           // <= 1 is safe: dark (shrunk) to light (exact)
          c = inside ? [v * 0.8, v * 0.9, v] : [v, v * 0.95, v * 0.85];
        }
        out.data.set([c[0], c[1], c[2], 255], o);
      }
    }
    const pct = (n) => +(100 * n / total).toFixed(2);
    return {
      image: out,
      stats: { avgGrad: +(sum / total).toFixed(3), maxGrad: +max.toFixed(3), overestimatePct: pct(over), underHalfPct: pct(under) },
    };
  }

  // beauty-like views: coverage = pixels written with full opacity
  function coverageStats(raw) {
    let hits = 0, r = 0, g = 0, b = 0;
    const total = raw.length / 4;
    for (let i = 0; i < raw.length; i += 4) {
      if (raw[i + 3] === 255) {
        hits++; r += raw[i]; g += raw[i + 1]; b += raw[i + 2];
      }
    }
    return {
      coveragePct: +(100 * hits / total).toFixed(2),
      meanColor: hits ? [r, g, b].map((v) => Math.round(v / hits)) : null,
    };
  }

  // job: { vert, cellW, cellH, cols, rows, cells: [{ row, col, label, frag, uniforms, decode, maxIterations, diffOf }] }
  window.renderSheet = (job) => {
    const labelH = 16;
    const rowLabelW = 110;
    const gap = 2;
    const sheet = document.createElement('canvas');
    sheet.width = rowLabelW + job.cols * (job.cellW + gap);
    sheet.height = job.rows.length * (job.cellH + labelH);
    const ctx = sheet.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheet.width, sheet.height);
    ctx.font = '11px monospace';
    ctx.textBaseline = 'middle';

    job.rows.forEach((name, r) => {
      ctx.fillStyle = '#222';
      ctx.fillText(name, 6, r * (job.cellH + labelH) + labelH + job.cellH / 2);
    });

    const results = [];
    const cellPos = (c) => [rowLabelW + c.col * (job.cellW + gap), c.row * (job.cellH + labelH) + labelH];

    for (const cell of job.cells) {
      const [x, y] = cellPos(cell);
      ctx.fillStyle = '#555';
      ctx.fillText(cell.label, x + 4, y - labelH / 2);
      const result = { row: job.rows[cell.row], label: cell.label };
      results.push(result);

      if (cell.diffOf) {
        // compare two already-drawn cells
        const [ax, ay] = cellPos(job.cells[cell.diffOf[0]]);
        const [bx, by] = cellPos(job.cells[cell.diffOf[1]]);
        const a = ctx.getImageData(ax, ay, job.cellW, job.cellH).data;
        const b = ctx.getImageData(bx, by, job.cellW, job.cellH).data;
        const out = ctx.createImageData(job.cellW, job.cellH);
        let changed = 0;
        for (let i = 0; i < a.length; i += 4) {
          const d = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
          const gray = 255 - 0.15 * (255 - (a[i] + a[i + 1] + a[i + 2]) / 3);
          if (d > 25) changed++;
          out.data.set(d > 25 ? [255, 0, 0, 255] : [gray, gray, gray, 255], i);
        }
        ctx.putImageData(out, x, y);
        result.stats = { changedPct: +(100 * changed / (a.length / 4)).toFixed(2) };
        continue;
      }

      try {
        const { compileMs, drawMs } = draw(job.vert, cell.frag, job.cellW, job.cellH, cell.uniforms);
        result.compileMs = Math.round(compileMs);
        result.drawMs = Math.round(drawMs);
        if (cell.decode) {
          const raw = readPixels(job.cellW, job.cellH);
          const decoded = cell.decode === 'steps'
            ? decodeSteps(raw, job.cellW, job.cellH, cell.maxIterations)
            : decodeGrad(raw, job.cellW, job.cellH);
          ctx.putImageData(decoded.image, x, y);
          result.stats = decoded.stats;
        } else {
          result.stats = coverageStats(readPixels(job.cellW, job.cellH));
          // draw in the same task so the drawing buffer is still valid
          ctx.drawImage(glCanvas, x, y);
        }
      } catch (e) {
        result.error = e.message.trim();
        ctx.fillStyle = '#fee';
        ctx.fillRect(x, y, job.cellW, job.cellH);
        ctx.fillStyle = '#c00';
        e.message.trim().split('\n').slice(0, Math.floor(job.cellH / 13)).forEach((line, i) => {
          ctx.fillText(line.slice(0, Math.floor(job.cellW / 6.6)), x + 4, y + 10 + i * 13);
        });
      }
    }
    return { sheet: sheet.toDataURL('image/png').split(',')[1], cells: results };
  };
}

const PAGE_HTML = `<!DOCTYPE html><html><head><style>html, body { margin: 0; background: white; }</style>
</head><body><script>(${pageMain.toString()})();</script></body></html>`;

export async function launchRenderer() {
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
  await page.setContent(PAGE_HTML);
  if (!(await page.evaluate(() => window.glAvailable))) {
    await browser.close();
    throw new Error('WebGL2 is not available in headless Chrome (SwiftShader)');
  }
  return {
    browser,
    page,
    renderFrag: (vert, frag, width, height, uniforms = []) =>
      page.evaluate((...a) => window.renderFrag(...a), vert, frag, width, height, uniforms),
    renderSheet: (job) => page.evaluate((j) => window.renderSheet(j), job),
    close: () => browser.close(),
  };
}

// WebGL pixels are bottom-up and premultiplied (the context default). Flip them
// and composite over white the way the browser compositor does.
export function pixelsToImage(raw, width, height) {
  const png = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    const src = (height - 1 - y) * width * 4;
    const dst = y * width * 4;
    for (let x = 0; x < width * 4; x += 4) {
      const a = raw[src + x + 3];
      for (let c = 0; c < 3; c++) {
        png.data[dst + x + c] = Math.min(255, raw[src + x + c] + (255 - a));
      }
      png.data[dst + x + 3] = 255;
    }
  }
  return png;
}
