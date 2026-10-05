/**
 * Reads the signature of the last function in a GLSL snippet, for binding
 * glslFunc / glslFuncES3 / glslSDF to JS. Only the signature is parsed; the
 * function bodies are checked by the GPU's shader compiler.
 *
 * Returns { name, returnType, params: [{ type, qualifiers }] }.
 */

// Component counts, matching the GLSL parser this replaced
const TYPE_SIZES = {
  void: 1, bool: 1, int: 1, float: 1, sampler2D: 1, samplerCube: 1,
  vec2: 2, vec3: 3, vec4: 4,
  bvec2: 2, bvec3: 3, bvec4: 4,
  ivec2: 2, ivec3: 3, ivec4: 4,
  mat2: 4, mat3: 9, mat4: 16,
};

const QUALIFIERS = new Set(["in", "out", "inout", "const", "highp", "mediump", "lowp", "precise"]);

export function glslTypeSize(type) {
  return TYPE_SIZES[type];
}

function tokenize(src) {
  // drop comments and preprocessor lines (with \ line continuations)
  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/[^\n]*/g, " ")
    .replace(/^[ \t]*#(?:[^\n]*\\\n)*[^\n]*/gm, " ");
  return code.match(/[A-Za-z_]\w*|\d+\.?\d*(?:[eE][+-]?\d+)?[uUfF]?|\.\d+(?:[eE][+-]?\d+)?[fF]?|\S/g) || [];
}

const isIdentifier = (t) => t !== undefined && /^[A-Za-z_]\w*$/.test(t);

export function lastFunctionSignature(src) {
  const tokens = tokenize(src);
  let last = null;
  let depth = 0; // brace depth

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "{") depth++;
    else if (t === "}") depth--;
    if (depth !== 0) continue;

    // `type name (` at the top level starts a function definition or prototype
    if (isIdentifier(t) && tokens[i + 1] === "(" && isIdentifier(tokens[i - 1]) && !QUALIFIERS.has(tokens[i - 1])) {
      let j = i + 2;
      let parenDepth = 1;
      const params = [[]];
      for (; j < tokens.length && parenDepth > 0; j++) {
        const p = tokens[j];
        if (p === "(") parenDepth++;
        else if (p === ")") parenDepth--;
        if (parenDepth === 0) break;
        if (p === "," && parenDepth === 1) params.push([]);
        else params[params.length - 1].push(p);
      }
      const after = tokens[j + 1];
      if (after !== "{" && after !== ";") continue;
      last = {
        name: t,
        returnType: tokens[i - 1],
        params: params
          .filter((p) => p.length && !(p.length === 1 && p[0] === "void"))
          .map((p) => ({
            type: p.find((tok) => !QUALIFIERS.has(tok)),
            qualifiers: p.filter((tok) => QUALIFIERS.has(tok)),
          })),
      };
      i = j; // continue after the parameter list; the body's braces are tracked above
    }
  }

  if (!last) {
    throw new Error("no function definition found");
  }
  return last;
}
