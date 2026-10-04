// Compiles examples to full fragment shaders with a given compiler entry module.
// Runs as a child process so every harness run picks up fresh source code.
//
// usage:  node compile.mjs <entry module path> [--parts]
// stdin:  JSON [{ name, kind: 'sculpt' | 'glsl', src }]
// stdout: JSON { vert, results: [{ name, frag, error, ms }] }
//         with --parts, each result has `parts` (the pieces of the shader,
//         for assembling custom/debug shaders) instead of `frag`, and the
//         output includes `lib` (the GLSL library strings)

import { pathToFileURL } from 'url';

const lib = await import(pathToFileURL(process.argv[2]).href);

let input = '';
for await (const chunk of process.stdin) input += chunk;
const jobs = JSON.parse(input);

// sculpt.js logs with console.log/error; keep stdout clean for JSON
console.log = console.error;

// Older commits don't export glslToFullGLSLSource; rebuild it the way
// glslToMinimalRenderer did.
function glslToFullGLSLSource(src) {
  if (lib.glslToFullGLSLSource) return lib.glslToFullGLSLSource(src);
  const g = lib.glslLib;
  return (
    g.minimalHeader +
    g.usePBRHeader +
    g.useHemisphereLight +
    lib.uniformsToGLSL(lib.baseUniforms()) +
    'const float STEP_SIZE_CONSTANT = 0.9;\n' +
    'const int MAX_ITERATIONS = 300;\n' +
    '#define MAX_REFLECTIONS 0 \n' +
    g.sculptureStarterCode +
    src +
    g.glslFragFooter
  );
}

const partsMode = process.argv.includes('--parts');

function compileParts(kind, src) {
  if (kind === 'glsl') {
    return {
      uniforms: lib.baseUniforms(),
      uniformsGLSL: lib.uniformsToGLSL(lib.baseUniforms()),
      stepSizeConstant: 0.9,
      maxIterations: 300,
      maxReflections: 0,
      body: src,
    };
  }
  const g = lib.sculptToGLSL(src);
  return {
    uniforms: g.uniforms,
    uniformsGLSL: lib.uniformsToGLSL(g.uniforms),
    stepSizeConstant: g.stepSizeConstant,
    maxIterations: g.maxIterations,
    maxReflections: g.maxReflections,
    body: g.geoGLSL + '\n' + g.colorGLSL + '\n',
  };
}

const results = jobs.map(({ name, kind, src }) => {
  const start = performance.now();
  try {
    if (partsMode) return { name, kind, parts: compileParts(kind, src), ms: performance.now() - start };
    const frag = kind === 'glsl' ? glslToFullGLSLSource(src) : lib.sculptToFullGLSLSource(src);
    return { name, frag, ms: performance.now() - start };
  } catch (e) {
    return { name, error: String(e?.stack ?? e), ms: performance.now() - start };
  }
});

const g = lib.glslLib;
const libStrings = partsMode && {
  minimalHeader: g.minimalHeader,
  usePBRHeader: g.usePBRHeader,
  useHemisphereLight: g.useHemisphereLight,
  sculptureStarterCode: g.sculptureStarterCode,
  fragFooter: g.fragFooter,
  glslFragFooter: g.glslFragFooter,
};
process.stdout.write(JSON.stringify({ vert: g.minimalVertexSource, lib: libStrings || undefined, results }));
