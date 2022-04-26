import {sculptToGLSL, baseUniforms, uniformsToGLSL, spCodeToMultiPassGLSL} from '../generators/sculpt.js'
import {
    threeJSVertexSource, 
    threeHeader,
    usePBRHeader,
    useHemisphereLight,
    sculptureStarterCode, 
    fragFooter,
} from '../glsl/glsl-lib.js'

import {convertFunctionToString} from './helpers.js'

import {MultiPostFX} from './multiPostFX.js';

import { Texture, Vector2, Vector3, Vector4, ShaderMaterial, Mesh, BoxBufferGeometry, BackSide, SphereBufferGeometry} from 'three';

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
        frag: threeHeader + 'const float STEP_SIZE_CONSTANT = 0.9;\n' + 'const int MAX_ITERATIONS = 300;\n' + uniformsToGLSL(baseUniforms()) + sculptureStarterCode + source + fragFooter,
        vert: threeJSVertexSource
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
    return generateThreeJSFrag(src);
}

function generateThreeJSFrag(src) {
    if (src.error) {
        console.log(src.error);
    }
    let frg = 
        threeHeader
    + usePBRHeader
    + useHemisphereLight
    + uniformsToGLSL(src.uniforms) 
    + 'const float STEP_SIZE_CONSTANT = ' + src.stepSizeConstant + ';\n'
    + 'const int MAX_ITERATIONS = ' + src.maxIterations + ';\n'
    + sculptureStarterCode 
    + src.geoGLSL 
    + '\n' 
    + src.colorGLSL 
    + '\n' 
    + fragFooter;
    // console.log(frg)
    return {
        uniforms: src.uniforms,
        frag: frg,
        vert: threeJSVertexSource,
        error: src.error,
        geoGLSL: src.geoGLSL,
        colorGLSL: src.colorGLSL
    };
}
// {buffera, bufferb, bufferc, finalImage}
export function multiPassSculpToThreeJSMaterial(passesSources) {
    const passes = spCodeToMultiPassGLSL(passesSources);
    let output = {};
    for (const [key, value] of Object.entries(passes)) {
        let src = generateThreeJSFrag(value);
        output[key] = src;
    }
    let finalImage = output['finalImage'];
    let material = makeMaterial(finalImage.uniforms, finalImage.vert, finalImage.frag);
    material.uniformDescriptions = finalImage.uniforms;
    output['finalImage'] = material;
    return output;
}

export function sculptToThreeJSMaterial(source, payload) {
    let src = sculptToThreeJSShaderSource(source);
    let material = makeMaterial(src.uniforms, src.vert, src.frag, payload);
    material.uniformDescriptions = src.uniforms;
    return material;
}

export function sculptToThreeJSMesh(source, payload) {
    source = convertFunctionToString(source);
    return makeBasicMesh(sculptToThreeJSMaterial(source, payload));
}

export function createSculptureWithGeometry(geometry, source, uniformCallback=() => {return {}}, params={}) {
    geometry.computeBoundingSphere();
    let radius = ('radius' in params)? params.radius: geometry.boundingSphere.radius;
    params.radius = radius;
    params.geometry = geometry;
    return createSculpture(source, uniformCallback, params);
}

export function createMultiPassSculptureWithGeometry(geometry, source, uniformCallback=() => {return {}}, params={}) {
    geometry.computeBoundingSphere();
    let radius = ('radius' in params)? params.radius: geometry.boundingSphere.radius;
    params.radius = radius;
    params.geometry = geometry;
    return createMultiPassSculpture(source, uniformCallback, params);
}

// let passes = {
//     bufferA: {
//         fragmentShader: `
//             precision highp float;
//             uniform sampler2D uScene;
//             uniform vec2 uResolution;
            
//             void main() {
//                 vec2 uv = gl_FragCoord.xy / uResolution.xy;
//                 vec4 color = texture2D(uScene, uv);
//                 // invert colors                 
//                 color = mix(color, vec4((1.0 - color.rgb) * color.a, color.a), step(uv.x, 0.5));
//                 //color = mix(color, vec4((1.0 - color.rgb) * color.a, color.a), step(uv.y, 0.5));
//                 gl_FragColor = color;
//             }
//         `,
//     }
// }

// let passes = {
//     bufferA: {
//         fragmentShader: `
//             precision highp float;
//             uniform vec2 resolution;
            
//             void main() {
//                 vec4 color = vec4(gl_FragCoord.xy / resolution.xy, 1., 1.);
//                 gl_FragColor = color;
//             }
//         `,
//     }
// }

