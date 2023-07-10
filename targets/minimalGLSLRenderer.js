export function baseUniforms() {
    return [
      { name: "time", type: "float", value: 0.0 },
      { name: "opacity", type: "float", value: 1.0 },
      { name: "_scale", type: "float", value: 1.0 },
      // {name:'sculptureCenter', type: 'vec3', value: [0,0,0]},
      { name: "mouse", type: "vec3", value: [0.5, 0.5, 0.5] },
      { name: "stepSize", type: "float", value: 0.85 },
      { name: "resolution", type: "vec2", value: [800, 600] },
    ];
}

export function uniformsToGLSL(uniforms) {
    let uniformsHeader = "";
    for (let i = 0; i < uniforms.length; i++) {
      let uniform = uniforms[i];
      uniformsHeader += `uniform ${uniform.type} ${uniform.name};\n`;
    }
    return uniformsHeader;
}

// import {
//     baseUniforms,
//     uniformsToGLSL,
// } from "../generators/sculpt.js";

// import {
//     generatedGLSLToMinimalRenderer
// } from "./minimalRenderer";

console.log('using shader-park-core version: [VI]{version}[/VI]');

export function glslToMinimalRenderer(canvas, source, updateUniforms) {
    const fullFrag =
      minimalHeader +
      usePBRHeader +
      useHemisphereLight +
      uniformsToGLSL(baseUniforms()) +
      "const float STEP_SIZE_CONSTANT = 0.9;\n" +
      "const int MAX_ITERATIONS = 300;\n" +
      "#define MAX_REFLECTIONS 0 \n" +
      sculptureStarterCode +
      source +
      glslFragFooter;
    return fragToMinimalRenderer(canvas, fullFrag, updateUniforms);
}

function fragToMinimalRenderer(canvas, fullFrag, updateUniforms) {
    // if no update function is provided assume no-op
    if (updateUniforms === undefined) {
      updateUniforms = () => {
        return {};
      };
    }
  
    function resizeCanvas() {
      const devicePixelRatio = window.devicePixelRatio || 1;
      // change this so canvas doesn't have to fill entire window
      const width = window.innerWidth * devicePixelRatio;
      const height = window.innerHeight * devicePixelRatio;
      if (canvas.width != width || canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
      }
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    const gl = canvas.getContext("webgl2");
    // Learn more: https://github.com/mrdoob/three.js/pull/21358
    const vertices = [
      -1.0, -1.0, 0.0, 3.0, -1.0, 0.0, -1.0, 3.0, 0.0,
    ];
    const indices = [0, 1, 2];
    // const vertices = [
    //   -1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,
    // ];
    // const indices = [3, 2, 1, 3, 1, 0];
    const vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    const Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  
    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, minimalVertexSource);
    gl.compileShader(vertShader);
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fullFrag);
    gl.compileShader(fragShader);
    let logShaderComp = (shader) => {
      let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      console.log("Shader compiled successfully: " + compiled);
      let compilationLog = gl.getShaderInfoLog(shader);
      if (!compiled) console.error("Shader compiler log: " + compilationLog);
    };
    logShaderComp(vertShader);
    logShaderComp(fragShader);
  
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
  
    // Check if it linked.
    const success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!success) {
      // something went wrong with the link; get the error
      console.error(
        "program failed to link:" + gl.getProgramInfoLog(shaderProgram)
      );
    }
  
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
    const resolution = gl.getUniformLocation(shaderProgram, "resolution");
    const opac = gl.getUniformLocation(shaderProgram, "opacity");
    const mouseloc = gl.getUniformLocation(shaderProgram, "mouse");
    gl.uniform1f(opac, 1.0);
    gl.uniform1f(_scale, 1.0);
  
    const userUniformUpdateFuncs = assignUniforms(updateUniforms);
  
    canvas.addEventListener(
      "pointermove",
      function (e) {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const canvasX = (e.pageX - canvas.offsetLeft) * devicePixelRatio;
        const canvasY = (e.pageY - canvas.offsetTop) * devicePixelRatio;
        gl.uniform3f(
          mouseloc,
          (2.0 * canvasX) / canvas.width - 1.0,
          2.0 * (1.0 - canvasY / canvas.height) - 1.0,
          -0.5
        );
      },
      false
    );
    function updateDraw() {
      if (typeof updateUniforms === "function") {
        callUniformFuncs(userUniformUpdateFuncs, updateUniforms());
      }
  
      gl.uniform1f(loc, (Date.now() - oTime) * 0.001);
      const devicePixelRatio = window.devicePixelRatio || 1;
      const wwidth = window.innerWidth * devicePixelRatio;
      const wheight = window.innerHeight * devicePixelRatio;
      gl.uniform2fv(resolution, [wwidth, wheight]);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      window.requestAnimationFrame(updateDraw);
    }
    updateDraw();
  
    // loops through a dictionary and calls the function sotred in the value
    function callUniformFuncs(uniformFuncs, updatedUniforms) {
      if (typeof updatedUniforms !== "object") {
        console.error(
          "updateUniforms must return a dictionary of uniform names and values. Instead got: ",
          updateUniforms
        );
        return;
      }
      Object.entries(uniformFuncs).forEach((keys) => {
        const [key, uniformUpdateFunc] = keys;
        if (key in updatedUniforms) {
          uniformUpdateFunc(updatedUniforms[key]);
        }
      });
    }
  
    function assignUniforms(updateUniforms) {
      if (typeof updateUniforms !== "function") {
        console.error(
          "updateUniforms must be a function that returns a dictionary of uniform names and values"
        );
        return {};
      }
      const userUniformUpdateFuncs = {};
      const uniformsDict = updateUniforms();
      if (uniformsDict !== undefined && typeof uniformsDict === "object") {
        Object.entries(uniformsDict).forEach((keys) => {
          const [key, val] = keys;
          const unifLocation = gl.getUniformLocation(shaderProgram, key);
          if (typeof val === "number") {
            userUniformUpdateFuncs[key] = (unif) =>
              gl.uniform1f(unifLocation, unif);
          } else if (Array.isArray(val)) {
            if (val.length === 1) {
              userUniformUpdateFuncs[key] = (unif) =>
                gl.uniform1f(unifLocation, unif[0]);
            } else if (val.length === 2) {
              userUniformUpdateFuncs[key] = (unif) =>
                gl.uniform2iv(unifLocation, unif);
            } else if (val.length === 3) {
              userUniformUpdateFuncs[key] = (unif) =>
                gl.uniform3iv(unifLocation, unif);
            } else if (val.length === 4) {
              userUniformUpdateFuncs[key] = (unif) =>
                gl.uniform4iv(unifLocation, unif);
            } else {
              console.error(
                "Uniforms must be either a float or an array with length 1, 2, 3 or 4"
              );
            }
          } else {
            console.error(
              "Uniforms must be either a float or an array with length 1, 2, 3 or 4"
            );
          }
        });
      }
      return userUniformUpdateFuncs;
    }
}
