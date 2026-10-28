// Festkomma mit zehn Nachkommastellen für die Wohngeldformel (Anlage 3 Nr. 2 WoGG).
import { describe, expect, it } from "vitest";
import { ausCent, ausText, aufEuro, geteiltDurch, mal, zuText } from "../src/festkomma";

describe("Festkomma", () => {
  it("liest Dezimalzahlen und die Schreibweise der Anlage 2", () => {
    expect(zuText(ausText("1.15"))).toBe("1.1500000000");
    expect(zuText(ausText("4.797E-4"))).toBe("0.0004797000");
    expect(zuText(ausText("-1.200E-1"))).toBe("-0.1200000000");
    expect(zuText(ausText("0"))).toBe("0.0000000000");
  });

  it("lehnt mehr als zehn Nachkommastellen und Unsinn ab", () => {
    expect(() => ausText("0.00000000001")).toThrow(RangeError);
    expect(() => ausText("1,15")).toThrow(RangeError);
  });

  it("rechnet Cent in Euro um", () => {
    expect(zuText(ausCent(197780))).toBe("1977.8000000000");
  });

  it("rundet jedes Produkt auf zehn Stellen, ab 5 auf", () => {
    // 0,0000000001 × 0,5 = 0,00000000005 → 0,0000000001
    expect(zuText(mal(ausText("0.0000000001"), ausText("0.5")))).toBe("0.0000000001");
    expect(zuText(mal(ausText("0.0000000001"), ausText("0.4")))).toBe("0.0000000000");
    // negativ: Betrag runden, Vorzeichen behalten
    expect(zuText(mal(ausText("-0.0000000001"), ausText("0.5")))).toBe("-0.0000000001");
  });

  it("teilt mit Rundung auf zehn Stellen", () => {
    expect(zuText(geteiltDurch(ausText("1"), 3))).toBe("0.3333333333");
    expect(zuText(geteiltDurch(ausText("2"), 3))).toBe("0.6666666667");
  });

  it("rundet kaufmännisch auf volle Euro, Ergebnis in Cent", () => {
    expect(aufEuro(ausText("774.9552232743"))).toBe(77500);
    expect(aufEuro(ausText("225.4999999999"))).toBe(22500);
    expect(aufEuro(ausText("225.5"))).toBe(22600);
  });
});
