import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // generate-only; migrate.ts uses DATABASE_URL at runtime.
    url: process.env.DATABASE_URL ?? "postgresql://rae:rae@localhost:5432/rae",
  },
});
