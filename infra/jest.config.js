module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['lambda/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
