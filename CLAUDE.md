# shader-park-core

Compiles Shader Park code (JS) to GLSL raymarching shaders, with targets for
three.js, a minimal WebGL renderer, TouchDesigner, p5, Hydra and more.

- `generators/sculpt.js`: the compiler. User code is rewritten with esprima
  (operators become `add()`/`mult()` calls), then `eval`'d; running it records GLSL.
- `glsl/glsl-lib.js`: GLSL library (SDFs, lighting, raymarch loop, footers).
- `targets/`: wraps generated GLSL for each environment.
- The build (`npm run build`, Rollup) must stay `--no-treeshake`: much of the
  API is only referenced from `eval`'d strings, so tree-shaking drops it.

## Testing and inspecting shader output

Source runs directly in Node, so none of these tools need a build.

- `npm run harness`: compiles every example with the working tree and with the
  merge-base with main, and fails if rendered pixels differ (identical GLSL
  skips rendering). Takes about 0.5 s. Use it after any change to `generators/`,
  `glsl/` or `targets/`. Add `--watch` while iterating, or `--base <ref>`.
  It also diffs the three.js and TouchDesigner shader text against main and
  prints `diff` commands for any change. TouchDesigner can't be run here, so
  review those diffs by hand.
- `npm run inspect -- <example | file | --code "...">`: renders a labeled
  contact sheet to `test/out/inspect.png` (read it as an image) with per-cell
  stats. Views: `beauty` (matches the minimal renderer exactly), `normals`,
  `steps` (raymarch heatmap; magenta = unconverged hits), `depth`, `albedo`,
  `slice` (signed distance on a plane), `grad` (|gradient| > 1 means
  overstepping). `--base` adds main's render plus a diff row; `--angles`,
  `--times`, `--set uniform=v` and `--json` are also available. Usage is in
  the header of `test/harness/inspect.mjs`.
- For repeated inspection, start `npm run inspect -- --serve` in the background
  (later calls drop from about 3 s to under 1 s), and stop it with `--stop`.
- `npm test`: end-to-end check of the built bundle in real pages, including
  each example through three.js (`createSculpture` + `WebGLRenderer`), which
  must match the minimal render. CI runs it, plus `npm run harness -- --render`.

Outputs go to `test/out/` (gitignored). Nothing renders reference images into
git; the baseline compiler is built from git history and cached in
`test/.baseline/`.

## Conventions

- Don't add Claude/co-author attribution lines to commits.
