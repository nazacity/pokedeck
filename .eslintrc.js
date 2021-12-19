module.esports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint-config-prettier'],
  plugins: ['prettier'],
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    jsx: true,
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  rules: {},
};
