// Bedingungen als Daten (src/bedingung.ts): Auswertung und Prüfung beim Laden.
import { describe, expect, it } from "vitest";
import { erfuellt, pruefeBedingung, type FaktArt, type Wert } from "../src/bedingung";

const ARTEN: Record<string, FaktArt> = {
  zahl: { art: "zahl" },
  schalter: { art: "ja_nein" },
  tag: { art: "datum" },
  farbe: { art: "text", werte: ["rot", "gruen"] },
};
const FAKTEN: Record<string, Wert> = { zahl: 3, schalter: true, tag: "2026-08-01", farbe: "rot" };

function gilt(roh: unknown, fakten = FAKTEN): boolean {
  return erfuellt(pruefeBedingung(roh, ARTEN, "Test"), fakten);
}

describe("Auswertung", () => {
  it("alle: leer ist wahr, sonst müssen alle zutreffen", () => {
    expect(gilt({ alle: [] })).toBe(true);
    expect(gilt({ alle: [{ fakt: "zahl", ist: 3 }, { fakt: "schalter", ist: true }] })).toBe(true);
    expect(gilt({ alle: [{ fakt: "zahl", ist: 3 }, { fakt: "schalter", ist: false }] })).toBe(false);
  });

  it("eines: leer ist falsch, sonst reicht eine", () => {
    expect(gilt({ eines: [] })).toBe(false);
    expect(gilt({ eines: [{ fakt: "zahl", ist: 4 }, { fakt: "farbe", ist: "rot" }] })).toBe(true);
    expect(gilt({ eines: [{ fakt: "zahl", ist: 4 }, { fakt: "farbe", ist: "gruen" }] })).toBe(false);
  });

  it("nicht", () => {
    expect(gilt({ nicht: { fakt: "schalter", ist: true } })).toBe(false);
    expect(gilt({ nicht: { fakt: "schalter", ist: false } })).toBe(true);
  });

  it("ist und in", () => {
    expect(gilt({ fakt: "farbe", ist: "rot" })).toBe(true);
    expect(gilt({ fakt: "farbe", in: ["gruen"] })).toBe(false);
    expect(gilt({ fakt: "farbe", in: ["gruen", "rot"] })).toBe(true);
  });

  it("ab (größer oder gleich) und unter (kleiner) für Zahlen", () => {
    expect(gilt({ fakt: "zahl", ab: 3 })).toBe(true);
    expect(gilt({ fakt: "zahl", ab: 4 })).toBe(false);
    expect(gilt({ fakt: "zahl", unter: 3 })).toBe(false);
    expect(gilt({ fakt: "zahl", unter: 4 })).toBe(true);
  });

  it("ab und unter für Daten (JJJJ-MM-TT)", () => {
    expect(gilt({ fakt: "tag", ab: "2026-08-01" })).toBe(true);
    expect(gilt({ fakt: "tag", ab: "2026-08-02" })).toBe(false);
    expect(gilt({ fakt: "tag", unter: "2026-08-01" })).toBe(false);
    expect(gilt({ fakt: "tag", unter: "2027-01-01" })).toBe(true);
  });

  it("fehlt ein Fakt beim Auswerten, ist das ein Fehler", () => {
    const b = pruefeBedingung({ fakt: "zahl", ist: 3 }, ARTEN, "Test");
    expect(() => erfuellt(b, {})).toThrow(/zahl/);
  });
});

describe("Prüfung beim Laden", () => {
  it.each([
    ["unbekannter Fakt", { fakt: "groesse", ist: 3 }, /groesse/],
    ["Zahl statt Text", { fakt: "farbe", ist: 3 }, /farbe/],
    ["unbekannter Text-Wert", { fakt: "farbe", ist: "blau" }, /blau/],
    ["Text statt Zahl", { fakt: "zahl", ist: "3" }, /zahl/],
    ["ab bei ja/nein", { fakt: "schalter", ab: 1 }, /schalter/],
    ["ab bei Text", { fakt: "farbe", ab: "rot" }, /farbe/],
    ["ab mit Zahl bei Datum", { fakt: "tag", ab: 3 }, /tag/],
    ["kein gültiges Datum", { fakt: "tag", ab: "2026-13-01" }, /2026-13-01/],
    ["in ohne Liste", { fakt: "farbe", in: "rot" }, /farbe/],
    ["zwei Vergleiche", { fakt: "zahl", ab: 1, unter: 5 }, /zahl/],
    ["kein Vergleich", { fakt: "zahl" }, /zahl/],
    ["unbekannte Verknüpfung", { oder: [] }, /oder/],
    ["alle ohne Liste", { alle: { fakt: "zahl", ist: 3 } }, /alle/],
    ["kein Objekt", "immer", /immer/],
  ])("%s", (_, roh, meldung) => {
    expect(() => pruefeBedingung(roh, ARTEN, "Karte x")).toThrow(meldung);
  });

  it("Fehlermeldung nennt den Ort", () => {
    expect(() => pruefeBedingung({ fakt: "groesse", ist: 3 }, ARTEN, "Karte x")).toThrow(/Karte x/);
  });

  it("verschachtelte Fehler werden gefunden", () => {
    expect(() => pruefeBedingung({ alle: [{ nicht: { fakt: "farbe", ist: "blau" } }] }, ARTEN, "Karte x")).toThrow(/blau/);
  });
});
