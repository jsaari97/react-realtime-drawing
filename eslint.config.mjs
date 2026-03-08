import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['**/build/**', '**/dist/**', '**/node_modules/**', '**/.snapshots/**', '**/*.min.js']
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off'
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          legacyDecorators: true
        }
      },
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    plugins: {
      react: reactPlugin
    },
    settings: {
      react: {
        version: '17'
      }
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...eslintConfigPrettier.rules,
      'space-before-function-paren': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-handler-names': 'off',
      'react/jsx-fragments': 'off',
      'react/no-unused-prop-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  }
)
