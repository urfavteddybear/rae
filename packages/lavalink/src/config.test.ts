import { describe, expect, it } from "vitest";
import { loadLavalinkConfig } from "./config.js";

describe("loadLavalinkConfig", () => {
  it("supports remote hosts without code change", () => {
    const cfg = loadLavalinkConfig({
      LAVALINK_HOST: "audio.example.com",
      LAVALINK_PORT: "443",
      LAVALINK_PASSWORD: "s3cret",
      LAVALINK_SECURE: "true",
    });
    expect(cfg.baseUrl).toBe("https://audio.example.com:443");
  });

  it("rejects bad ports", () => {
    expect(() => loadLavalinkConfig({ LAVALINK_PORT: "nope" })).toThrow();
  });
});
