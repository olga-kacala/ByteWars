const globals = require("globals");
const pluginJs = require("@eslint/js");
const babelParser = require("@babel/eslint-parser");

module.exports = [
  {
  languageOptions: {
    parser: babelParser,
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
