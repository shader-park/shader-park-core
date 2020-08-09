import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import json from '@rollup/plugin-json';

export default [


  // browser-friendly UMD build
  {
    input: 'index.js',
    output: { name: 'shader-park-core',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs({
        namedExports: {
          // left-hand side can be an absolute path, a path
          // relative to the current directory, or the name
          // of a module in node_modules
          'node_modules/esprima/dist/esprima.js': ['parse'],
          //'node_modules/escodegen/escodegen.js': ['generate']

        },
      }), // so Rollup can convert `ms` to an ES module
      
      babel({
        exclude: ['node_modules/**']
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
  /*
  {
    input: 'index.js',
    //external: ['escodegen', 'esprima'],
    output: [
      { file: pkg.csj, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs({
        namedExports: {
          // left-hand side can be an absolute path, a path
          // relative to the current directory, or the name
          // of a module in node_modules
          'node_modules/esprima/dist/esprima.js': ['parse'],
          // 'node_modules/escodegen/escodegen.js': ['generate']

        },
        // include: ['node_modules/**'],
      }), // so Rollup can convert `ms` to 
      babel({
        exclude: ['node_modules/**']
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
  }
  */
];
