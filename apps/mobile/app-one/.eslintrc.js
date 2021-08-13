module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts?(x)', '**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        project: ['./tsconfig.json'],
      },
      extends: [
        'eslint:recommended',
        '@react-native-community/eslint-config',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      rules: {
        'no-console': 1,
        'react-native/no-color-literals': 1,
        'react-native/no-inline-styles': 1,
        'react-native/no-single-element-style-arrays': 1,
        'react-native/no-unused-styles': 1,
        '@typescript-eslint/explicit-function-return-type': [
          1,
          { allowExpressions: true, allowTypedFunctionExpressions: true },
        ],
        '@typescript-eslint/no-empty-interface': 1,
        '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
        'prettier/prettier': 0,
        'react-native/no-color-literals': 1,
        'react-native/no-inline-styles': 1,
        'react-native/no-single-element-style-arrays': 1,
        'react-native/no-unused-styles': 1,
      },
    },
  ],
}
