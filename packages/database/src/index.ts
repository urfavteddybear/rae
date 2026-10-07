import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

export type Database = ReturnType<typeof createDb>;

let client: postgres.Sql | null = null;

export function createDb(connectionString: string) {
  const queryClient = postgres(connectionString, { max: 10 });
  return drizzle(queryClient, { schema });
}

// Singleton for app runtimes (api/bot). Web never imports this.
export function getDb(connectionString?: string): Database {
  if (!client) {
    const url = connectionString ?? process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = postgres(url, { max: 10 });
  }
  return drizzle(client, { schema });
}

export * from "./schema.js";
