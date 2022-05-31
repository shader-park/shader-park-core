import { sculptToGLSL, baseUniforms } from "../generators/sculpt.js";
import { sculptureStarterCode } from "../glsl/glsl-lib.js";

function uniformToCpp(uniforms) {
  let res = "";
  for (let i = 0; i < uniforms.length; i++) {
    const unif = uniforms[i];
    res += unif.type + " " + unif.name + " = ";
    if (typeof unif.value === "number") {
      // float
      res += unif.value + 0.0000001 + "f";
    } else {
      // vec
      res += "vec" + unif.value.length + "(";
      for (let j = 0; j < unif.value.length; j++) {
        res += unif.value[j] + 0.0000001 + "f";
        if (j + 1 < unif.value.length) {
          res += ", ";
        }
      }
      res += ")";
    }
    res += ";\n";
  }
  return res;
}

const cppFooter = `

`;

const cppHeader = uniformToCpp(baseUniforms());

function glslToGLM(source) {
  // converts all numbers to floats
  let result = source.replace(
    /([^a-zA-Z][0-9]+([.][^a-zA-Z][0-9]*)|[.][0-9]+)()/g,
    "$1f"
  );
  // adds parentheses after swizzling for glm to pick up
  result = result.replace(/([a-zA-Z0-9][.][w-z]{2,})()/g, "$1()");
  return result;
}

export function glslToOfflineRenderer(source) {}

export function sculptToOfflineRenderer(source) {
  const src = sculptToGLSL(source);

  //console.log(filteredStarter);
  return (
    cppHeader +
    glslToGLM(
      "const float STEP_SIZE_CONSTANT = " +
        src.stepSizeConstant +
        "f;\n" +
        "const int MAX_ITERATIONS = " +
        src.maxIterations +
        ";\n" +
        sculptureStarterCode +
        src.geoGLSL +
        src.colorGLSL
    ) +
    cppFooter
  );
}
