import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import uglify from 'rollup-plugin-uglify';

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