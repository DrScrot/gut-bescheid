import { describe, expect, it } from "vitest";
import { anteil, pruefeBetrag } from "../src/geld";

describe("anteil", () => {
  it("rechnet ohne Rundung, wenn das Ergebnis volle Cent hat", () => {
    expect(anteil(56300, 36)).toEqual({ cent: 20268, gerundet: false });
    expect(anteil(0, 20)).toEqual({ cent: 0, gerundet: false });
  });

  it("rundet ab einem halben Cent auf (§ 41 Abs. 2 SGB II)", () => {
    expect(anteil(23456, 10)).toEqual({ cent: 2346, gerundet: true });
    expect(anteil(23455, 10)).toEqual({ cent: 2346, gerundet: true });
    expect(anteil(23454, 10)).toEqual({ cent: 2345, gerundet: true });
  });

  it("lehnt Kommazahlen und negative Beträge ab", () => {
    expect(() => anteil(12.5, 10)).toThrow();
    expect(() => anteil(-100, 10)).toThrow();
    expect(() => anteil(100, 12.5)).toThrow();
  });
});

describe("pruefeBetrag", () => {
  it("nimmt ganze Cent ab 0 an", () => {
    expect(pruefeBetrag(0, "x")).toBe(0);
    expect(pruefeBetrag(175000, "x")).toBe(175000);
  });

  it("lehnt alles andere mit dem Feldnamen ab", () => {
    expect(() => pruefeBetrag(1750.5, "netto")).toThrow(/netto/);
    expect(() => pruefeBetrag(-1, "netto")).toThrow(/netto/);
    expect(() => pruefeBetrag(Number.NaN, "netto")).toThrow(/netto/);
    expect(() => pruefeBetrag("100", "netto")).toThrow(/netto/);
  });
});
