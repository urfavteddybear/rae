import type { LavalinkConfig } from "./config.js";

// Thin wrapper seam over `lavalink-client`. Rest of app imports this,
// never the client lib directly. Full player integration is Phase 2;
// Phase 1 only fixes config + factory shape.
export interface LavalinkConnection {
  readonly config: LavalinkConfig;
  // Phase 2: connect(), player ops, event subscription.
  isConfigured(): boolean;
}

export function createLavalinkConnection(config: LavalinkConfig): LavalinkConnection {
  return {
    config,
    isConfigured() {
      return config.host.length > 0 && config.password.length > 0;
    },
  };
}