// TODO NEXT Replace sculptToThreeJSMaterial with 
export function createMultiPassSculpture(source, uniformCallback=() => {return {}}, params={}) {
    let radius = ('radius' in params)? params.radius: 2;

    let geometry;
    if ('geometry' in params) {
        geometry = params.geometry;
    } else {
        let segments = ('segments' in params)? params.segments: 10;
        geometry = new SphereBufferGeometry( radius, segments, segments );   
    }
    let {bufferA, bufferB, bufferC, bufferD, finalImage} = multiPassSculpToThreeJSMaterial(source);
    let passes = {
        bufferA: {
            fragmentShader: bufferA.frag,
        },
        bufferB: {
            fragmentShader: bufferB.frag,
        },
        bufferC: {
            fragmentShader: bufferC.frag,
        },
        bufferD: {
            fragmentShader: bufferD.frag,
        }
    }
    // let material = sculptToThreeJSMaterial(finalImage);
    let material = finalImage;
    material.uniforms['opacity'].value = 1.0;
    material.uniforms['mouse'].value = new Vector3();
    material.uniforms['_scale'].value = radius;
    
    let mesh = new Mesh(geometry, material);
    let multiPost;
    let passNames = Object.keys(passes);
    mesh.onBeforeRender = function( renderer, scene, camera, geometry, material, group ) {
        if(!multiPost) {
            multiPost = new MultiPostFX({
                renderer,
                camera,
                passes
            });
            multiPost.resize();
            window.addEventListener('resize', () => {
                multiPost.resize();
            }, false);
            // console.log(multiPost)
        } else {
            
            passNames.forEach((passName) => {

                if(passName in material.uniforms){
                    // is passName our current Buffer?
                    
                    material.uniforms[passName].value = multiPost.passes[passName].target.texture;
                    //curPass.material.uniforms.lastFrame.value = curPass.targetOld.texture;
                
                }
                /*
                if (passName in multiPost.passes[passName].material.uniforms) {
                    console.log('setting passName', passName)
                    multiPost.passes[passName].material.uniforms[passName].value = multiPost.passes[passName].target.texture;  
                }
                */
            });
            
            // if('bufferA' in material.uniforms) {
            //     material.uniforms['bufferA'].value = multiPost.passes['bufferA'].target.texture;
            // }
            // if('bufferA' in multiPost.passes.bufferA.material.uniforms) {
            //     multiPost.passes['bufferA'].material.uniforms['bufferA'].value = multiPost.passes.bufferA.material.uniforms;

            // }
        }
        let uniformsToUpdate = uniformCallback();
        if (!(typeof uniformsToUpdate === "object")) {
            throw "createSculpture takes, (source, uniformCallback, params) the uniformCallback must be a function that returns a dictionary of uniforms to update"
        }
        for (const [uniform, value] of Object.entries(uniformsToUpdate)) {
            material.uniforms[uniform].value = value;
            for (const [passName, currPass] of Object.entries(multiPost.passes)) {
                currPass.material.uniforms[uniform].value = value;
            }
        }
        // material.uniforms['sculptureCenter'].value = geometry.position;
        multiPost.render(scene, camera);
    }
    return mesh;
}

// uniformCallback 
export function createSculpture(source, uniformCallback=() => {return {}}, params={}) {
    source = convertFunctionToString(source);

    let radius = ('radius' in params)? params.radius: 2;

    let geometry;
    if ('geometry' in params) {
        geometry = params.geometry;
    } else {
        let segments = ('segments' in params)? params.segments: 10;
        geometry = new SphereBufferGeometry( radius, segments, segments );   
    }
    let material = sculptToThreeJSMaterial(source);
    
    material.uniforms['opacity'].value = 1.0;
    material.uniforms['mouse'].value = new Vector3();
    material.uniforms['_scale'].value = radius;
    let mesh = new Mesh(geometry, material);

    mesh.onBeforeRender = function( renderer, scene, camera, geometry, material, group ) {
        let uniformsToUpdate = uniformCallback();
        if (!(typeof uniformsToUpdate === "object")) {
            throw "createSculpture takes, (source, uniformCallback, params) the uniformCallback must be a function that returns a dictionary of uniforms to update"
        }

        for (const [uniform, value] of Object.entries(uniformsToUpdate)) {
            material.uniforms[uniform].value = value;
        }
        // material.uniforms['sculptureCenter'].value = geometry.position;
    }

    return mesh;
}

function uniformDescriptionToThreeJSFormat(unifs, payload) {
    
    let finalUniforms = {};
    
    if (payload && payload !== undefined && payload.msdfTexture !== undefined) {
        finalUniforms["msdf"] = { value: payload.msdfTexture || new Texture() };
    }
    unifs.forEach(uniform => {
        if (uniform.type === 'float') {
            finalUniforms[uniform.name] = {value: uniform.value};
        } else if (uniform.type === 'vec2') {
            finalUniforms[uniform.name] = {value: new Vector2(uniform.value.x, uniform.value.y)};
        } else if (uniform.type === 'vec3') {
            finalUniforms[uniform.name] = {value: new Vector3(uniform.value.x, uniform.value.y, uniform.value.z)};
        } else if (uniform.type === 'vec4') {
            finalUniforms[uniform.name] = {value: new Vector4(uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w)};
        } else if(uniform.type === 'sampler2D') {
            finalUniforms[uniform.name] = {value: new Texture()}
        }
    });
    return finalUniforms;
} 

// could use a scale parameter
function makeMaterial(unifs, vert, frag, payload) {
    const material = new ShaderMaterial({
        uniforms: uniformDescriptionToThreeJSFormat(unifs, payload),
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        side: BackSide
    });
    // material.extensions.fragDepth = false;
    return material;
}

// There should be more options supported like size and shape
function makeBasicMesh(material) {
    return new Mesh(new BoxBufferGeometry(2, 2, 2), material);
}
