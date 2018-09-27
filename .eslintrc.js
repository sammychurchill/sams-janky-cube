module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 6
  },

  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:vue/recommended"
  ],
  plugins: ["vue"],
  rules: {
    "no-console": 0
  }
};
