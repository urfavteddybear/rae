import { Client, Events, GatewayIntentBits } from "discord.js";
import { getDb } from "@rae/database";
import { createLavalinkConnection } from "@rae/lavalink";
import { loadConfig } from "./config.js";
import { createControlServer } from "./control-server.js";
import { createLogger } from "./logger.js";

// Phase 1: connect to Discord, start private control plane, verify
// Lavalink config. No /play, no queue, no voice — Phase 2.
async function main() {
  const log = createLogger("bot");
  const config = loadConfig();
  const db = getDb(config.databaseUrl);
  void db; // guild upserts (see guilds.ts) land in Phase 2 with lifecycle events

  const lavalink = createLavalinkConnection(config.lavalink);
  log.info("lavalink configured", {
    baseUrl: config.lavalink.baseUrl,
    secure: config.lavalink.secure,
    configured: lavalink.isConfigured(),
  });

  const control = createControlServer({ secret: config.internalSecret, log });
  await control.listen(config.controlPort);

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.once(Events.ClientReady, (c) => {
    log.info("bot ready", { tag: c.user.tag });
  });
  await client.login(config.discordToken);
}

main().catch((err) => {
  process.stderr.write(
    JSON.stringify({ level: "error", service: "bot", msg: "fatal", err: String(err) }) + "\n",
  );
  process.exit(1);
});
