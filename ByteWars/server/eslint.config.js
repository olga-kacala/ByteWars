module.exports = {
  // Specify parser options
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  // Extend configurations
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // or any other configs you use
  ],
  // Specify rules
  rules: {
    'no-console': 'warn',
    'prettier/prettier': 'error',
    // Add or modify rules as needed
  },
  // Specify files to ignore
  ignorePatterns: [
    'node_modules/**/*',
    'dist/**/*',
    'build/**/*',
  ],
  // Plugins can be specified here
  plugins: {
    prettier: require('eslint-plugin-prettier'),
    node: require('eslint-plugin-node'),
  },
};