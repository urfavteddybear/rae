import Fastify from "fastify";
import { getDb } from "@rae/database";
import { createAuth } from "./auth.js";
import { createBotClient } from "./bot-client.js";
import { loadConfig } from "./config.js";
import { createLogger } from "./logger.js";
import { registerRoutes } from "./routes.js";

async function main() {
  const log = createLogger("api");
  const config = loadConfig();
  const db = getDb(config.databaseUrl);
  const auth = createAuth(config, db);
  const bot = createBotClient({
    baseUrl: config.botInternalUrl,
    secret: config.botInternalSecret,
  });

  const app = Fastify({ logger: false });
  await registerRoutes(app, bot, auth);
  await app.listen({ port: config.port, host: config.host });
  log.info("api listening", { port: config.port });
}

main().catch((err) => {
  process.stderr.write(
    JSON.stringify({ level: "error", service: "api", msg: "fatal", err: String(err) }) + "\n",
  );
  process.exit(1);
});
