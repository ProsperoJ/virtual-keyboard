module.exports = {
  extends: [
    'airbnb-base',
  ],
  parser: '@babel/eslint-parser', // This line is required to fix "unexpected token" errors
  parserOptions: {
    "requireConfigFile": false,
  },
  rules: {

  },
  globals: {
    "window": true,
    "document": true,
    "localStorage": true,
  },
};
