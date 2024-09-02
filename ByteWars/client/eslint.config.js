const globals = require("globals");
const pluginJs = require("@eslint/js");


module.exports = [
  {
    languageOptions: {
      parser: "@babel/eslint-parser",
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
   
  },
  pluginJs.configs.recommended,
];