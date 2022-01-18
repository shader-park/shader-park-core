import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default [
  //
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify 
  // `file` and `format` for each target)
  {
    input: 'index.js',
    //external: ['escodegen', 'esprima'],
    output: [
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
    ]
  }
];
