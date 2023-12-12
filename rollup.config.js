import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import '@babel/plugin-transform-runtime'
import serve from 'rollup-plugin-serve'

export default {
  input: 'src/main.js',
  external: ['file-saver', 'html2canvas'],
  output: [
    {
      file: './dist/export-word.js',
      format: 'iife',
      name: 'exportWord'
    },
    {
      file: './dist/export-word.min.js',
      format: 'iife',
      name: 'exportWord',
      plugins: [terser()]
    }
  ],
  plugins: [
    process.env.ENV === 'development' ? serve({
      open: true,
      openPage: '/examples/index.html',
      port: 3000,
      contentBase: ''
    }) : null,

    commonjs(),
    babel({ babelHelpers: 'runtime', 'plugins': [
      ['@babel/plugin-transform-runtime', {
        'regenerator': true
      }]
    ] }),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    })
  ]

}
