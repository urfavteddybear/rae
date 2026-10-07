import type { LyricLine } from "./models.js";

// Parses basic LRC: [mm:ss.xx] text, one or more tags per line.
// Word-level tags (<mm:ss.xx>) intentionally NOT parsed yet — Phase 6.
// Returns lines sorted by startMs. Throws nothing; skips bad lines.
export function parseLrc(input: string): LyricLine[] {
  const tagRe = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
  const lines: LyricLine[] = [];

  for (const raw of input.split("\n")) {
    const text = raw.replace(tagRe, "").trim();
    tagRe.lastIndex = 0;
    let m: RegExpExecArray | null;
    const stamps: number[] = [];
    while ((m = tagRe.exec(raw)) !== null) {
      const min = Number(m[1]);
      const sec = Number(m[2]);
      const fracRaw = m[3] ?? "0";
      const frac = Number(fracRaw.padEnd(3, "0").slice(0, 3));
      if (Number.isFinite(min) && Number.isFinite(sec) && Number.isFinite(frac)) {
        stamps.push(min * 60_000 + sec * 1000 + frac);
      }
    }
    if (text.length === 0 || stamps.length === 0) continue;
    for (const startMs of stamps) {
      lines.push({ startMs, endMs: startMs, text, words: [] });
    }
  }

  lines.sort((a, b) => a.startMs - b.startMs);
  // endMs = next line's start (last line keeps startMs = unsynced tail).
  for (let i = 0; i < lines.length - 1; i++) {
    lines[i]!.endMs = lines[i + 1]!.startMs;
  }
  return lines;
}

// Active line index at positionMs, or -1 when none (before first line).
export function activeLineIndex(lines: LyricLine[], positionMs: number): number {
  let active = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]!.startMs <= positionMs) active = i;
    else break;
  }
  return active;
}
