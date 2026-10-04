// Compiler entry point for the harness. The same re-exports are generated for
// the base commit's code (see baseline.mjs), so both sides expose one shape.
export * from '../../targets/minimalRenderer.js';
export * as glslLib from '../../glsl/glsl-lib.js';
export { baseUniforms, uniformsToGLSL } from '../../generators/sculpt.js';
