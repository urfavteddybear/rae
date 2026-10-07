import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    // Tests run against workspace sources; dist is a build artifact.
    alias: {
      "@rae/shared": path.resolve(root, "../shared/src/index.ts"),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
