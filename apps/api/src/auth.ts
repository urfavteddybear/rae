import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { accounts, sessions, users, verifications } from "@rae/database";
import { DISCORD_OAUTH_SCOPES } from "@rae/shared";
import type { ApiConfig } from "./config.js";

// better-auth tables live in @rae/database (plural names, so mapped
// explicitly). Discord OAuth only; scopes identify+guilds. Scope is NOT
// authorization: guild control needs a server-side MANAGE_GUILD check
// per request (see guild-auth.ts).
export function createAuth(config: ApiConfig, db: object) {
  return betterAuth({
    secret: config.betterAuthSecret,
    baseURL: config.betterAuthUrl,
    database: drizzleAdapter(db as never, {
      provider: "pg",
      schema: { user: users, session: sessions, account: accounts, verification: verifications },
    }),
    socialProviders: {
      discord: {
        clientId: config.discordClientId,
        clientSecret: config.discordClientSecret,
        scope: [...DISCORD_OAUTH_SCOPES],
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
