module.exports = {
  preset: 'react-native',
  cacheDirectory: '.jest/cache',
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"]
}
