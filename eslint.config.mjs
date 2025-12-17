import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  gitignore: true,
}, {
  rules: {
    'ts/ban-ts-comment': 'off',
    'style/brace-style': ['error', '1tbs'],
    // 强制 if 语句必须有括号
    'curly': ['error', 'all'],
    // 强制使用大括号的代码风格
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
  },
})
