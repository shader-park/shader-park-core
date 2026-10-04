// Compiler entry point for the harness. The same re-exports are generated for
// the base commit's code (see baseline.mjs), so both sides expose one shape.
export * from '../../targets/minimalRenderer.js';
export * as glslLib from '../../glsl/glsl-lib.js';
export { baseUniforms, uniformsToGLSL, sculptToGLSL } from '../../generators/sculpt.js';
export { sculptToThreeJSShaderSource, glslToThreeJSShaderSource } from '../../targets/threeJS.js';
export { sculptToTouchDesignerShaderSource, glslToTouchDesignerShaderSource } from '../../targets/touchDesigner.js';
