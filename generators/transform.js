/**
 * Rewrites Shader Park source so operators work on shader values. JS has no
 * operator overloading, so `a * b` becomes `mult(a, b)` before the code runs.
 *
 * Rules (same as the original esprima/escodegen version):
 * - binary + - * / become add/sub/mult/divide calls
 * - unary minus on a plain identifier becomes mult(-1, x)
 * - a compound assignment that is a statement on its own (`x += y;`) becomes
 *   `x = x + y` (rewritten to add(x, y)); %= becomes `x = x % (y)`. Compound
 *   assignments anywhere else (e.g. a for-loop update) are left alone
 * - `let name = input(...)` / `input2D(...)` gets the variable name inserted
 *   as the first argument (first declarator of a declaration only)
 *
 * Only the rewritten spans change; everything else (formatting, comments,
 * line numbers) is kept from the original source.
 */

import { parse } from "acorn";

const BINARY_CALLS = { "*": "mult", "/": "divide", "-": "sub", "+": "add" };
const COMPOUND = { "+=": "+", "-=": "-", "*=": "*", "/=": "/", "%=": "%" };

export function transformOperators(src) {
  const tokens = [];
  const ast = parse(src, { ecmaVersion: "latest", sourceType: "script", onToken: tokens });

  // index of the first token starting at or after `pos`
  function tokenIndexAt(pos) {
    let lo = 0;
    let hi = tokens.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tokens[mid].start < pos) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  // the operator token between two child nodes (skips parens and comments)
  function operatorStart(from, to, op) {
    for (let i = tokenIndexAt(from); i < tokens.length && tokens[i].start < to; i++) {
      if (tokens[i].value === op && tokens[i].type.binop !== undefined) return tokens[i];
    }
    throw new Error(`transformOperators: can't find '${op}' between ${from} and ${to}`);
  }

  const text = (start, end) => src.slice(start, end);
  // source between an operand and the operator (parens, comments, newlines),
  // without surrounding spaces; newlines are kept so line numbers still match
  const gap = (start, end) => text(start, end).replace(/^[ \t]+|[ \t]+$/g, "");

  // Source of `node` with its children rewritten
  function gen(node) {
    switch (node.type) {
      case "BinaryExpression": {
        const fn = BINARY_CALLS[node.operator];
        if (!fn) break;
        const op = operatorStart(node.left.end, node.right.start, node.operator);
        return (
          fn + "(" +
          text(node.start, node.left.start) + gen(node.left) + gap(node.left.end, op.start) +
          ", " +
          gap(op.end, node.right.start) + gen(node.right) + text(node.right.end, node.end) +
          ")"
        );
      }
      case "Literal":
        // Legacy octal numbers (`01`, `00`, `08`) and octal string escapes are
        // syntax errors in strict mode, which user code runs in. The original
        // esprima/escodegen version re-printed literals from their values, so
        // these worked; do the same for them.
        if (typeof node.value === "number" && /^0\d/.test(node.raw)) {
          return String(node.value);
        }
        if (typeof node.value === "string" && /\\(0\d|[1-7])/.test(node.raw)) {
          return JSON.stringify(node.value);
        }
        break;
      case "UnaryExpression":
        if (node.operator === "-" && node.argument.type === "Identifier") {
          return "mult(-1, " + node.argument.name + ")";
        }
        break;
      case "ExpressionStatement": {
        const e = node.expression;
        if (e.type === "AssignmentExpression" && COMPOUND[e.operator]) {
          const op = COMPOUND[e.operator];
          const left = gen(e.left);
          const right = gen(e.right);
          const value = BINARY_CALLS[op]
            ? `${BINARY_CALLS[op]}(${left}, ${right})`
            : `${left} ${op} (${right})`;
          return text(node.start, e.start) + `${left} = ${value}` + text(e.end, node.end);
        }
        break;
      }
      case "VariableDeclaration": {
        const d = node.declarations[0];
        const init = d && d.init;
        if (
          init &&
          init.type === "CallExpression" &&
          init.callee.type === "Identifier" &&
          (init.callee.name === "input" || init.callee.name === "input2D") &&
          d.id.type === "Identifier"
        ) {
          const genInit = () =>
            genChildren(init, gen, {
              // insert the name right after the opening paren
              afterCallee: JSON.stringify(d.id.name) + (init.arguments.length ? ", " : ""),
            });
          return genChildren(node, (declarator) =>
            declarator === d
              ? genChildren(d, (child) => (child === init ? genInit() : gen(child)))
              : gen(declarator)
          );
        }
        break;
      }
    }
    return genChildren(node, gen);
  }

  // Splices rewritten children into the node's source text
  function genChildren(node, genChild, { afterCallee } = {}) {
    const children = [];
    for (const key of Object.keys(node)) {
      if (key === "type" || key === "start" || key === "end") continue;
      const value = node[key];
      if (Array.isArray(value)) {
        for (const v of value) if (v && typeof v.type === "string") children.push(v);
      } else if (value && typeof value.type === "string") {
        children.push(value);
      }
    }
    children.sort((a, b) => a.start - b.start);
    let out = "";
    let pos = node.start;
    for (const child of children) {
      if (child.start < pos) continue; // shared node (e.g. shorthand property)
      out += text(pos, child.start) + genChild(child);
      pos = child.end;
      if (afterCallee !== undefined && child === node.callee) {
        const paren = tokens[tokenIndexAt(pos)]; // the call's opening paren
        out += text(pos, paren.end) + afterCallee;
        pos = paren.end;
        afterCallee = undefined;
      }
    }
    return out + text(pos, node.end);
  }

  return gen(ast);
}
