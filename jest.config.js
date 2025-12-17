module.exports = {
  testEnvironment: "node",
  injectGlobals: true,
  globals: {
    __SDK_VERSION__: "test-version",
  },
  setupFiles: [
    "./test/mocks/react_native.ts",
    "./test/setup.ts",
    "./test/mocks/react_native_webview.ts",
  ],
  setupFilesAfterEnv: [
    "./test/mocks/setup.ts",
  ],
  collectCoverageFrom: ["src/**/*"],
  coverageReporters: ["text", "json", "html", "lcov"],
  testMatch: ["**/*_test.{ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/", "/example/"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react",
          esModuleInterop: true,
        },
      },
    ],
    "^.+\\.m?js$": [
      "ts-jest",
      {
        tsconfig: {
          allowJs: true,
          esModuleInterop: true,
        },
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|react-native-webview|react-native-base64|msw|@mswjs|until-async|@mxenabled)/)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
