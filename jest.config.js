module.exports = {
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/api/**',
    '!src/index.jsx',
  ],
  setupFiles: [
    './setupTest.js',
  ],
};
