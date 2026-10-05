/**
 * Checks GLSL from glslFunc / glslFuncES3 / glslSDF with the browser's real
 * shader compiler, so mistakes are reported when the sculpture is compiled
 * (with the snippet's own line numbers) instead of only as a failed shader
 * later. Catches syntax errors, type errors and undefined names.
 *
 * The snippets are compiled the way they appear in the final shader: after the
 * Shader Park header, uniforms and GLSL library. Only errors inside a user's
 * snippet are reported. Without WebGL (e.g. Node) this does nothing.
 */

let gl; // shared WebGL2 context, created on first use
let lastChecked = null; // source of the last successful check, to skip repeats

function getContext() {
  if (gl === undefined) {
    gl = null;
    try {
      const canvas =
        typeof OffscreenCanvas !== "undefined"
          ? new OffscreenCanvas(1, 1)
          : typeof document !== "undefined"
          ? document.createElement("canvas")
          : null;
      gl = (canvas && canvas.getContext("webgl2")) || null;
    } catch (e) {
      gl = null;
    }
  }
  if (gl && gl.isContextLost()) {
    gl = undefined;
    return null;
  }
  return gl;
}

/**
 * @param preamble everything that precedes the snippets in the real shader
 * @param snippets [{ src, user: boolean, kind, name }] in shader order
 * @returns null if fine (or unchecked), otherwise an error message
 */
export function validateGLSLSnippets(preamble, snippets) {
  if (!snippets.some((s) => s.user)) return null;
  const context = getContext();
  if (!context) return null;

  // Assemble the test shader, remembering where each snippet starts
  let source = preamble.endsWith("\n") ? preamble : preamble + "\n";
  let line = source.split("\n").length; // 1-based line of the next text
  const ranges = [];
  for (const snippet of snippets) {
    const text = snippet.src.endsWith("\n") ? snippet.src : snippet.src + "\n";
    const lineCount = text.split("\n").length - 1;
    ranges.push({ snippet, first: line, last: line + lineCount - 1 });
    source += text;
    line += lineCount;
  }
  source += "void main() {}\n";

  if (source === lastChecked) return null;

  const shader = context.createShader(context.FRAGMENT_SHADER);
  context.shaderSource(shader, source);
  context.compileShader(shader);
  const ok = context.getShaderParameter(shader, context.COMPILE_STATUS);
  const log = ok ? "" : context.getShaderInfoLog(shader) || "";
  context.deleteShader(shader);
  if (ok) {
    lastChecked = source;
    return null;
  }

  // Report errors that fall inside a user's snippet, using its line numbers
  const messages = [];
  for (const entry of log.split("\n")) {
    const m = entry.match(/^ERROR:\s*\d+:(\d+):\s*(.*)$/);
    if (!m) continue;
    const errorLine = Number(m[1]);
    const range = ranges.find((r) => errorLine >= r.first && errorLine <= r.last);
    if (!range || !range.snippet.user) continue;
    const snippetLine = errorLine - range.first + 1;
    const code = range.snippet.src.split("\n")[snippetLine - 1];
    const where = range.snippet.name ? `${range.snippet.kind} '${range.snippet.name}'` : range.snippet.kind;
    messages.push(
      `glsl error in ${where}, line ${snippetLine}: ${m[2].trim()}` +
        (code !== undefined ? `\n    ${code.trim()}` : "")
    );
  }
  return messages.length ? messages.join("\n") : null;
}
