// Vergleich der Wege (Fachkonzept, Entscheidungslogik Schritt 4). Erwartungen von Nico gerechnet am 28.10.2026.
import { describe, expect, it } from "vitest";
import { berechne } from "../src/index";
import type { Erwachsener, Haushalt } from "../src/index";
import { testhaushalt } from "./testhaushalte";

const STICHTAG = "2026-07-01";

function rechne(h: Haushalt, stichtag = STICHTAG) {
  const e = berechne(h, { stichtag });
  if (!e.imUmfang) throw new Error(`außerhalb des Umfangs: ${e.gruende.join(", ")}`);
  return e;
}

function mitEinkommen(id: string, brutto: number, netto: number): Haushalt {
  const h = testhaushalt(id).eingabe;
  const [verdienend, ...rest] = h.erwachsene as [Erwachsener, ...Erwachsener[]];
  return { ...h, erwachsene: [{ ...verdienend, brutto, netto }, ...rest] };
}

describe("Kontrollwerte wie T01 und T07 (Netto 80 %, Wohngeld amtlich)", () => {
  it("Brutto 1.200 €: es fehlen 135 €, nur Weg A", () => {
    const e = rechne(mitEinkommen("T01", 120000, 96000));
    expect(e.wohngeld.betrag).toBe(94000);
    expect(e.kiz.bedarfspruefung.fehlbetrag).toBe(13500);
    expect(e.kiz.anspruch).toBe("nein_bedarf_nicht_gedeckt");
    expect(e.ergebnis).toBe("nur_weg_a");
  });

  it.each([160000, 180000, 200000, 220000])("Brutto %i Cent: Weg B deckt den Bedarf", (brutto) => {
    expect(rechne(mitEinkommen("T01", brutto, (brutto * 8) / 10)).ergebnis).toBe("weg_b_deckt");
  });
});

describe("Ergebnis", () => {
  it("Weg B deckt: KiZ und Wohngeld zählen, Weg A zeigt Lücke A plus Sofortzuschlag (§ 72 SGB II)", () => {
    const e = rechne(testhaushalt("T01").eingabe);
    expect(e.wegA).toEqual({ anspruch: "ja", betrag: 95900, sofortzuschlag: 5000, nachEinsatzDesErsparten: false });
    expect(e.wegB).toEqual({
      kinderzuschlag: 59400,
      wohngeld: 77500,
      summe: 136900,
      fehlbetrag: -46000,
      restAusErspartem: false,
    });
    expect(e.ergebnis).toBe("weg_b_deckt");
  });

  it("Erweiterter Zugang (T07): Weg B bringt 115 € weniger als Weg A (65 € Lücke plus 2 × 25 € Sofortzuschlag)", () => {
    const e = rechne(testhaushalt("T07").eingabe);
    expect(e.wegA.betrag).toBe(164900);
    expect(e.wegB.summe).toBe(153400);
    expect(e.wegB.fehlbetrag).toBe(6500);
    expect(e.ergebnis).toBe("erweiterter_zugang");
  });

  it("Nur Weg A (T08): KiZ entfällt, Weg B zeigt nur das Wohngeld", () => {
    const e = rechne(testhaushalt("T08").eingabe);
    expect(e.kiz.betrag).toBe(29700);
    expect(e.wegB).toEqual({
      kinderzuschlag: 0,
      wohngeld: 31400,
      summe: 31400,
      fehlbetrag: 64400,
      restAusErspartem: false,
    });
    expect(e.ergebnis).toBe("nur_weg_a");
  });

  it("Keine Grundsicherung (T09): Weg B deckt, Weg A zeigt kein Geld (kein Sofortzuschlag nach den Weisungen zu § 72)", () => {
    const e = rechne(testhaushalt("T09").eingabe);
    expect(e.wegA).toEqual({ anspruch: "nein_einkommen", betrag: 0, sofortzuschlag: 0, nachEinsatzDesErsparten: false });
    expect(e.wegB.kinderzuschlag).toBe(14400);
    expect(e.ergebnis).toBe("weg_b_deckt");
  });

  it("Weg A wegen Vermögen ausgeschlossen (T06): Weg B deckt", () => {
    const e = rechne(testhaushalt("T06").eingabe);
    expect(e.wegA).toEqual({ anspruch: "nein_vermoegen", betrag: 0, sofortzuschlag: 0, nachEinsatzDesErsparten: false });
    expect(e.wegB.restAusErspartem).toBe(false);
    expect(e.ergebnis).toBe("weg_b_deckt");
  });

  it("Weg A wegen Vermögen ausgeschlossen, mit Weg B fehlt noch Geld: Weg B, der Rest kommt aus dem Ersparten", () => {
    const h = { ...mitEinkommen("T01", 120000, 96000), vermoegen: { von: 5000000, bis: 5000000 } };
    const e = rechne(h);
    expect(e.wegA.anspruch).toBe("nein_vermoegen");
    expect(e.wegA).toEqual({ anspruch: "nein_vermoegen", betrag: 0, sofortzuschlag: 0, nachEinsatzDesErsparten: false });
    expect(e.wegB).toMatchObject({ kinderzuschlag: 59400, wohngeld: 94000, fehlbetrag: 13500, restAusErspartem: true });
    expect(e.ergebnis).toBe("weg_b_deckt");
  });

  it("Erspartes 50 € über dem Freibetrag: zählt beim erweiterten Zugang mit (DA-KiZ C.4.2 Abs. 2), echte Wahl", () => {
    const h = { ...mitEinkommen("T01", 120000, 96000), vermoegen: { von: 3005000, bis: 3005000 } };
    const e = rechne(h);
    expect(e.wegA.anspruch).toBe("nein_vermoegen");
    expect(e.kiz.anspruch).toBe("erweiterter_zugang");
    // Weg A nach Einsatz des Ersparten: Lücke A 1.669 € plus 2 × 25 € Sofortzuschlag
    expect(e.wegA).toEqual({ anspruch: "nein_vermoegen", betrag: 171900, sofortzuschlag: 5000, nachEinsatzDesErsparten: true });
    expect(e.wegB).toMatchObject({ kinderzuschlag: 59400, wohngeld: 94000, fehlbetrag: 13500, restAusErspartem: false });
    expect(e.ergebnis).toBe("erweiterter_zugang");
  });

  it("Erspartes 20 € über dem Freibetrag deckt den Fehlbetrag nicht, auch nicht für den erweiterten Zugang: nur Weg A", () => {
    const h = { ...mitEinkommen("T01", 120000, 96000), vermoegen: { von: 3002000, bis: 3002000 } };
    const e = rechne(h);
    expect(e.kiz.anspruch).toBe("nein_bedarf_nicht_gedeckt");
    expect(e.wegA).toEqual({ anspruch: "nein_vermoegen", betrag: 171900, sofortzuschlag: 5000, nachEinsatzDesErsparten: true });
    expect(e.wegB).toMatchObject({ kinderzuschlag: 0, wohngeld: 94000, fehlbetrag: 72900, restAusErspartem: false });
    expect(e.sgb2.hinweise).toContainEqual({ code: "erspartes_zuerst_einsetzen" });
    expect(e.ergebnis).toBe("nur_weg_a");
  });

  it("kein Anspruch auf beiden Wegen: hohes Einkommen", () => {
    const e = rechne(mitEinkommen("T09", 800000, 500000));
    expect(e.wegA.betrag).toBe(0);
    expect(e.wegB.summe).toBe(0);
    expect(e.ergebnis).toBe("kein_anspruch");
  });
});

