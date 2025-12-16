import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  gitignore: true,
}, {
  rules: {
    'ts/ban-ts-comment': 'off',
    'style/brace-style': ['error', '1tbs'],
  },
})
