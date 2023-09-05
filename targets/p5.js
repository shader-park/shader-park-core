import {
  sculptToGLSL,
  uniformsToGLSL,
} from "../generators/sculpt.js";
import {
  usePBRHeader,
  useHemisphereLight,
  sculptureStarterCode,
  fragFooter,
} from "../glsl/glsl-lib.js";

export function toGLSL(source) {
  if (typeof source === "function") {
    source = source.toString();
    source = source.slice(source.indexOf("{") + 1, source.lastIndexOf("}"));
  } else if (!(typeof source === "string")) {
    throw "toGLSL requires the source code to be a function, or a string";
  }

  const vert = `#version 300 es
precision highp float;
in vec3 aPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
out vec4 worldPos;
out vec3 sculptureCenter;
out vec3 cameraPosition;
void main() {
  vec4 mvPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  mat4 inverseModelViewMatrix = inverse(uModelViewMatrix);

  worldPos = vec4(aPosition, 1.);
  sculptureCenter = vec3(0.);
  cameraPosition = (inverseModelViewMatrix * vec4(0., 0., 0., 1.0)).xyz;

  gl_Position = uProjectionMatrix * mvPosition;
}
`

  let generatedGLSL = sculptToGLSL(source);
  let frag = `#version 300 es
precision highp float;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
in vec4 worldPos;
in vec3 sculptureCenter;
in vec3 cameraPosition;
out vec4 pc_fragColor;
` +
    usePBRHeader +
    useHemisphereLight +
    uniformsToGLSL(generatedGLSL.uniforms) +
    "const float STEP_SIZE_CONSTANT = " +
    generatedGLSL.stepSizeConstant +
    ";\n" +
    "const int MAX_ITERATIONS = " +
    generatedGLSL.maxIterations +
    ";\n" +
    "#define MAX_REFLECTIONS " +
    generatedGLSL.maxReflections +
    "\n" + 
    sculptureStarterCode.replace(/max_dist = [\d\.]+;/, 'max_dist = 1000.0;') +
    generatedGLSL.geoGLSL +
    "\n" +
    generatedGLSL.colorGLSL +
    "\n" +
    fragFooter.replace(
      '#ifdef MAX_REFLECTIONS',
      `vec3 surface = rayOrigin + rayDirection*t;
      #ifdef MAX_REFLECTIONS`
    ).replace(
      'pc_fragColor = vec4(outputColor, opacity);',
      `pc_fragColor = vec4(outputColor, opacity);

      // Output the correct depth value (in the 0-1 range) so that regular
      // p5 3D objects interact in space correctly with Shader Park objects
      vec4 screen = uProjectionMatrix * uModelViewMatrix * vec4(surface, 1.);
      vec3 scaledScreen = screen.xyz / screen.w;
      gl_FragDepth = scaledScreen.z * 0.5 + 0.5;`
    );

  return { vert, frag };
}

function createRenderer(target, {
  scale = 1,
  drawGeometry = (() => target.sphere(100)),
} = {}) {
  const output = {
    shader: undefined,
    draw: () => {
      if (target.webglVersion !== target.WEBGL2) {
        throw new Error(
          'This p5 context uses WebGL1. Please use Shader Park on a WebGL2 context.'
        );
      }

      const gl = window._renderer.GL;
      const faceCullingEnabled = gl.isEnabled(gl.CULL_FACE);
      const cullFaceMode = gl.getParameter(gl.CULL_FACE_MODE);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.FRONT);

      target.push();
      target.noStroke();
      target.shader(output.shader);
      output.shader.setUniform('time', millis() / 1000);
      output.shader.setUniform('opacity', 1);
      output.shader.setUniform(
        'mouse',
        [
          target.map(target.mouseX, 0, target.width, -1, 1),
          target.map(target.mouseY, 0, target.height, 1, -1),
          -0.5
        ]
      );
      output.shader.setUniform('_scale', scale);
      output.shader.setUniform('stepSize', 0.85);
      output.shader.setUniform(
        'resolution',
        [width * target.pixelDensity(), height * target.pixelDensity()]
      );
      drawGeometry();
      if (!faceCullingEnabled) {
        gl.disable(gl.CULL_FACE);
      } else {
        gl.cullFace(cullFaceMode);
      }
      pop();
    },
  };

  return output;
}

export function load(target, url, options) {
  const output = createRenderer(target, options);
  loadStrings(url, (data) => {
    const src = data.join('\n');
    const { vert, frag } = toGLSL(src);
    output.shader = new p5.Shader();
    output.shader._vertSrc = vert;
    output.shader._fragSrc = frag;
  });

  return output;
}

export function create(target, src, options) {
  const output = createRenderer(target, options);
  const { vert, frag } = toGLSL(src);
  output.shader = new p5.Shader();
  output.shader._vertSrc = vert;
  output.shader._fragSrc = frag;

  return output;
}

function _loadShaderPark(url, options) {
  return load(this, url, options);
}
p5.prototype.loadShaderPark = _loadShaderPark;
p5.Graphics.prototype.loadShaderPark = _loadShaderPark;

function _createShaderPark(fn, options) {
  return create(this, fn, options);
}
p5.prototype.createShaderPark = _createShaderPark;
p5.Graphics.prototype.createShaderPark = _createShaderPark;
