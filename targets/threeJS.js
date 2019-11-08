import {sculptToGLSL, baseUniforms, uniformsToGLSL} from '../generators/sculpt.js'
import {
    defaultVertexSource, 
    threeHeader,
    sculptureStarterCode, 
    fragFooter
} from '../glsl/glsl-lib.js'

import * as THREE from 'three';

/**
 *  Three targets are provided for both GLSL and Sculpt/JS api.
 * 
 *  1: source -> Threejs shader source components (easy customization)
 *  2: source -> Threejs material
 *  3: source -> Threejs mesh (easy to use)
 * 
 * TODO: make these materials 'plug in' to threejs' lighting model, like unity's surface shaders
 */

export function glslToThreeJSShaderSource(source) {
    return {
        uniforms: baseUniforms(),
        frag: threeHeader + 'const float STEP_SIZE_CONSTANT = 0.9;\n' + uniformsToGLSL(baseUniforms()) + sculptureStarterCode + source + fragFooter,
        vert: defaultVertexSource
    }
}

export function glslToThreeJSMaterial(source, payload) {
    let src = glslToThreeJSShaderSource(source);
    return makeMaterial(src.uniforms, src.vert, src.frag, payload);
}

export function glslToThreeJSMesh(source, payload) {
    return makeBasicMesh(glslToThreeJSMaterial(source, payload));
}

export function sculptToThreeJSShaderSource(source) {
    const src = sculptToGLSL(source);
    if (src.error) {
        console.log(src.error);
    }
    let frg = 
          threeHeader 
        + uniformsToGLSL(src.uniforms) 
        + 'const float STEP_SIZE_CONSTANT = ' + src.stepSizeConstant + ';\n'
        + sculptureStarterCode 
        + src.geoGLSL 
        + '\n' 
        + src.colorGLSL 
        + '\n' 
        + fragFooter;

    return {
        uniforms: src.uniforms,
        frag: frg,
        vert: defaultVertexSource,
        error: src.error
    };
}

export function sculptToThreeJSMaterial(source, payload) {
    let src = sculptToThreeJSShaderSource(source);
    let material = makeMaterial(src.uniforms, src.vert, src.frag, payload);
    material.uniformDescriptions = src.uniforms;
    return material;
}

export function sculptToThreeJSMesh(source, payload) {
    return makeBasicMesh(sculptToThreeJSMaterial(source, payload));
}

function uniformDescriptionToThreeJSFormat(unifs, payload) {
    let finalUniforms = {
        msdf: { value: payload.msdfTexture || new THREE.Texture() }
    }
    
    unifs.forEach(uniform => {
        if (typeof uniform.value === 'number') {
            finalUniforms[uniform.name] = {value: uniform.value}
        } else if (uniform.value.length === 2) {
            finalUniforms[uniform.name] = {value: new THREE.Vector2(uniform.value[0], uniform.value[1])};
        } else if (uniform.value.length === 3) {
            finalUniforms[uniform.name] = {value: new THREE.Vector3(uniform.value[0], uniform.value[1], uniform.value[2])};
        }
    });
    return finalUniforms;
} 

// could use a scale parameter
function makeMaterial(unifs, vert, frag, payload) {
    const material = new THREE.ShaderMaterial({
        uniforms: uniformDescriptionToThreeJSFormat(unifs, payload),
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        side: THREE.BackSide
    });
    material.extensions.fragDepth = false;
    return material;
}

// There should be more options supported like size and shape
function makeBasicMesh(material) {
    return new THREE.Mesh(new THREE.BoxBufferGeometry(1.0, 1.0, 1.0), material);
}