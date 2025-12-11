import { defineConfig } from "vite"
import { resolve } from "path"
import dts from "vite-plugin-dts"
import { readFileSync } from "fs"

const packageJson = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf-8"))

export default defineConfig({
  define: {
    __SDK_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "cli/setup": resolve(__dirname, "src/cli/setup.ts"),
      },
      formats: ["cjs", "es"],
    },
    outDir: "dist",
    rollupOptions: {
      external: [
        "react",
        "react-native",
        "react-native-webview",
        "react-native-base64",
        "url",
        "@mxenabled/widget-post-message-definitions",
      ],
      output: [
        {
          format: "cjs",
          dir: "dist",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
          exports: "named",
        },
        {
          format: "es",
          dir: "dist",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].mjs",
        },
      ],
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      outDir: "dist",
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: ["test/**/*", "example/**/*", "node_modules/**/*"],
    }),
  ],
})
