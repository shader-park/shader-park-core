import {sculptToGLSL, uniformsToGLSL} from '../generators/sculpt.js'
import {
    usePBRHeader,
    useHemisphereLight,
    sculptureStarterCode, 
    fragFooter,
} from '../glsl/glsl-lib.js'

/**
 * for fast and efficient use on the web
 * input - sculpt code
 * output - a fully self-contained lightweight html file which renders the sculpture
 **/
export function sculptToMinimalRenderer(canvas, source, updateUniforms) {
    if (typeof source === "function") {
        source = source.toString();
        source = source.slice(source.indexOf("{") + 1, source.lastIndexOf("}"));
    } else if (!(typeof source === "string")) {
        throw "sculptToMinimalRenderer requires the source code to be a function, or a string"
    } 

    const minimalHeader = `
precision highp float;
#define GLSL_NEED_ROUND
uniform float w_width;
uniform float w_height;
uniform mat4 projectionMatrix;
#define cameraPosition vec3(0.0,0.0,-2.0)
#define vUv vec2(0.0)
#define worldPos vec4(vec2((gl_FragCoord.x/w_width-0.5)*(w_width/w_height),gl_FragCoord.y/w_height-0.5)*1.75,0.0,0.0)
`;

    let generatedGLSL = sculptToGLSL(source);
    let fullFrag =
        minimalHeader
        + usePBRHeader
        + useHemisphereLight
        + uniformsToGLSL(generatedGLSL.uniforms) 
        + 'const float STEP_SIZE_CONSTANT = ' + generatedGLSL.stepSizeConstant + ';\n'
        + sculptureStarterCode 
        + generatedGLSL.geoGLSL 
        + '\n' 
        + generatedGLSL.colorGLSL 
        + '\n' 
        + fragFooter;

    function resizeCanvas() {
        let devicePixelRatio = window.devicePixelRatio || 1;
        let width = window.innerWidth*devicePixelRatio;
        let height = window.innerHeight*devicePixelRatio;
        if (canvas.width != width ||
            canvas.height != height) {
            canvas.width = width;
            canvas.height = height;
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    let gl = canvas.getContext('webgl');
    let vertices = [
    -1.0,1.0,0.0,
    -1.0,-1.0,0.0,
    1.0,-1.0,0.0,
    1.0,1.0,0.0 
    ];
    let indices = [3,2,1,3,1,0];
    let vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    let Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    let vertCode =
        'attribute vec3 coordinates;' +
        'varying vec3 sculptureCenter;' +
        'void main(void) {' +
            ' sculptureCenter = vec3(0.0);' +
            ' gl_Position = vec4(coordinates, 1.0);' +
        '}';
    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);
    let fragCode = fullFrag;
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    let compiled = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
    console.log('Shader compiled successfully: ' + compiled);
    let compilationLog = gl.getShaderInfoLog(fragShader);
    if (!compiled) console.log('Shader compiler log: ' + compilationLog);
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer); 
    let coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    gl.clearColor(1.0, 1.0, 1.0, 0.9);
    gl.enable(gl.DEPTH_TEST);
    let oTime = Date.now();
    let loc = gl.getUniformLocation(shaderProgram, "time");
    let _scale = gl.getUniformLocation(shaderProgram, "_scale");
    let wloc = gl.getUniformLocation(shaderProgram, "w_width");
    let hloc = gl.getUniformLocation(shaderProgram, "w_height");
    let opac = gl.getUniformLocation(shaderProgram, "opacity");
    let mouseloc = gl.getUniformLocation(shaderProgram, "mouse");
    gl.uniform1f(opac,1.0);
    gl.uniform1f(_scale, 1.0);

    let userUniformUpdateFuncs = assignUniforms(updateUniforms);

    canvas.addEventListener("mousemove", function(e) {
        let devicePixelRatio = window.devicePixelRatio || 1;
        let canvasX = (e.pageX - canvas.offsetLeft) * devicePixelRatio;
        let canvasY = (e.pageY - canvas.offsetTop) * devicePixelRatio;
        gl.uniform3f(mouseloc, 2.0*canvasX/canvas.width-1.0, 2.0*(1.0-canvasY/canvas.height)-1.0, -0.5);
    }, false);
    function updateDraw() {
        if(typeof updateUniforms === 'function' ){
            callUniformFuncs(userUniformUpdateFuncs, updateUniforms());
        }

        gl.uniform1f(loc, (Date.now()-oTime)*0.001);
        let devicePixelRatio = window.devicePixelRatio || 1;
        let wwidth = window.innerWidth*devicePixelRatio;
        let wheight = window.innerHeight*devicePixelRatio;
        gl.uniform1f(wloc, wwidth);
        gl.uniform1f(hloc, wheight);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0,0,canvas.width,canvas.height);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
        window.requestAnimationFrame(updateDraw);
    }
    updateDraw();

    // loops through a dictionary and calls the function sotred in the value
    function callUniformFuncs(uniformFuncs, updatedUniforms) {
        if(typeof updatedUniforms !== 'object') {
            console.error('updateUniforms must be a function that returns a dictionary of uniform names and values');
            return;
        }
        Object.entries(uniformFuncs).forEach(keys => {
            let [key, uniformUpdateFunc] = keys;
            if (key in updatedUniforms) {
                uniformUpdateFunc(updatedUniforms[key]);
            }
        });
    }

    function assignUniforms(updateUniforms) {
        if(typeof updateUniforms !== 'function') {
            console.error('updateUniforms must be a function that returns a dictionary of uniform names and values');
            return {};
        }
        let userUniformUpdateFuncs = {};
        let uniformsDict = updateUniforms();
        if(uniformsDict !== undefined && typeof uniformsDict === 'object') {
            Object.entries(uniformsDict).forEach(keys => {
                let [key, val] = keys;
                const unifLocation = gl.getUniformLocation(shaderProgram, key);
                if(typeof val === 'number') {
                    userUniformUpdateFuncs[key] = (unif) => gl.uniform1f(unifLocation, unif);
                } else if (Array.isArray(val)) {
                    if(val.length === 1) {
                        userUniformUpdateFuncs[key] = (unif) => gl.uniform1f(unifLocation, unif[0]);
                    } else if(val.length === 2) {
                        userUniformUpdateFuncs[key] = (unif) => gl.uniform2iv(unifLocation, unif);
                    } else if(val.length === 3) {
                        userUniformUpdateFuncs[key] = (unif) => gl.uniform3iv(unifLocation, unif);
                    } else if(val.length === 4) {
                        userUniformUpdateFuncs[key] = (unif) => gl.uniform4iv(unifLocation, unif);
                    } else {
                        console.error('Uniforms must be either a float or an array with length 1, 2, 3 or 4');
                    }
                } else {
                    console.error('Uniforms must be either a float or an array with length 1, 2, 3 or 4');
                }
            });
        }
        return userUniformUpdateFuncs;
    }    
}
