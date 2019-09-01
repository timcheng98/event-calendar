module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  "parser": "babel-eslint",
  "rules": {
    "camelcase": "off",
    "quotes": ["warn", "single", {"allowTemplateLiterals": true}],
    "comma-dangle": ["warn", "never"],
    "object-curly-spacing": "off",
    "no-unused-vars": "warn",
    "class-methods-use-this": "off",
    "no-console": "off",
    "prefer-const": "off",
    "no-plusplus": "error",
    "react/jsx-filename-extension": "off",
    "react/jsx-max-props-per-line": ["warn", {"when": "multiline"}],
    "react/prefer-stateless-function": "off",
    "react/prop-types": "off",
    "react/destructuring-assignment": "off",
    "no-plusplus": "off",
    "no-use-before-define": "off",
    "no-param-reassign": "warn",
    "no-useless-constructor": "off",
    "import/order": "off"
  }
};