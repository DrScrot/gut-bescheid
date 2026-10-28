// Bildung und Teilhabe (§ 28 SGB II, § 6b BKGG). Auf beiden Wegen gleich, nur die Stelle unterscheidet sich.
import { describe, expect, it } from "vitest";
import { berechneBut } from "../src/index";
import { testhaushalt } from "./testhaushalte";

describe("Bildung und Teilhabe", () => {
  it("Leistungen 2026 und zuständige Stellen je Weg", () => {
    const e = berechneBut(testhaushalt("T01").eingabe, { stichtag: "2026-07-01" });
    expect(e.leistungen).toEqual({
      schulbedarf: { erstesHalbjahr: 13000, zweitesHalbjahr: 6500 },
      teilhabeMonatlich: 1500,
      tatsaechlicheKosten: ["ausfluege_und_klassenfahrten", "schuelerbefoerderung", "lernfoerderung", "mittagessen"],
    });
    expect(e.zustaendig).toEqual({ wegA: "jobcenter", wegB: "landkreis_oder_kreisfreie_stadt" });
    expect(e.kinderUnter18).toBe(2);
  });

  it("Zuständigkeit Weg A ist noch zu prüfen, Weg B steht in Art. 109a AGSG", () => {
    const e = berechneBut(testhaushalt("T01").eingabe, { stichtag: "2026-07-01" });
    expect(e.parameterHinweise).toEqual([
      expect.objectContaining({ name: "but.zustaendigWegA", status: "pruefen" }),
    ]);
  });

  it("Stand 2027: Schulbedarf fortgeschrieben, Status pruefen", () => {
    const e = berechneBut(testhaushalt("T01").eingabe, { stichtag: "2027-01-01" });
    expect(e.leistungen.schulbedarf.erstesHalbjahr).toBe(13000);
    expect(e.parameterHinweise.map((h) => h.name)).toContain("but.schulbedarf");
  });
});
