/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    './.eslintrc-auto-import.json' // 自动导入的 ESLint 配置
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    // Vue规则
    'vue/multi-word-component-names': 'off', // 关闭组件名必须多个单词
    'vue/no-v-html': 'off', // 允许使用v-html
    'vue/require-default-prop': 'off', // 不强制props默认值
    'vue/require-explicit-emits': 'off', // 不强制显式声明emits
    'vue/component-tags-order': [
      'error',
      {
        order: ['template', 'script', 'style']
      }
    ],

    // TypeScript规则
    '@typescript-eslint/no-explicit-any': 'warn', // any类型警告而非错误
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/ban-ts-comment': 'off', // 允许@ts-ignore等注释
    '@typescript-eslint/no-non-null-assertion': 'off', // 允许非空断言

    // JavaScript规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off', // 使用TS的unused-vars规则
    'prefer-const': 'error',
    'no-var': 'error',

    // Prettier
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ]
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
}

