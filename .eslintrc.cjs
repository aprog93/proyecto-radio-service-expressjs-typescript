module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    '@typescript-eslint/no-namespace': 'off',
  },
  env: {
    node: true,
    es2020: true,
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'src/generated/',
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/__tests__/',
    '**/mocks/',
  ],
};
