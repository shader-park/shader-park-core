import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import json from '@rollup/plugin-json';
import versionInjector from 'rollup-plugin-version-injector';


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
      versionInjector(),
      commonjs({
        namedExports: {
          'node_modules/esprima/dist/esprima.js': ['parse'],
        },
      }), 
      babel({
        exclude: ['node_modules/**']
      }),
      json({
        include: 'node_modules/**',
        preferConst: true, // Default: false
        indent: '  ',
        compact: true, // Default: false
      })
    ]
  },

  {
    input: 'index.js',
    output: [
      { file: pkg.csj, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
      versionInjector(),
      commonjs({
        namedExports: {
          'node_modules/esprima/dist/esprima.js': ['parse'],
        },
      }), 
      babel({
        exclude: ['node_modules/**']
      }),
      json({
        include: 'node_modules/**',
        preferConst: true,
        indent: '  ',
        compact: true,
      })
    ]
  },
  {
    input: 'spMinimal.js',
    output: { name: 'shader-park-minimal',
      file: 'dist/shader-park-minimal.umd.js',
      format: 'umd'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      versionInjector(),
      commonjs({
        namedExports: {
          'node_modules/esprima/dist/esprima.js': ['parse'],
        },
      }), 
      babel({
        exclude: ['node_modules/**']
      }),
      json({
        include: 'node_modules/**',
        preferConst: true, // Default: false
        indent: '  ',
        compact: true, // Default: false
      })
    ]
  },

  {
    input: 'spMinimal.js',
    output: [
      { file: 'dist/shader-park-minimal.cjs.js', format: 'cjs',  name: 'shader-park-minimal', },
      { file: 'dist/shader-park-minimal.esm.js', format: 'es',  name: 'shader-park-minimal', }
    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
      versionInjector(),
      commonjs({
        namedExports: {
          'node_modules/esprima/dist/esprima.js': ['parse'],
        },
      }), 
      babel({
        exclude: ['node_modules/**']
      }),
      json({
        include: 'node_modules/**',
        preferConst: true,
        indent: '  ',
        compact: true,
      })
    ]
  }  
];
