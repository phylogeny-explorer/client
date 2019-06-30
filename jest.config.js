module.exports = {
  setupFiles: ["<rootDir>/test/support/jest.setup.js"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1"
  }
};
