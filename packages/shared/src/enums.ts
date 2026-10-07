// Repeat mode for a guild queue.
export const RepeatMode = {
  Off: "off",
  Track: "track",
  Queue: "queue",
} as const;
export type RepeatMode = (typeof RepeatMode)[keyof typeof RepeatMode];

// Playback transport state. Source of truth lives in Lavalink,
// mirrored by bot, snapshotted read-only by API.
export const PlaybackStatus = {
  Idle: "idle",
  Playing: "playing",
  Paused: "paused",
} as const;
export type PlaybackStatus = (typeof PlaybackStatus)[keyof typeof PlaybackStatus];

// SSE event names fanned out API -> web (Phase 4). Declared here so
// api/web/bot share one vocabulary from day one.
export const PlaybackEvent = {
  TrackChange: "track-change",
  Pause: "pause",
  Resume: "resume",
  Seek: "seek",
  QueueChange: "queue-change",
  Volume: "volume",
  Shuffle: "shuffle",
  Repeat: "repeat",
} as const;
export type PlaybackEvent = (typeof PlaybackEvent)[keyof typeof PlaybackEvent];
