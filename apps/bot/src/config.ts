import { loadLavalinkConfig, type LavalinkConfig } from "@rae/lavalink";

export interface BotConfig {
  discordToken: string;
  databaseUrl: string;
  controlPort: number;
  internalSecret: string;
  lavalink: LavalinkConfig;
}

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export function loadConfig(env: Record<string, string | undefined> = process.env): BotConfig {
  const controlPort = Number(env.BOT_CONTROL_PORT ?? "4550");
  if (!Number.isInteger(controlPort) || controlPort <= 0 || controlPort > 65535) {
    throw new Error(`Invalid BOT_CONTROL_PORT: ${env.BOT_CONTROL_PORT}`);
  }
  return {
    discordToken: required("DISCORD_TOKEN", env.DISCORD_TOKEN),
    databaseUrl: required("DATABASE_URL", env.DATABASE_URL),
    controlPort,
    internalSecret: required("RAE_BOT_INTERNAL_SECRET", env.RAE_BOT_INTERNAL_SECRET),
    lavalink: loadLavalinkConfig(env),
  };
}
