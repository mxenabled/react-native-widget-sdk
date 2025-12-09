import { defineConfig } from "vite"
import { resolve } from "path"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
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
