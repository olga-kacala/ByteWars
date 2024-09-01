/** @type {import('eslint').ESLint.FlatConfig} */
const config = [
    {
      languageOptions: {
        parserOptions: {
          ecmaVersion: 2021,
          sourceType: 'module',
        },
      },
      plugins: {
        prettier: require('eslint-plugin-prettier'),
        node: require('eslint-plugin-node'),
      },
      rules: {
        // Add your custom rules here if needed
      },
      ignorePatterns: ['node_modules/'],
    },
    {
      // Apply rules or configurations for specific file types
      files: ['*.js', '*.jsx'],
      rules: {
        // Custom rules for JavaScript and JSX files
      },
    },
  ];
  
  module.exports = config;
  