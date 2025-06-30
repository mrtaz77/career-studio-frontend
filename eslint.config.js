// eslint.config.js
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import pluginJest from 'eslint-plugin-jest';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['eslint.config.js', 'babel.config.js', 'node_modules', 'dist', 'build'],

    // Run on all JS/TS files
    files: ['**/*.{js,ts,jsx,tsx}'],

    languageOptions: {
      parser, // from @typescript-eslint/parser
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        jsxRuntime: 'automatic', // <-- use the new React transform
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        global: 'readonly',
        process: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      react: pluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },

    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
      },
    },

    rules: {
      // base JS + TS rules
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...prettierConfig.rules,

      // Turn off core no-unused-vars in favor of the TS version:
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // ignore unused args starting with _
          varsIgnorePattern: '^_', // ignore unused vars starting with _
          ignoreRestSiblings: true, // ignore rest siblings in object spreads
        },
      ],

      // Disable prop-types (we use TS for typing)
      'react/prop-types': 'off',

      // Custom attributes you whitelist
      'react/no-unknown-property': [
        'error',
        { ignore: ['cmdk-input-wrapper', 'cmdk-group-heading'] },
      ],

      // React 17+ automatic transform
      'react/react-in-jsx-scope': 'off',

      // Allow non-component exports in refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Prettier as ESLint warnings
      'prettier/prettier': 'warn',

      // catch accidental consoles
      'no-console': 'warn',
    },
  },

  // Jest tests
  {
    files: ['**/*.test.{js,ts,jsx,tsx}', '**/__tests__/**/*.{js,ts,jsx,tsx}'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: { ...pluginJest.environments.globals.globals },
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
]);
