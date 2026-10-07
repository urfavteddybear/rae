import { toNodeHandler } from "better-auth/node";
import type { FastifyInstance } from "fastify";
import { HealthSchema } from "@rae/shared";
import type { Auth } from "./auth.js";
import type { BotClient } from "./bot-client.js";

const startedAt = Date.now();

export async function registerRoutes(app: FastifyInstance, bot: BotClient, auth: Auth) {
  app.get("/health", async () => {
    const body = {
      status: "ok" as const,
      service: "api",
      uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
    };
    return HealthSchema.parse(body);
  });

  // Proxies bot health so compose/docker healthchecks + humans get one
  // place to confirm the private control plane is up.
  app.get("/health/bot", async (req, reply) => {
    try {
      return await bot.health();
    } catch (err) {
      req.log.error(err);
      return reply.status(502).send({ error: "bot unreachable", code: "BOT_UNREACHABLE" });
    }
  });

  // Better Auth (Discord OAuth) handler. Session use + guild routes
  // arrive with the web music experience (Phase 3+).
  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    handler: (req, reply) => {
      reply.hijack();
      void toNodeHandler(auth)(req.raw, reply.raw);
    },
  });

  // Phase 4: GET /events (SSE) + playback routes fan out here.
  // Phase 3: search/metadata routes live here (auth + validation,
  // then delegate to provider), never in web.
}
