module.exports = {
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      plugins: ['@typescript-eslint', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
        'plugin:import/errors',
        'plugin:import/warnings',
        'prettier',
      ],
      settings: {
        'import/resolver': {
          typescript: {},
        },
      },
      rules: {},
    },
  ],
}
