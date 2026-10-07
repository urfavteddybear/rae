// Lyric models. Provider integration (LRCLIB candidate) lands in
// Phase 5; this file only fixes the shapes + LRC parsing foundation.

export interface LyricWord {
  text: string;
  startMs: number;
  endMs: number;
}

export interface LyricLine {
  startMs: number;
  endMs: number;
  text: string;
  // Empty when provider only gives line-level sync.
  words: LyricWord[];
}

export interface Lyrics {
  trackId: string;
  // True when at least one line carries timestamps.
  synced: boolean;
  lines: LyricLine[];
}

export interface LyricsProvider {
  readonly name: string;
  fetchLyrics(args: {
    title: string;
    artist: string;
    album?: string;
    durationMs?: number;
  }): Promise<Lyrics | null>;
}
