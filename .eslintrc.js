/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['next/core-web-vitals', 'prettier'],
  ignorePatterns: ['node_modules'],
  rules: {
    'import/named': 'error',
  },
}

module.exports = config
