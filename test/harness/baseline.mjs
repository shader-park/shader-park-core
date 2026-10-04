// Builds the compiler from a base commit so the harness can compare against it.
// The base's source is exported with `git archive` and bundled with Rollup
// (older commits can't be imported by Node directly), then cached by commit hash
// in test/.baseline/.

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const git = (root, ...args) =>
  execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

// Default base: where this branch forked from main (origin/main if available).
// On main itself that's HEAD, so you're comparing against your last commit.
export function resolveBase(root, requested) {
  const candidates = requested ? [requested] : ['origin/main', 'main'];
  for (const ref of candidates) {
    try {
      const sha = requested
        ? git(root, 'rev-parse', '--verify', `${ref}^{commit}`)
        : git(root, 'merge-base', 'HEAD', ref);
      return { ref, sha };
    } catch {}
  }
  throw new Error(`Can't resolve base ${requested ?? 'origin/main or main'}`);
}

export async function buildBaseline(root, sha) {
  const dir = path.join(root, 'test/.baseline', sha);
  const bundlePath = path.join(dir, 'compiler.mjs');
  if (fs.existsSync(bundlePath)) return { bundlePath, cached: true };

  const src = path.join(dir, 'src');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(src, { recursive: true });
  const archive = execFileSync('git', ['archive', sha, 'generators', 'glsl', 'targets'], {
    cwd: root,
    maxBuffer: 256 * 1024 * 1024,
  });
  execFileSync('tar', ['-x', '-C', src], { input: archive });

  const entry = path.join(src, 'entry.js');
  fs.writeFileSync(entry, [
    "export * from './targets/minimalRenderer.js';",
    "export * as glslLib from './glsl/glsl-lib.js';",
    "export { baseUniforms, uniformsToGLSL } from './generators/sculpt.js';",
  ].join('\n'));

  const bundle = await rollup({
    input: entry,
    plugins: [resolve({ rootDir: root }), commonjs(), json()],
    // sculpt.js references most of its API only from eval'd strings, so
    // tree-shaking would drop it (same reason the build uses --no-treeshake)
    treeshake: false,
    onwarn: () => {},
  });
  await bundle.write({ file: bundlePath, format: 'es', inlineDynamicImports: true });
  await bundle.close();
  fs.rmSync(src, { recursive: true, force: true });
  return { bundlePath, cached: false };
}
