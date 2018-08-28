module.exports = {
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  env: {
    node: true,
    es6: true,
    commonjs: true,
    mocha: true,
  },
  rules: {
    'no-console': 'off',
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    semi: [
      'error',
      'always'
    ],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      module: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react',
  ],
};