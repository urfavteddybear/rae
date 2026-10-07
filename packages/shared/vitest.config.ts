import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    // DTOs/schemas only so far; real tests land with first runtime code.
    passWithNoTests: true,
  },
});
