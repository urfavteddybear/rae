export interface ApiConfig {
  port: number;
  host: string;
  databaseUrl: string;
  betterAuthSecret: string;
  betterAuthUrl: string;
  discordClientId: string;
  discordClientSecret: string;
  botInternalUrl: string;
  botInternalSecret: string;
}

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export function loadConfig(env: Record<string, string | undefined> = process.env): ApiConfig {
  const port = Number(env.API_PORT ?? "4000");
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid API_PORT: ${env.API_PORT}`);
  }
  return {
    port,
    host: env.API_HOST ?? "0.0.0.0",
    databaseUrl: required("DATABASE_URL", env.DATABASE_URL),
    betterAuthSecret: required("BETTER_AUTH_SECRET", env.BETTER_AUTH_SECRET),
    betterAuthUrl: env.BETTER_AUTH_URL ?? "http://localhost:3000",
    discordClientId: required("DISCORD_CLIENT_ID", env.DISCORD_CLIENT_ID),
    discordClientSecret: required("DISCORD_CLIENT_SECRET", env.DISCORD_CLIENT_SECRET),
    botInternalUrl: env.BOT_INTERNAL_URL ?? "http://bot:4550",
    botInternalSecret: required("RAE_BOT_INTERNAL_SECRET", env.RAE_BOT_INTERNAL_SECRET),
  };
}
