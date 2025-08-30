import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./test/setup.mjs"],
    maxConcurrency: 1,
    fileParallelism: false,
    sequence: {
      shuffle: false,
    },
  },
});
