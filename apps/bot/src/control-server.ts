import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { BOT_INTERNAL_AUTH_HEADER } from "@rae/shared";
import type { Logger } from "./logger.js";

// Private control plane: API -> Bot. Binds loopback-ish/internal port,
// validates shared secret, exposes health now + playback commands Phase 2.
// Never publicly exposed; API handles user auth/guild authz, bot executes.
export interface ControlServer {
  listen(port: number): Promise<void>;
  close(): Promise<void>;
}

export function createControlServer(args: { secret: string; log: Logger }): ControlServer {
  const { secret, log } = args;
  const startedAt = Date.now();

  const handler = (req: IncomingMessage, res: ServerResponse) => {
    if (req.headers[BOT_INTERNAL_AUTH_HEADER] !== secret) {
      res.writeHead(401, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "unauthorized", code: "UNAUTHORIZED" }));
      return;
    }
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          service: "bot",
          uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
        }),
      );
      return;
    }
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "not found", code: "NOT_FOUND" }));
  };

  const server = createServer(handler);
  return {
    listen(port: number) {
      return new Promise<void>((resolve) => {
        server.listen(port, () => {
          log.info("bot control plane listening", { port });
          resolve();
        });
      });
    },
    close() {
      return new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    },
  };
}
