import {sculptToGLSL, uniformsToGLSL} from '../generators/sculpt.js'
import {
    usePBRHeader,
    useHemisphereLight,
    sculptureStarterCode, 
    fragFooter,
} from '../glsl/glsl-lib.js'

/**
 * export for meshing with https://github.com/tdhooper/glsl-marching-cubes
 * input - sculpt code
 * output - glsl containing "mapDistance"
 **/
export function sculptToRawSDF4Meshing(source) {

    const minimalHeader = `
precision highp float;
#define GLSL_NEED_ROUND
uniform float w_width;
uniform float w_height;
uniform mat4 projectionMatrix;
#define cameraPosition vec3(0.0,0.0,-1.0)
#define vUv vec2(0.0)
#define worldPos vec4(vec2((gl_FragCoord.x/w_width-0.5)*(w_width/w_height),gl_FragCoord.y/w_height-0.5)*1.75,0.0,0.0)
#define STEP_SIZE_CONSTANT 0.9
#define MAX_ITERATIONS 300
#define stepSize 0.9
#define mouse vec3(0.0)
#define time 0.0
`;

    let generatedGLSL = sculptToGLSL(source);
    let fullFrag =
          minimalHeader
        + usePBRHeader
        + useHemisphereLight
        //+ uniformsToGLSL(generatedGLSL.uniforms) 
        + sculptureStarterCode 
        + generatedGLSL.geoGLSL;
    return fullFrag.replace(/surfaceDistance/g, 'mapDistance');
}
