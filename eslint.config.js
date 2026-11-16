const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: { ...globals.mocha },
    },
  },
];
