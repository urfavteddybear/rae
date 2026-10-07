# RAE

Self-hosted Discord music bot with web-based discovery and control.

- Actual audio playback always happens through Discord voice (Lavalink).
- Browser never plays audio. Web and Discord control the same session.
- Bot owns runtime playback. API is web-facing orchestration. Web is a client.

## Stack

- Node.js 22, pnpm, TypeScript
- Web: Next.js + Tailwind + shadcn/ui
- API: Fastify + Zod
- Bot: Discord.js
- Playback: Lavalink (`lavalink-client` behind `@rae/lavalink`)
- DB: PostgreSQL + Drizzle
- Auth: Better Auth (Discord OAuth, scopes `identify` + `guilds`)

## Quickstart

```bash
cp .env.example .env   # fill in secrets, never commit .env
docker compose up -d --build
```

Lavalink is optional in compose. Point `LAVALINK_HOST` at a remote
instance instead and drop the `lavalink` service — no code change needed.

## Layout

```
apps/web    → container (Next.js UI, talks to API only)
apps/api    → container (Fastify, auth, forwards playback commands to bot)
apps/bot    → container (Discord.js, voice, Lavalink, owns playback state)

packages/shared    → types, DTOs, Zod schemas, enums (NOT a container)
packages/database  → Drizzle client, schema, migrations
packages/playback  → pure queue/repeat/shuffle/position logic
packages/music     → provider + resolver interfaces
packages/lyrics    → provider interfaces + LRC parser foundation
packages/lavalink  → Lavalink wrapper, isolates client lib
```

## Phases

Currently: **Phase 1 — Foundation**. No playback, no search UI, no lyrics
system. See pasted spec in project history for full roadmap.
