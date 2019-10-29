import {sculptToGLSL, baseUniforms, uniformsToGLSL} from '../jsapi/generate.js'
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
        frag: threeHeader + uniformsToGLSL(baseUniforms()) + sculptureStarterCode + source + fragFooter,
        vert: defaultVertexSource
    }
}

export function glslToThreeJSMaterial(source) {
    let src = glslToThreeJSShaderSource(source);
    return makeMaterial(src.uniforms, src.vert, src.frag);
}

export function glslToThreeJSMesh(source) {
    return makeBasicMesh(glslToThreeJSMaterial(source));
}

export function sculptToThreeJSShaderSource(source) {
    const src = sculptToGLSL(source);
    if (src.error) {
        console.log(src.error);
    }
    return {
        uniforms: src.uniforms,
        frag: threeHeader + uniformsToGLSL(src.uniforms) + sculptureStarterCode + src.geoGLSL + '\n' + src.colorGLSL + '\n' + fragFooter,
        vert: defaultVertexSource,
        error: src.error
    };
}

export function sculptToThreeJSMaterial(source) {
    let src = sculptToThreeJSShaderSource(source);
    return makeMaterial(src.uniforms, src.vert, src.frag);
}

export function sculptToThreeJSMesh(source) {
    return makeBasicMesh(sculptToThreeJSMaterial(source));
}

function uniformDescriptionToThreeJSFormat(unifs) {
    let finalUniforms = {
        msdf: { value: this.MSDFTexture || new THREE.Texture() }
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
function makeMaterial(unifs, vert, frag) {
    const material = new THREE.ShaderMaterial({
        uniforms: uniformDescriptionToThreeJSFormat(unifs),
        vertexShader: src.vert,
        fragmentShader: src.frag,
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