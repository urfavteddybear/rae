import { z } from "zod";
import { PlaybackStatus, RepeatMode } from "./enums.js";

// Normalized track metadata. Discovery providers return this; resolvers
// turn it into something Lavalink can play (Phase 2+).
export const TrackSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  artists: z.array(z.string()),
  album: z.string().optional(),
  artworkUrl: z.string().url().optional(),
  durationMs: z.number().int().nonnegative(),
  // Opaque provider reference used for later resolution. Never an audio URL.
  providerRef: z.string().optional(),
});
export type Track = z.infer<typeof TrackSchema>;

export const QueueItemSchema = TrackSchema.extend({
  queueId: z.string().min(1),
  addedBy: z.string().min(1),
});
export type QueueItem = z.infer<typeof QueueItemSchema>;

// Read-only snapshot API serves to web / fans out over SSE.
// Interpolated client-side; never 60fps network sync.
export const PlaybackSnapshotSchema = z.object({
  guildId: z.string().min(1),
  status: z.enum([PlaybackStatus.Idle, PlaybackStatus.Playing, PlaybackStatus.Paused]),
  current: QueueItemSchema.nullable(),
  positionMs: z.number().int().nonnegative(),
  volume: z.number().int().min(0).max(1000),
  shuffle: z.boolean(),
  repeat: z.enum([RepeatMode.Off, RepeatMode.Track, RepeatMode.Queue]),
  updatedAt: z.string().datetime(),
});
export type PlaybackSnapshot = z.infer<typeof PlaybackSnapshotSchema>;

// Health shape shared by api + bot (and lavalink via its own endpoint).
export const HealthSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
  uptimeSec: z.number(),
});
export type Health = z.infer<typeof HealthSchema>;

// --- API <-> Bot control plane -------------------------------------------
// Minimal Phase 1 surface: health + validated plumbing. Playback commands
// arrive in Phase 2; guild authorization stays in API, execution in bot.
export const BotControlErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
});
export type BotControlError = z.infer<typeof BotControlErrorSchema>;
