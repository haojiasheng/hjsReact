import babel from '_rollup-plugin-babel@3.0.7@rollup-plugin-babel';
import resolve from '_rollup-plugin-node-resolve@3.3.0@rollup-plugin-node-resolve';
import commonjs from '_rollup-plugin-commonjs@9.1.5@rollup-plugin-commonjs';
import json from '../../../../../Library/Caches/typescript/2.9/node_modules/@types/rollup-plugin-json';
import uglify from '_rollup-plugin-uglify@4.0.0@rollup-plugin-uglify';

export default {
  input: './src/hjsReact.js',
  output: {
    format: 'iife',
    file: 'dist/hjsReact.dev.js',
    name: 'hjsReact',
    sourcemap: true,
    strict: true
  },
  plugins: [
    resolve({
      jsnext: true,  // 该属性是指定将Node包转换为ES2015模块
      // main 和 browser 属性将使插件决定将那些文件应用到bundle中
      main: true,  // Default: true 
      browser: true // Default: false
    }),
    commonjs(),
    json(),
    babel({exclude: 'node_modules/**', runtimeHelpers: true}),
    (process.env.NODE_ENV === 'production' && uglify.uglify())
  ]
};