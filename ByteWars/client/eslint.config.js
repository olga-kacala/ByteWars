const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  pluginJs.configs.recommended,
];