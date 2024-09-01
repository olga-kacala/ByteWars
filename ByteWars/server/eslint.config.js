module.exports = {
  // Specify parser options
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  
  // Specify rules
  rules: {

  },

  // Plugins can be specified here
  plugins: {
  
    node: require('eslint-plugin-node'),
  },
};