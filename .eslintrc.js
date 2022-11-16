/* eslint-disable */
module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": [
      1,
      {
        trailingComma: "all",
        singleQuote: false,
        semi: true,
        endOfLine: "crlf",
      },
    ],
    noUnusedVars: 0,
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/ban-ts-comment": "off",
    ...require("eslint-config-prettier").rules,
  },
};
