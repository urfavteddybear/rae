import { describe, expect, it } from "vitest";
import { activeLineIndex, parseLrc } from "./lrc.js";

describe("parseLrc", () => {
  it("parses mm:ss.xx tags and derives endMs from next line", () => {
    const lines = parseLrc("[00:01.00]hello\n[00:05.50]world\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatchObject({ startMs: 1000, endMs: 5500, text: "hello" });
    expect(lines[1]).toMatchObject({ startMs: 5500, text: "world" });
  });

  it("expands repeated tags and skips metadata lines", () => {
    const lines = parseLrc("[ar:Artist]\n[00:01.00][00:02.00]hey\n");
    expect(lines.map((l) => l.startMs)).toEqual([1000, 2000]);
  });

  it("returns empty for garbage", () => {
    expect(parseLrc("no tags here\n")).toEqual([]);
  });
});

describe("activeLineIndex", () => {
  const lines = parseLrc("[00:01.00]a\n[00:05.00]b\n");
  it("finds active line", () => {
    expect(activeLineIndex(lines, 0)).toBe(-1);
    expect(activeLineIndex(lines, 1000)).toBe(0);
    expect(activeLineIndex(lines, 6000)).toBe(1);
  });
});
