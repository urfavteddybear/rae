import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    // interfaces only so far; real tests land with first runtime code.
    passWithNoTests: true,
  },
});
