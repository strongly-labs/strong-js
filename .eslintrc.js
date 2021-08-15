module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  overrides: [
    {
      files: ['packages/**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react-hooks/recommended',
        'plugin:import/typescript',
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        project: [
          './tsconfig.json',
          './cypress/tsconfig.json',
          './packages/*/tsconfig.build.json',
        ],
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-empty-interface': 0,
      },
    },
  ],
}
