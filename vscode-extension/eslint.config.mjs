import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['out/**', 'node_modules/**', '.vscode-test/**'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        __dirname: 'readonly',
        clearTimeout: 'readonly',
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        TextEncoder: 'readonly',
      },
    },
  },
];
