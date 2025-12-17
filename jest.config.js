module.exports = {
  globals: {
    __SDK_VERSION__: "test-version",
  },
  preset: "react-native",
  collectCoverageFrom: ["src/**/**"],
  setupFiles: ["./test/setup.ts"],
  setupFilesAfterEnv: ["./test/mocks/setup.ts", "./test/mocks/react_native_webview.ts"],
  testRegex: ["_test\\.[jt]sx?$"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules",
    "<rootDir>/dist",
    "<rootDir>/build",
    "<rootDir>/example",
  ],
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^msw/node$": "<rootDir>/node_modules/msw/lib/node/index.js",
  },
}
