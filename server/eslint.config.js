import js from '@eslint/js';

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  console: 'readonly',
  fetch: 'readonly',
  setTimeout: 'readonly',
  setInterval: 'readonly',
  clearTimeout: 'readonly',
  clearInterval: 'readonly',
  navigator: 'readonly',
  location: 'readonly',
  L: 'readonly',
  URL: 'readonly',
  io: 'readonly',
};

export default [
  js.configs.recommended,
  {
    files: ['./public/**/*.js'],
    languageOptions: {
      globals: browserGlobals,
    },
    rules: {},
  },
];
