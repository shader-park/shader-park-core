import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import pkg from './package.json' with { type: "json" };
import json from '@rollup/plugin-json';
import versionInjector from 'rollup-plugin-version-injector';

export default [
  // browser-friendly UMD build
  {
    input: 'index.js',
    output: { name: 'shader-park-core',
      // explicit paths: package.json's browser/module fields point at the
      // external build, not at these files
      file: 'dist/shader-park-core.umd.js',
      format: 'umd'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      versionInjector(),
      commonjs({
      }), // so Rollup can convert `ms` to an ES module
      
      babel({
        exclude: ['node_modules/**'],
        babelHelpers: "bundled"
      }),
      json({
        // All JSON files will be parsed by default,
        // but you can also specifically include/exclude files
        include: 'node_modules/**',
        //exclude: ['node_modules/foo/**', 'node_modules/bar/**'],
        // for tree-shaking, properties will be declared as
        // variables, using either `var` or `const`
        preferConst: true, // Default: false
        indent: '  ',
        // ignores indent and generates the smallest code
        compact: true, // Default: false
      })
    ]
  },

  // browser-friendly UMD build for p5
  {
    input: 'targets/p5.js',
    output: {
      // No dashes so the global variable is easier to access
      name: 'shaderPark',
      file: pkg.p5,
      format: 'umd'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      versionInjector(),
      commonjs({
      }), // so Rollup can convert `ms` to an ES module

      babel({
        exclude: ['node_modules/**'],
        babelHelpers: "bundled"
      }),
      json({
        // All JSON files will be parsed by default,
        // but you can also specifically include/exclude files
        include: 'node_modules/**',
        //exclude: ['node_modules/foo/**', 'node_modules/bar/**'],
        // for tree-shaking, properties will be declared as
        // variables, using either `var` or `const`
        preferConst: true, // Default: false
        indent: '  ',
        // ignores indent and generates the smallest code
        compact: true, // Default: false
      })
    ]
  },
  

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify 
  // `file` and `format` for each target)
  {
    input: 'index.js',
    output: [
      { file: pkg.cjs, format: 'cjs' },
      { file: 'dist/shader-park-core.esm.js', format: 'es' }
    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
      versionInjector(),
      commonjs({
        // include: ['node_modules/**'],
      }), // so Rollup can convert `ms` to 
      babel({
        exclude: ['node_modules/**'],
        babelHelpers: "bundled"
      }),
      json({
        // All JSON files will be parsed by default,
        // but you can also specifically include/exclude files
        include: 'node_modules/**',
        //exclude: ['node_modules/foo/**', 'node_modules/bar/**'],
        // for tree-shaking, properties will be declared as
        // variables, using either `var` or `const`
        preferConst: true, // Default: false
        indent: '  ',
        // ignores indent and generates the smallest code
        compact: true, // Default: false
      })
    ]
  },
  // Same entry with three left as an import, so apps that use three.js share
  // their copy instead of loading a second one. package.json "exports" points
  // bundlers and Node here; the builds above stay self-contained for direct
  // file, CDN and script-tag use.
  // Possible future major version: move the three.js functions to their own
  // entry (shader-park-core/three) so the main entry never needs three.
  {
    input: 'index.js',
    external: ['three'],
    output: [
      // .cjs because package.json has "type": "module"; Node would load a
      // .js file here as an ES module
      { file: 'dist/shader-park-core.external.cjs', format: 'cjs' },
      { file: 'dist/shader-park-core.external.esm.js', format: 'es' }
    ],
    plugins: [
      resolve(),
      // the defaults only process .js/.html/.css files
      versionInjector({
        injectInComments: {
          fileRegexp: /\.(c?js|html|css)$/,
          tag: 'Version: {version} - {date}',
          dateFormat: 'mmmm d, yyyy HH:MM:ss'
        },
        injectInTags: {
          fileRegexp: /\.(c?js|html|css)$/,
          tagId: 'VI',
          dateFormat: 'mmmm d, yyyy HH:MM:ss'
        }
      }),
      commonjs(),
      babel({
        exclude: ['node_modules/**'],
        babelHelpers: "bundled"
      }),
      json({
        include: 'node_modules/**',
        preferConst: true,
        indent: '  ',
        compact: true,
      })
    ]
  },
  // Minimal Renderer
  {
    input: 'targets/minimalGLSLRenderer.js',
    output: [
      { file: pkg.minimalGLSLRendererCJS, format: 'cjs' },
      { file: pkg.minimalGLSLRendererESM, format: 'es' }
    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
      versionInjector(),
      commonjs({
        // include: ['node_modules/**'],
      }), // so Rollup can convert `ms` to 
      babel({
        exclude: ['node_modules/**'],
        babelHelpers: "bundled"
      }),
      json({
        // All JSON files will be parsed by default,
        // but you can also specifically include/exclude files
        include: 'node_modules/**',
        //exclude: ['node_modules/foo/**', 'node_modules/bar/**'],
        // for tree-shaking, properties will be declared as
        // variables, using either `var` or `const`
        preferConst: true, // Default: false
        indent: '  ',
        // ignores indent and generates the smallest code
        compact: true, // Default: false
      })
    ]
  },

  //TouchDesigner 
  {
    input: 'targets/touchDesigner.js',
    output: { name: 'SPTD',
      file: pkg.TouchDesigner,
      format: 'umd'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      versionInjector(),
      commonjs({
      }), 
      babel({
        exclude: ['node_modules/**'],
        babelHelpers: "bundled"
      }),
      json({
        include: 'node_modules/**',
        preferConst: true, // Default: false
        indent: '  ',
        compact: true, // Default: false
      })
    ]
  }
];
