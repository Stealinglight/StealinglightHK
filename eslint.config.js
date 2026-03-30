import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';
import globals from 'globals';

export default [
  // Global ignores (replaces .eslintrc ignorePatterns)
  {
    ignores: [
      'dist/',
      'build/',
      'node_modules/',
      'cdk.out/',
      'infra/cdk.out/',
      'infra/dist/',
      'infra/node_modules/',
      '.claude/',
    ],
  },

  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React config for TS/TSX files
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // React hooks
  reactHooks.configs.flat.recommended,

  // Security plugin for all files
  security.configs.recommended,

  // Lambda JavaScript files (CommonJS, Node.js environment)
  {
    files: ['infra/lambda/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      sourceType: 'commonjs',
    },
    rules: {
      // Lambda uses console.log for structured CloudWatch logging
      'no-console': ['warn', { allow: ['log', 'warn', 'error'] }],
      // Lambda uses CommonJS require()
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Lambda test files (Jest environment)
  {
    files: ['infra/lambda/**/__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // Config files at root and infra (CommonJS/Node.js)
  {
    files: ['*.config.{js,mjs,cjs}', 'infra/jest.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
