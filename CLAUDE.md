# shader-park-core

Compiles Shader Park code (JS) to GLSL raymarching shaders, with targets for
three.js, a minimal WebGL renderer, TouchDesigner, p5, Hydra and more.

- `generators/sculpt.js`: the compiler. User code is rewritten with esprima
  (operators become `add()`/`mult()` calls), then `eval`'d; running it records GLSL.
- `glsl/glsl-lib.js`: GLSL library (SDFs, lighting, raymarch loop, footers).
- `targets/`: wraps generated GLSL for each environment.
- User code runs via `new Function(...apiNames, code)` with the API passed in
  explicitly (`api` at the end of `sculptToGLSL`). Library code must not rely
  on `eval`, `Function.prototype.toString` or local names being visible to
  user code: apps minify this library. A function users call by name has to
  be listed in `api`.
- Packaging: `package.json` `exports` sends bundlers and Node to
  `dist/shader-park-core.external.{esm.js,cjs}` (three is a peer dependency,
  imported); so do the `browser`/`module` fields, which Parcel and webpack 4
  read instead of `exports`. `dist/shader-park-core.{esm,cjs,umd}.js` stay self-contained with
  three r155 bundled, for direct file and CDN use. The `three` devDependency
  must stay at 0.155.0 so those files don't change; other versions are tested
  via aliases (`three-r125`, `three-r186`).

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
  must match the minimal render. The three.js pages use the external build
  (three imported, not bundled) with three r125, r155 and r186.
- `npm run test:package`: packs the package and installs it into throwaway
  Vite and Node projects to check what users actually get: one copy of three
  in a three.js app, `import`/`require` resolving to the external builds, and
  direct file paths and CDN URLs unchanged. Run it after touching
  `package.json` or `rollup.config.js`. About 20 s.
- `npm run test:examples`: builds the starter templates from the sibling
  `../shader-park-examples` checkout (Vite, Parcel, plain files) with the
  shader-park-core version each pins and with this repo's packed build, and
  compares them (renders, errors, copies of three). Slow (a few minutes, mostly
  installs); not in CI. Screenshots go to `test/out/examples/`.
- CI runs `npm test`, `npm run harness -- --render` and the package test.

Outputs go to `test/out/` (gitignored). Nothing renders reference images into
git; the baseline compiler is built from git history and cached in
`test/.baseline/`.

## Conventions

- Don't add Claude/co-author attribution lines to commits.