describe("Bildung und Teilhabe im Vergleich", () => {
  it("kein Betrag, nur die zuständige Stelle je Weg", () => {
    const e = rechne(testhaushalt("T01").eingabe);
    expect(e.but).toEqual({
      wegA: { zustaendig: "jobcenter", moeglich: true },
      wegB: { zustaendig: "landkreis_oder_kreisfreie_stadt", moeglich: true },
    });
  });

  it("Weg B nur mit KiZ oder Wohngeld (§ 6b Abs. 1 BKGG), Weg A nur mit Anspruch", () => {
    expect(rechne(testhaushalt("T09").eingabe).but.wegA.moeglich).toBe(false);
    const ohne = rechne(mitEinkommen("T09", 800000, 500000));
    expect(ohne.but.wegA.moeglich).toBe(false);
    expect(ohne.but.wegB.moeglich).toBe(false);
  });
});

describe("Umfang und Stichtag", () => {
  it("außerhalb des Umfangs: Gründe statt Ergebnis", () => {
    const h = { ...testhaushalt("T01").eingabe, kinder: [] };
    const e = berechne(h, { stichtag: STICHTAG });
    expect(e.imUmfang).toBe(false);
    if (!e.imUmfang) expect(e.gruende).toEqual(["kein_kind"]);
  });

  it("Stichtag 2027: Wohngeld nach geplanter Fassung, als geplant markiert", () => {
    const e = rechne(testhaushalt("T01").eingabe, "2027-01-01");
    expect(e.rechtsstand).toBe("2027-01-01");
    expect(e.wohngeld.geplant).toBe(true);
    expect(e.parameterHinweise.some((h) => h.status === "geplant")).toBe(true);
  });

  it("Stichtag 2027, T01: Kindergeld 267 €, KiZ 272 €, Wohngeld 684 € (alles geplant), Weg B deckt", () => {
    // Lücke A 893 € (16 € weniger als 2026 wegen 2 × 8 € mehr Kindergeld). Gegengerechnet vom rechts-pruefer.
    const e = rechne(testhaushalt("T01").eingabe, "2027-01-01");
    expect(e.wegA).toEqual({ anspruch: "ja", betrag: 94300, sofortzuschlag: 5000, nachEinsatzDesErsparten: false });
    expect(e.wegB).toEqual({
      kinderzuschlag: 54400,
      wohngeld: 68400,
      summe: 122800,
      fehlbetrag: -33500,
      restAusErspartem: false,
    });
    expect(e.ergebnis).toBe("weg_b_deckt");
  });

  it("Parameterhinweise kommen ohne Doppelungen", () => {
    const namen = rechne(testhaushalt("T01").eingabe, "2027-01-01").parameterHinweise.map((h) => h.name);
    expect(new Set(namen).size).toBe(namen.length);
  });
});
