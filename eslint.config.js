import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'supabase/functions/**/*.ts', // Ignorar Deno functions
      '.eslintrc.js', // Ignorar arquivo legado
      'tailwind.config.js',
      'vite.config.js',
      'pages/api/**', // Ignorar Next.js API routes
    ]
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: '18.2',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      
      // Relaxar regras problemáticas
      'react/prop-types': 'off', // Desabilitar prop-types (usamos TypeScript)
      'no-unused-vars': 'warn', // Warning ao invés de erro
      'react/no-unescaped-entities': 'off', // Permitir entidades não escapadas
      'react/jsx-no-undef': 'warn',
      'no-undef': 'warn',
      
      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Configuração especial para arquivos de configuração
    files: ['*.config.js', '.eslintrc.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    }
  },
  {
    // Configuração para páginas API Next.js
    files: ['pages/api/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    }
  }
]
