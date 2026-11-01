// Vergleich der Wege (Fachkonzept, Entscheidungslogik Schritt 4). Erwartungen von Nico gerechnet am 28.10.2026.
import { describe, expect, it } from "vitest";
import { berechne } from "../src/index";
import type { Erwachsener, Haushalt } from "../src/index";
import { alsVerheiratet, testhaushalt } from "./testhaushalte";

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
      krankenversicherung: 0,
      restAusErspartem: false,
    });
    expect(e.ergebnis).toBe("weg_b_deckt");
  });

  it("Erweiterter Zugang (T07, verheiratet): Weg B bringt 115 € weniger als Weg A (65 € Lücke plus 2 × 25 € Sofortzuschlag)", () => {
    const e = rechne(alsVerheiratet(testhaushalt("T07").eingabe));
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
      krankenversicherung: 0,
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

  it("Weg A wegen Vermögen ausgeschlossen (T06, verheiratet): Weg B deckt", () => {
    const e = rechne(alsVerheiratet(testhaushalt("T06").eingabe));
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
      krankenversicherung: 0,
      restAusErspartem: false,
    });
    expect(e.ergebnis).toBe("weg_b_deckt");
  });

  it("Parameterhinweise kommen ohne Doppelungen", () => {
    const namen = rechne(testhaushalt("T01").eingabe, "2027-01-01").parameterHinweise.map((h) => h.name);
    expect(new Set(namen).size).toBe(namen.length);
  });
});

