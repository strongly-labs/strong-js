module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@react-native-community/eslint-config',
    'plugin:react/recommended',
    'plugin:react-native-a11y/all',
    'prettier',
  ],
  plugins: ['import', 'react-native-a11y'],
  rules: {
    'prettier/prettier': 0,
    'react/prop-types': 0,
    'react-native/no-color-literals': 1,
    'react-native/no-inline-styles': 1,
    'react-native/no-single-element-style-arrays': 1,
    'react-native/no-unused-styles': 1,
  },
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
        'plugin:react/recommended',
        'plugin:react-native-a11y/all',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
        'prettier',
      ],
      rules: {
        'react/prop-types': 0,
        'react-hooks/exhaustive-deps': 'warn',
        'no-console': 1,
        'react-native/no-color-literals': 1,
        'react-native/no-inline-styles': 1,
        'react-native/no-single-element-style-arrays': 1,
        'react-native/no-unused-styles': 1,
        '@typescript-eslint/explicit-function-return-type': [
          1,
          {allowExpressions: true, allowTypedFunctionExpressions: true},
        ],
        '@typescript-eslint/no-empty-interface': 1,
        '@typescript-eslint/no-unused-vars': [1, {argsIgnorePattern: '^_'}],
      },
    },
  ],
}
