import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
  },
  {
    ignores: ['*.js'],
  },
  {
    rules: {
      'node/prefer-global/process': 'warn',
      'vue/one-component-per-file': 'off',
      'no-restricted-globals': 'off',
    },
  },
)