// Beitrag zur Krankenversicherung auf Weg B (DA-KiZ C.4.1 Abs. 5, Entscheidung von Nico am 31.10.2026). Weg A bleibt
// gleich: Mit Grundsicherung ist man pflichtversichert (§ 5 Abs. 1 Nr. 2a SGB V). Sollwerte von Hand, Claude 31.10.2026.
describe("Krankenversicherung auf Weg B (DA-KiZ C.4.1 Abs. 5)", () => {
  it("T02, nicht verheiratet: nur Weg A; Weg B zeigt Wohngeld, Beitrag 266,96 €, es fehlen 855,96 €", () => {
    const e = rechne(testhaushalt("T02").eingabe);
    expect(e.ergebnis).toBe("nur_weg_a");
    expect(e.wegB).toEqual({
      kinderzuschlag: 0,
      wohngeld: 94000,
      summe: 94000,
      fehlbetrag: 85596,
      krankenversicherung: 26696,
      restAusErspartem: false,
    });
    expect(e.wegA).toEqual(rechne(alsVerheiratet(testhaushalt("T02").eingabe)).wegA);
  });

  it("T02, verheiratet: wie bis zum 31.10.2026, Weg B deckt knapp", () => {
    const e = rechne(alsVerheiratet(testhaushalt("T02").eingabe));
    expect(e.ergebnis).toBe("weg_b_deckt");
    expect(e.wegB).toMatchObject({ fehlbetrag: -500, krankenversicherung: 0 });
  });

  it("T07, nicht verheiratet: kein erweiterter Zugang mehr, nur Weg A", () => {
    const e = rechne(testhaushalt("T07").eingabe);
    expect(e.kiz.bedarfspruefung.fehlbetrag).toBe(33196);
    expect(e.ergebnis).toBe("nur_weg_a");
    expect(e.wegB).toMatchObject({ kinderzuschlag: 0, fehlbetrag: 92596, krankenversicherung: 26696 });
  });

  it("T06, nicht verheiratet: Weg B deckt, der Rest von 213,26 € kommt aus dem Ersparten", () => {
    const e = rechne(testhaushalt("T06").eingabe);
    expect(e.ergebnis).toBe("weg_b_deckt");
    expect(e.wegB).toMatchObject({ fehlbetrag: 21326, krankenversicherung: 27026, restAusErspartem: true });
  });

  it("T06, verheiratet: Weg B deckt ohne Rest", () => {
    const e = rechne(alsVerheiratet(testhaushalt("T06").eingabe));
    expect(e.wegB).toMatchObject({ fehlbetrag: -5700, krankenversicherung: 0, restAusErspartem: false });
  });

  it("T01 mit 1.700 € brutto, nicht verheiratet: erweiterter Zugang, es fehlen 80,96 € (Annahme, rechts-pruefer)", () => {
    const h = mitEinkommen("T01", 170000, 136000);
    const e = rechne({
      ...h,
      familienstand: "nicht_verheiratet",
      erwachsene: h.erwachsene.map((p) => ({ ...p, krankenversicherung: p.brutto > 0 ? "arbeit" : "selbst" })),
    });
    expect(e.kiz.anspruch).toBe("erweiterter_zugang");
    expect(e.ergebnis).toBe("erweiterter_zugang");
    expect(e.wegB.fehlbetrag).toBe(8096);
  });

  // Konstruiert, prüft nur den Mechanismus: Ohne Beitrag reicht das Einkommen (Lücke A −2,92 €), mit Beitrag fehlen
  // 134,34 €. Weg A wäre dann nur der Zuschuss nach § 26 Abs. 2 SGB II, den Version 0 nicht rechnet. Das Kind bekommt
  // 650 € Unterhalt, deshalb gibt es keinen KiZ.
  const randfall = (familienstand: "nicht_verheiratet" | "verheiratet"): Haushalt => {
    const t06 = testhaushalt("T06").eingabe;
    const [verdiener, partner] = t06.erwachsene as [Erwachsener, Erwachsener];
    const kind = t06.kinder[0];
    if (kind === undefined) throw new Error("T06 ohne Kind");
    return {
      ...t06,
      familienstand,
      erwachsene: [
        { ...verdiener, brutto: 190300, netto: 142725, krankenversicherung: "arbeit" },
        { ...partner, krankenversicherung: familienstand === "verheiratet" ? "familie" : "selbst" },
      ],
      kinder: [{ ...kind, alter: { jahre: 3, monate: 0 }, einkommen: 65000 }],
      kaltmiete: 30000,
      nebenkosten: 8000,
      heizkosten: 6000,
      vermoegen: { von: 0, bis: 999999 },
    };
  };

  it("Randfall Lücke A ≤ 0, mit Beitrag fehlt Geld: Ergebnisart wie ohne Beitrag, Hinweis auf den Zuschuss des Jobcenters", () => {
    const e = rechne(randfall("nicht_verheiratet"));
    expect(e.sgb2.lueckeA).toBe(-292);
    expect(e.ergebnis).toBe("weg_b_deckt");
    expect(e.wegB).toMatchObject({ wohngeld: 13300, fehlbetrag: 13434, krankenversicherung: 27026 });
    expect(e.hinweise).toEqual([{ code: "kv_zuschuss_jobcenter", sperrtErweitertenZugang: false }]);
  });

  it("Randfall mit Erspartem über dem Freibetrag: der Beitrag kommt aus dem Ersparten, kein Hinweis auf den Zuschuss", () => {
    const e = rechne({ ...randfall("nicht_verheiratet"), vermoegen: { von: 3000000, bis: 3000000 } });
    expect(e.ergebnis).toBe("weg_b_deckt");
    expect(e.wegB).toMatchObject({ fehlbetrag: 13434, restAusErspartem: true });
    expect(e.hinweise).toEqual([]);
  });

  it("Randfall, in dem der Beitrag den erweiterten Zugang auslöst: Ergebnis erweiterter Zugang, Hinweis warnt vor dem Zuschuss", () => {
    // Konstruiert: Lücke A −0,83 €, mit Beitrag fehlen 81,43 € (KiZ 5 €, im Bedarf nicht wirksam; Wohngeld 188 €).
    const h = randfall("nicht_verheiratet");
    const [verdiener, partner] = h.erwachsene as [Erwachsener, Erwachsener];
    const e = rechne({ ...h, kaltmiete: 50000, erwachsene: [{ ...verdiener, brutto: 207800, netto: 155850 }, partner] });
    expect(e.sgb2.lueckeA).toBe(-83);
    expect(e.kiz.anspruch).toBe("erweiterter_zugang");
    expect(e.wegB.fehlbetrag).toBe(8143);
    expect(e.ergebnis).toBe("erweiterter_zugang");
    expect(e.hinweise).toEqual([{ code: "kv_zuschuss_jobcenter", sperrtErweitertenZugang: true }]);
  });

  // „Weiß nicht“ mit weiterem Einkommen unbekannter Art: versichert angenommen (Empfehlung des rechts-pruefer,
  // Entscheidung von Nico am 31.10.2026). Kippt das Ergebnis, wenn die Person den Beitrag doch selbst zahlt, ein Hinweis.
  it("weiß nicht mit weiterem Einkommen: versichert angenommen; kippt das Ergebnis mit Beitrag, kommt ein Hinweis (T02, 100 €)", () => {
    const t02 = testhaushalt("T02").eingabe;
    const [verdiener, partner] = t02.erwachsene as [Erwachsener, Erwachsener];
    const e = rechne({ ...t02, erwachsene: [verdiener, { ...partner, krankenversicherung: "weiss_nicht", sonstigesEinkommen: 10000 }] });
    expect(e.wegB.krankenversicherung).toBe(0);
    expect(e.ergebnis).toBe("weg_b_deckt");
    expect(e.hinweise).toEqual([{ code: "kv_annahme_kippt", person: 1, ergebnisMitBeitrag: "nur_weg_a" }]);
  });

  it("weiß nicht mit weiterem Einkommen: kippt das Ergebnis nicht, kein Hinweis (T01, 100 €)", () => {
    const t01 = testhaushalt("T01").eingabe;
    const [verdiener, partner] = t01.erwachsene as [Erwachsener, Erwachsener];
    const e = rechne({
      ...t01,
      familienstand: "nicht_verheiratet",
      erwachsene: [
        { ...verdiener, krankenversicherung: "arbeit" },
        { ...partner, krankenversicherung: "weiss_nicht", sonstigesEinkommen: 10000 },
      ],
    });
    expect(e.ergebnis).toBe("weg_b_deckt");
    expect(e.hinweise).toEqual([]);
  });

  it("Randfall verheiratet: kein Beitrag, kein Hinweis", () => {
    const e = rechne(randfall("verheiratet"));
    expect(e.wegB.fehlbetrag).toBe(-13592);
    expect(e.hinweise).toEqual([]);
  });
});
