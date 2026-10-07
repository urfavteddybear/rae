export const DISCORD_OAUTH_SCOPES = ["identify", "guilds"] as const;

// Server-side gate for controlling a guild's playback. OAuth scope is
// NOT authorization — this permission is checked server-side per request.
export const GUILD_CONTROL_PERMISSION = "MANAGE_GUILD" as const;

// Header carrying the API -> bot internal token. Never reuse a user
// session token here.
export const BOT_INTERNAL_AUTH_HEADER = "x-rae-bot-secret";
