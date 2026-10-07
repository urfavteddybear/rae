import { RepeatMode } from "@rae/shared";

// Pure queue domain logic. No I/O, no Discord, no Lavalink.
// Bot owns runtime state; this package only computes transitions.

export interface QueueState<T> {
  items: T[];
  currentIndex: number | null;
  shuffle: boolean;
  repeat: RepeatMode;
}

// Next index honoring repeat mode. Returns null when queue ends.
export function nextIndex<T>(state: QueueState<T>): number | null {
  const { items, currentIndex, repeat } = state;
  if (currentIndex === null || items.length === 0) return items.length > 0 ? 0 : null;
  if (repeat === RepeatMode.Track) return currentIndex;
  const next = currentIndex + 1;
  if (next < items.length) return next;
  return repeat === RepeatMode.Queue ? 0 : null;
}

// Previous index. Returns null when already at head (no restart logic;
// restart-vs-previous threshold lives in bot using live position).
export function prevIndex<T>(state: QueueState<T>): number | null {
  const { currentIndex } = state;
  if (currentIndex === null || currentIndex <= 0) return null;
  return currentIndex - 1;
}

// Fisher-Yates on upcoming items only; keeps current track fixed.
// Returns new array, input untouched.
export function shuffledUpNext<T>(state: QueueState<T>, rand: () => number = Math.random): T[] {
  const { items, currentIndex } = state;
  if (currentIndex === null) return [...items];
  const head = items.slice(0, currentIndex + 1);
  const tail = items.slice(currentIndex + 1);
  for (let i = tail.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [tail[i], tail[j]] = [tail[j]!, tail[i]!];
  }
  return [...head, ...tail];
}

// Client-side position interpolation between authoritative updates.
// positionMs = last known Lavalink position, advanced by elapsed wall time
// while playing, clamped to track duration. No network involved.
export function interpolatePosition(args: {
  lastPositionMs: number;
  updatedAtMs: number;
  nowMs: number;
  playing: boolean;
  durationMs: number;
}): number {
  const { lastPositionMs, updatedAtMs, nowMs, playing, durationMs } = args;
  if (!playing) return Math.min(lastPositionMs, durationMs);
  const advanced = lastPositionMs + Math.max(0, nowMs - updatedAtMs);
  return Math.min(advanced, durationMs);
}
