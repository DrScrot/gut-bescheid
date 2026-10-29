// Prüft das Zählwerkzeug für die Lesbarkeit (tests/lesbarkeit.ts) an Hand gezählten Beispielen.
import { describe, expect, it } from "vitest";
import { lesbarkeit, saetze, silben, woerter } from "./lesbarkeit";

describe("Silben", () => {
  it.each([
    ["Hund", 1],
    ["Kinderzuschlag", 4],
    ["Grundsicherung", 4],
    ["Bedarfsgemeinschaft", 5],
    ["Wohngeld", 2],
    ["Kinder-Zuschlag", 4],
    ["€", 2],
    ["%", 2],
  ])("%s: %i", (wort, n) => {
    expect(silben(wort)).toBe(n);
  });

  it.each([
    ["6", 1],
    ["12", 1],
    ["14", 2],
    ["17", 2],
    ["21", 4],
    ["25", 4],
    ["100", 2],
    ["600", 3],
    ["1.000", 2],
    ["1.240", 7],
    ["70.000", 4],
    ["1,5", 4],
  ])("Zahl %s wie gesprochen: %i", (zahl, n) => {
    expect(silben(zahl)).toBe(n);
  });
});

describe("Sätze und Wörter", () => {
  it("trennt an Punkt, Ausrufe- und Fragezeichen", () => {
    expect(saetze("Erst das. Dann das? Und das!")).toEqual(["Erst das.", "Dann das?", "Und das!"]);
  });

  it("Ordnungszahlen wie „28. Oktober“ oder „im 1. Jahr“ beenden keinen Satz", () => {
    expect(saetze("Stand: 28. Oktober 2026. Im 1. Jahr zahlt das Amt. Es sind 2026 Fälle.")).toEqual([
      "Stand: 28. Oktober 2026.",
      "Im 1. Jahr zahlt das Amt.",
      "Es sind 2026 Fälle.",
    ]);
  });

  it("€ und % zählen als Wort, Satzzeichen nicht", () => {
    expect(woerter("Gekürzt werden 30 % vom Regelbedarf, also 169 €.")).toEqual([
      "Gekürzt", "werden", "30", "%", "vom", "Regelbedarf", "also", "169", "€",
    ]);
  });
});

describe("Amstad", () => {
  it("„Der Hund bellt.“: 180 − 3 − 58,5 × 1 = 118,5", () => {
    expect(lesbarkeit("Der Hund bellt.").amstad).toBe(118.5);
  });

  it("zwei Sätze: Satzlänge und Silben gemittelt", () => {
    // 2 Sätze, 8 Wörter, 11 Silben: 180 − 4 − 58,5 × 1,375 = 95,6
    const l = lesbarkeit("Du musst nicht umziehen. Das Wohngeld bleibt gleich.");
    expect(l).toMatchObject({ saetze: 2, woerter: 8, silben: 11, satzlaengen: [4, 4], amstad: 95.6 });
  });
});
