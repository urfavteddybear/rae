import { describe, expect, it } from "vitest";
import { RepeatMode } from "@rae/shared";
import { interpolatePosition, nextIndex, prevIndex, shuffledUpNext } from "./queue.js";

describe("nextIndex", () => {
  it("advances within bounds", () => {
    expect(
      nextIndex({ items: ["a", "b"], currentIndex: 0, shuffle: false, repeat: RepeatMode.Off }),
    ).toBe(1);
  });

  it("returns null at end without repeat", () => {
    expect(
      nextIndex({ items: ["a"], currentIndex: 0, shuffle: false, repeat: RepeatMode.Off }),
    ).toBeNull();
  });

  it("wraps with queue repeat", () => {
    expect(
      nextIndex({ items: ["a", "b"], currentIndex: 1, shuffle: false, repeat: RepeatMode.Queue }),
    ).toBe(0);
  });

  it("stays on track repeat", () => {
    expect(
      nextIndex({ items: ["a", "b"], currentIndex: 0, shuffle: false, repeat: RepeatMode.Track }),
    ).toBe(0);
  });
});

describe("prevIndex", () => {
  it("goes back", () => {
    expect(
      prevIndex({ items: ["a", "b"], currentIndex: 1, shuffle: false, repeat: RepeatMode.Off }),
    ).toBe(0);
  });

  it("returns null at head", () => {
    expect(
      prevIndex({ items: ["a"], currentIndex: 0, shuffle: false, repeat: RepeatMode.Off }),
    ).toBeNull();
  });
});

describe("shuffledUpNext", () => {
  it("keeps played head fixed and preserves all items", () => {
    const state = {
      items: ["a", "b", "c", "d"],
      currentIndex: 1,
      shuffle: true,
      repeat: RepeatMode.Off,
    };
    const out = shuffledUpNext(state, () => 0);
    expect(out.slice(0, 2)).toEqual(["a", "b"]);
    expect([...out].sort()).toEqual(["a", "b", "c", "d"]);
  });
});

describe("interpolatePosition", () => {
  it("advances while playing and clamps to duration", () => {
    expect(
      interpolatePosition({
        lastPositionMs: 1000,
        updatedAtMs: 0,
        nowMs: 500,
        playing: true,
        durationMs: 10_000,
      }),
    ).toBe(1500);
    expect(
      interpolatePosition({
        lastPositionMs: 9900,
        updatedAtMs: 0,
        nowMs: 5000,
        playing: true,
        durationMs: 10_000,
      }),
    ).toBe(10_000);
  });

  it("freezes while paused", () => {
    expect(
      interpolatePosition({
        lastPositionMs: 1000,
        updatedAtMs: 0,
        nowMs: 5000,
        playing: false,
        durationMs: 10_000,
      }),
    ).toBe(1000);
  });
});
