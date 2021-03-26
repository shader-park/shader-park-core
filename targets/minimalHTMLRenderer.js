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

export function sculptToMinimalHTMLRenderer(source) {

    const minimalHeader = `
precision highp float;
#define GLSL_NEED_ROUND
uniform float w_width;
uniform float w_height;
uniform mat4 projectionMatrix;
#define cameraPosition vec3(0.0,0.0,-1.0)
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
    return `
<!doctype html>
<html>
<style>
        body {width: 100%; height:100%; margin : 0px; padding : 0px; border : 0px; background-color : white;}
</style>
    <body>
        <canvas style="width: 100%; height:100%; margin : 0px; padding : 0px; border : 0px; background-color : white;" id = "my_Canvas"></canvas>
        <script>
        var canvas = document.getElementById('my_Canvas');
        function resizeCanvas() {
            var devicePixelRatio = window.devicePixelRatio || 1;
            var width = window.innerWidth*devicePixelRatio;
            var height = window.innerHeight*devicePixelRatio;
            if (canvas.width != width ||
                canvas.height != height) {
                canvas.width = width;
                canvas.height = height;
            }
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        gl = canvas.getContext('webgl');
        var vertices = [
           -1.0,1.0,0.0,
           -1.0,-1.0,0.0,
           1.0,-1.0,0.0,
           1.0,1.0,0.0 
        ];
        indices = [3,2,1,3,1,0];
        var vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        var Index_Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        var vertCode =
            'attribute vec3 coordinates;' +
            'void main(void) {' +
                ' gl_Position = vec4(coordinates, 1.0);' +
            '}';
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertCode);
        gl.compileShader(vertShader);
        var fragCode = \`${fullFrag}\`;
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragCode);
        gl.compileShader(fragShader);
        var compiled = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
        console.log('Shader compiled successfully: ' + compiled);
        var compilationLog = gl.getShaderInfoLog(fragShader);
        console.log('Shader compiler log: ' + compilationLog);
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer); 
        var coord = gl.getAttribLocation(shaderProgram, "coordinates");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);
        gl.clearColor(1.0, 1.0, 1.0, 0.9);
        gl.enable(gl.DEPTH_TEST);
        var oTime = Date.now();
        var loc = gl.getUniformLocation(shaderProgram, "time");
        var wloc = gl.getUniformLocation(shaderProgram, "w_width");
        var hloc = gl.getUniformLocation(shaderProgram, "w_height");
        var opac = gl.getUniformLocation(shaderProgram, "opacity");
        var mouseloc = gl.getUniformLocation(shaderProgram, "mouse");
        gl.uniform1f(opac,1.0);
        canvas.addEventListener("mousemove", function(e) {
            var devicePixelRatio = window.devicePixelRatio || 1;
            var canvasX = (e.pageX - canvas.offsetLeft) * devicePixelRatio;
            var canvasY = (e.pageY - canvas.offsetTop) * devicePixelRatio;
            gl.uniform3f(mouseloc, 2.0*canvasX/canvas.width-1.0, 2.0*(1.0-canvasY/canvas.height)-1.0, -0.5);
        }, false);
        function updateDraw() {
            gl.uniform1f(loc, (Date.now()-oTime)*0.001);
            var devicePixelRatio = window.devicePixelRatio || 1;
            var wwidth = window.innerWidth*devicePixelRatio;
            var wheight = window.innerHeight*devicePixelRatio;
            gl.uniform1f(wloc, wwidth);
            gl.uniform1f(hloc, wheight);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(0,0,canvas.width,canvas.height);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
            window.requestAnimationFrame(updateDraw);
        }
        updateDraw();
      </script>
   </body>
</html>`
}
