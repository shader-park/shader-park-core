import {sourceGenerator} from './jsapi/generate.js'
import {
    defaultVertexSource, 
    defaultFragSourceJS, 
    defaultFragSourceGLSL, 
    sculptureStarterCode, 
    fragFooter
} from './jsapi/default-shader.js'

function glslToThreejs(source) {

}

function sculptToThreejs(source) {
    const src = sourceGenerator(source);
    return sculptureStarterCode + src.geoGLSL + '\n' + src.colorGLSL + '\n' + fragFooter;
}

function sculptToUnity(source) {

}

export {
    sculptToThreejs,
    sourceGenerator,
    defaultVertexSource,
    defaultFragSourceJS,
    defaultFragSourceGLSL,
    sculptureStarterCode,
    fragFooter
}
