// Lavalink connection config. Host may be a compose service name
// (local) or a remote hostname — bot code never assumes either.
export interface LavalinkConfig {
  host: string;
  port: number;
  password: string;
  secure: boolean;
  // Resolved base URL, e.g. http(s)://host:port
  baseUrl: string;
}

export function loadLavalinkConfig(
  env: Record<string, string | undefined> = process.env,
): LavalinkConfig {
  const host = env.LAVALINK_HOST ?? "lavalink";
  const port = Number(env.LAVALINK_PORT ?? "2333");
  const password = env.LAVALINK_PASSWORD ?? "youshallnotpass";
  const secure = (env.LAVALINK_SECURE ?? "false").toLowerCase() === "true";
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid LAVALINK_PORT: ${env.LAVALINK_PORT}`);
  }
  return {
    host,
    port,
    password,
    secure,
    baseUrl: `${secure ? "https" : "http"}://${host}:${port}`,
  };
}
