import { BOT_INTERNAL_AUTH_HEADER } from "@rae/shared";

// Forwards validated playback commands to bot's private control API.
// Bot validates internal token + guild/player existence + executes.
// Phase 1: health plumbing only. Playback commands arrive Phase 2/4.
export interface BotClient {
  health(): Promise<{ status: string; service: string }>;
}

export function createBotClient(args: { baseUrl: string; secret: string }): BotClient {
  const { baseUrl, secret } = args;
  const headers = { [BOT_INTERNAL_AUTH_HEADER]: secret };
  return {
    async health() {
      const res = await fetch(`${baseUrl}/health`, { headers });
      if (!res.ok) throw new Error(`bot health failed: ${res.status}`);
      return (await res.json()) as { status: string; service: string };
    },
  };
}
