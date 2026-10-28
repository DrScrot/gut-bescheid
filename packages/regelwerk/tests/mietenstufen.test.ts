// Mietenstufen Bayern (Anlage zu § 1 Abs. 3 WoGV). Die Liste ist 1:1 aus der Quelle übernommen.
import { describe, expect, it } from "vitest";
import { mietenstufe, rechtsstandZumStichtag } from "../src/index";

const fassung2023 = rechtsstandZumStichtag("2026-07-01").mietenstufen;
const fassung2027 = rechtsstandZumStichtag("2027-01-01").mietenstufen;

describe("Mietenstufen Bayern", () => {
  it("Fassungen: geltend seit 2023 (aus Quelle), ab 2027 geplant", () => {
    expect(fassung2023).toMatchObject({ gueltigAb: "2023-01-01", status: "aus_quelle" });
    expect(fassung2027).toMatchObject({ gueltigAb: "2027-01-01", status: "geplant" });
  });

  it("Bayern hat 71 Landkreise, alle in beiden Fassungen", () => {
    expect(Object.keys(fassung2023.kreise)).toHaveLength(71);
    expect(Object.keys(fassung2027.kreise)).toHaveLength(71);
  });

  it.each([
    ["Nürnberg, Stadt", null, "V", "V"],
    ["Erlangen, Stadt", null, "IV", "IV"],
    ["Pocking, Stadt", "Passau", "I", "II"],
    ["Augsburg, Stadt", null, "V", "V"],
    ["Würzburg, Stadt", null, "IV", "IV"],
    ["München", null, "VII", "VII"],
    ["Regensburg, Stadt", null, "V", "V"],
    ["Regenstauf, Markt", "Regensburg", "II", "III"],
  ] as const)("Testort %s: %s / 2023 %s / 2027 %s (Rechner bestätigt die Stufe 2026)", (name, kreis, s2023, s2027) => {
    expect(mietenstufe({ name, kreis }, fassung2023)).toBe(s2023);
    expect(mietenstufe({ name, kreis }, fassung2027)).toBe(s2027);
  });

  it("findet jede Gemeinde der einen Fassung auch in der anderen Schreibweise", () => {
    // 2027 schreibt „b.“ statt „bei“, „Große Kreisstadt“ statt „Stadt“, „München, Landeshauptstadt“ statt „München“.
    expect(mietenstufe({ name: "Altdorf bei Nürnberg, Stadt", kreis: null }, fassung2027)).toBe("III");
    expect(mietenstufe({ name: "Altdorf b. Nürnberg, Stadt", kreis: null }, fassung2023)).toBe("II");
    expect(mietenstufe({ name: "München, Landeshauptstadt", kreis: null }, fassung2023)).toBe("VII");
    expect(mietenstufe({ name: "Eching", kreis: null }, fassung2027)).toBe(fassung2027.gemeinden["Eching, Landkreis Freising"]);
  });

  it("jeder Eintrag der Liste ist über seinen Namen auffindbar", () => {
    for (const fassung of [fassung2023, fassung2027]) {
      for (const [name, stufe] of Object.entries(fassung.gemeinden)) {
        expect(mietenstufe({ name, kreis: null }, fassung)).toBe(stufe);
      }
      for (const [kreis, stufe] of Object.entries(fassung.kreise)) {
        expect(mietenstufe({ name: "Nicht in der Liste", kreis }, fassung)).toBe(stufe);
      }
    }
  });

  it("Gemeinde fällt 2027 aus der Liste: dann gilt der Kreis", () => {
    // Roßtal steht 2023 einzeln in der Liste (Landkreis Fürth), 2027 nicht mehr.
    expect(mietenstufe({ name: "Roßtal, Markt", kreis: "Fürth" }, fassung2027)).toBe(fassung2027.kreise["Fürth"]);
  });

  it("unbekannt: klarer Fehler", () => {
    expect(() => mietenstufe({ name: "Atlantis", kreis: "Nirgendwo" }, fassung2023)).toThrow(/Mietenstufe/);
  });
});
