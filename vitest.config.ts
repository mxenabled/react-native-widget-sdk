import { defineConfig } from "vitest/config"
import react from "vitest-react-native"

export default defineConfig({
  define: {
    __SDK_VERSION__: JSON.stringify("test-version"),
  },
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: [
      "./test/mocks/react_native.ts",
      "./test/setup.ts",
      "./test/mocks/setup.ts",
      "./test/mocks/react_native_webview.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*"],
    },
    include: ["**/*_test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/example/**"],
  },
})
