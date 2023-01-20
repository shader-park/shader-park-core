import {
  sculptToGLSL,
  uniformsToGLSL,
} from "../generators/sculpt.js";
import {
  usePBRHeader,
  useHemisphereLight,
  sculptureStarterCode,
  hydraHeader,
  hydraFragFooter,
} from "../glsl/glsl-lib.js";

export function sculptToHydraRenderer(source) {
  const frag = sculptToHydraGLSL(source);
  return {
    out: (output) => {
      const uniforms = {
        time: output.regl.prop('time'),
        opacity: 0.5,
        _scale: 1.0,
        resolution: output.regl.prop('resolution'),
        stepSize: 0.85,
      }

      // By default hydra doesn't clear the framebuffers
      output.tick = (props) => {
        /*
        output.regl.clear({
          color: [0, 0, 0, 1],
          framebuffer: output.getCurrent(),
        })
        */
        output.draw(props)
      }

      output.render([{frag, uniforms}])
    }
  };
}

export function sculptToHydraGLSL(source) {
  if (typeof source === "function") {
    source = source.toString();
    source = source.slice(source.indexOf("{") + 1, source.lastIndexOf("}"));
  } else if (!(typeof source === "string")) {
    throw "sculptToHydraRenderer requires the source code to be a function, or a string";
  }

  let generatedGLSL = sculptToGLSL(source);
  let fullFrag =
    hydraHeader +
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
    sculptureStarterCode +
    generatedGLSL.geoGLSL +
    "\n" +
    generatedGLSL.colorGLSL +
    "\n" +
    hydraFragFooter;
  return fullFrag;
}
