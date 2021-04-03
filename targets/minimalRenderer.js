import {sculptToGLSL, baseUniforms, uniformsToGLSL} from '../generators/sculpt.js'
import {
    usePBRHeader,
    useHemisphereLight,
    sculptureStarterCode,
    minimalHeader,
    minimalVertexSource,
    fragFooter,
} from '../glsl/glsl-lib.js'


export function glslToMinimalRenderer(canvas, source, updateUniforms) {
    const fullFrag = minimalHeader
    + usePBRHeader
    + useHemisphereLight
    + uniformsToGLSL(baseUniforms()) 
    + 'const float STEP_SIZE_CONSTANT = 0.9;\n'
    + sculptureStarterCode 
    + source
    + fragFooter;
    return fragToMinimalRenderer(canvas, fullFrag, updateUniforms);
}

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
    return fragToMinimalRenderer(canvas, fullFrag, updateUniforms);
}

function fragToMinimalRenderer(canvas, fullFrag, updateUniforms) {

    // if no update function is provided assume no-op
    if (updateUniforms === undefined) {
        updateUniforms = () => {return {}};
    }

    function resizeCanvas() {
        const devicePixelRatio = window.devicePixelRatio || 1;
        // change this so canvas doesn't have to fill entire window
        const width = window.innerWidth*devicePixelRatio;
        const height = window.innerHeight*devicePixelRatio;
        if (canvas.width != width ||
            canvas.height != height) {
            canvas.width = width;
            canvas.height = height;
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const gl = canvas.getContext('webgl');
    const vertices = [
        -1.0,1.0,0.0,
        -1.0,-1.0,0.0,
        1.0,-1.0,0.0,
        1.0,1.0,0.0 
    ];
    const indices = [3,2,1,3,1,0];
    const vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    const Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, minimalVertexSource);
    gl.compileShader(vertShader);
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fullFrag);
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
    const coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    gl.clearColor(1.0, 1.0, 1.0, 0.9);
    gl.enable(gl.DEPTH_TEST);
    const oTime = Date.now();
    const loc = gl.getUniformLocation(shaderProgram, "time");
    const _scale = gl.getUniformLocation(shaderProgram, "_scale");
    const wloc = gl.getUniformLocation(shaderProgram, "w_width");
    const hloc = gl.getUniformLocation(shaderProgram, "w_height");
    const opac = gl.getUniformLocation(shaderProgram, "opacity");
    const mouseloc = gl.getUniformLocation(shaderProgram, "mouse");
    gl.uniform1f(opac,1.0);
    gl.uniform1f(_scale, 1.0);

    const userUniformUpdateFuncs = assignUniforms(updateUniforms);

    canvas.addEventListener("mousemove", function(e) {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const canvasX = (e.pageX - canvas.offsetLeft) * devicePixelRatio;
        const canvasY = (e.pageY - canvas.offsetTop) * devicePixelRatio;
        gl.uniform3f(mouseloc, 2.0*canvasX/canvas.width-1.0, 2.0*(1.0-canvasY/canvas.height)-1.0, -0.5);
    }, false);
    function updateDraw() {
        if(typeof updateUniforms === 'function' ) {
            callUniformFuncs(userUniformUpdateFuncs, updateUniforms());
        }

        gl.uniform1f(loc, (Date.now()-oTime)*0.001);
        const devicePixelRatio = window.devicePixelRatio || 1;
        const wwidth = window.innerWidth*devicePixelRatio;
        const wheight = window.innerHeight*devicePixelRatio;
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
            console.error('updateUniforms must return a dictionary of uniform names and values. Instead got: ', updateUniforms);
            return;
        }
        Object.entries(uniformFuncs).forEach(keys => {
            const [key, uniformUpdateFunc] = keys;
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
        const userUniformUpdateFuncs = {};
        const uniformsDict = updateUniforms();
        if(uniformsDict !== undefined && typeof uniformsDict === 'object') {
            Object.entries(uniformsDict).forEach(keys => {
                const [key, val] = keys;
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