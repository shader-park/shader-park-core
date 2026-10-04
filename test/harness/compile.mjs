// Compiles examples to full fragment shaders with a given compiler entry module.
// Runs as a child process so every harness run picks up fresh source code.
//
// usage:  node compile.mjs <entry module path>
// stdin:  JSON [{ name, kind: 'sculpt' | 'glsl', src }]
// stdout: JSON { vert, results: [{ name, frag, error, ms }] }

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

const results = jobs.map(({ name, kind, src }) => {
  const start = performance.now();
  try {
    const frag = kind === 'glsl' ? glslToFullGLSLSource(src) : lib.sculptToFullGLSLSource(src);
    return { name, frag, ms: performance.now() - start };
  } catch (e) {
    return { name, error: String(e?.stack ?? e), ms: performance.now() - start };
  }
});

process.stdout.write(JSON.stringify({ vert: lib.glslLib.minimalVertexSource, results }));
