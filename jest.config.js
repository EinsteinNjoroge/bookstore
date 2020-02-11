module.exports = {
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/api/**',
  ],
  setupFiles: [
    './setupTest.js',
  ],
};
