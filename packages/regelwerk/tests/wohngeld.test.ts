// Wohngeld (§§ 11–21 WoGG, Anlagen 1–3). Amtliche Sollwerte: Wohngeld-Plus-Rechner BMWSB
// (Rechtsstand ab 1.1.2025), abgerufen von Nico am 28.10.2026. Werte für 2027 sind aus den geplanten
// Parametern (BT-Drs. 21/8284, Pauschbetrag aus BT-Drs. 21/8235) berechnet, nicht amtlich.
import { describe, expect, it } from "vitest";
import { berechneWohngeld, rechtsstandZumStichtag, schaetzeAbzuege } from "../src/index";
import type { Erwachsener, Haushalt } from "../src/index";
import { testhaushalt } from "./testhaushalte";

const STICHTAG = "2026-07-01";
const p2026 = rechtsstandZumStichtag(STICHTAG).wohngeld;

function rechne(h: Haushalt, stichtag = STICHTAG) {
  const e = berechneWohngeld(h, { stichtag });
  if (!e.imUmfang) throw new Error(`außerhalb des Umfangs: ${e.gruende.join(", ")}`);
  return e;
}

function mitEinkommen(id: string, brutto: number, netto: number): Haushalt {
  const h = testhaushalt(id).eingabe;
  const [verdienend, ...rest] = h.erwachsene as [Erwachsener, ...Erwachsener[]];
  return { ...h, erwachsene: [{ ...verdienend, brutto, netto }, ...rest] };
}

describe("Kontrollwerte wie T01 und T07 mit anderem Brutto (amtlich, Netto 80 %, ohne Lohnsteuer)", () => {
  const faelle: [number, number][] = [
    [120000, 94000],
    [160000, 91800],
    [180000, 86300],
    [200000, 80700],
    [220000, 75000],
  ];
  it.each(faelle)("Brutto %i Cent: Wohngeld %i Cent", (brutto, wohngeld) => {
    const e = rechne(mitEinkommen("T01", brutto, (brutto * 8) / 10));
    expect(e.einkommen.personen[0]?.abzuege).toEqual({ steuer: false, kvpv: true, rv: true });
    expect(e.betrag).toBe(wohngeld);
  });
});

describe("Rechenweg nach Anlage 3 WoGG", () => {
  it("T01: Miete unter dem Höchstbetrag, M = 930 + 197,80 €, Y = 1.608,25 €", () => {
    const e = rechne(testhaushalt("T01").eingabe);
    expect(e.personen).toBe(4);
    expect(e.mietenstufe).toBe("V");
    expect(e.miete).toEqual({
      bruttokaltmiete: 93000,
      hoechstbetrag: 94600,
      klimakomponente: 3440,
      heizkostenentlastung: 19780,
      gedeckelt: false,
      m: "1127.8000000000",
    });
    // (2.400 × 12 − 1.230) × 70 % ÷ 12
    expect(e.einkommen.y).toBe("1608.2500000000");
    expect(e.ungerundet).toBe("774.9552232743");
    expect(e.betrag).toBe(77500);
    expect(e.hinweise).toEqual([{ code: "abzuege_geschaetzt" }]);
  });

  it("T08: Miete über dem Höchstbetrag, gedeckelt auf 975 + 29,60 €, mit Hinweis", () => {
    const e = rechne(testhaushalt("T08").eingabe);
    expect(e.miete.gedeckelt).toBe(true);
    expect(e.miete.m).toBe("1174.8000000000");
    expect(e.betrag).toBe(31400);
    expect(e.hinweise).toContainEqual({ code: "miete_ueber_hoechstbetrag" });
  });

  it("T03: Unterhaltsvorschuss zählt beim Kind, Freibetrag Alleinerziehende 1.320 €", () => {
    const e = rechne(testhaushalt("T03").eingabe);
    // (1.300 × 12 − 1.230) × 70 % + 227 × 12 − 1.320 = 11.463 € im Jahr
    expect(e.einkommen.freibetraege).toBe(132000);
    expect(e.einkommen.y).toBe("955.2500000000");
    expect(e.einkommen.personen[1]).toEqual({
      jahreseinkommen: "2724.0000000000",
      abzuege: { steuer: false, kvpv: false, rv: false },
    });
    expect(e.betrag).toBe(53100);
  });

  it("T09: 226 € statt amtlich 225 €, ungerundet 225,5966 € (dokumentiert in T09.json)", () => {
    const e = rechne(testhaushalt("T09").eingabe);
    expect(e.einkommen.y).toBe("3078.2500000000");
    expect(e.ungerundet).toBe("225.5966033733");
    expect(e.betrag).toBe(22600);
  });

  it("Mindestwerte: Einkommen unter 1.132 € (4 Personen) wird ersetzt", () => {
    const e = rechne(testhaushalt("T04").eingabe);
    expect(e.einkommen.y).toBe("1132.0000000000");
    expect(e.betrag).toBe(69100);
  });

  it("Ergebnis unter 10 €: kein Anspruch (§ 21 Nr. 1 WoGG)", () => {
    const e = rechne(mitEinkommen("T08", 400000, 280000));
    expect(e.ungerundet).toBe("3.3709624535");
    expect(e.betrag).toBe(300);
    expect(e.anspruch).toBe("nein_mindestbetrag");
    expect(e.auszahlung).toBe(0);
  });

  it("höchstens die Miete: 12 Personen ohne Einkommen und ohne Kaltmiete (WoGVwV Nr. 19.21)", () => {
    const erwachsener: Erwachsener = { alter: 35, brutto: 0, netto: 0, sonstigesEinkommen: 0 };
    const kinder = Array.from({ length: 10 }, (_, i) => ({
      alter: { jahre: i + 3, monate: 0 },
      einkommen: 0,
      ausbildungsverguetung: 0,
    }));
    const h: Haushalt = {
      ...testhaushalt("T01").eingabe,
      erwachsene: [erwachsener, erwachsener],
      kinder,
      kaltmiete: 0,
      nebenkosten: 0,
    };
    const e = rechne(h);
    // M = 0 + 225,40 + 7 × 27,60 = 418,60 €; Y = Mindestwert 2.943 €
    expect(e.miete.m).toBe("418.6000000000");
    expect(e.ungerundet).toBe("510.5662604260");
    expect(e.betrag).toBe(41800);
    expect(e.parameterHinweise.map((h) => h.name)).toContain("wohngeld.obergrenzeMiete");
  });

  it("negatives Ergebnis ergibt 0 €", () => {
    const e = rechne(mitEinkommen("T01", 800000, 520000));
    expect(e.betrag).toBe(0);
    expect(e.anspruch).toBe("nein_mindestbetrag");
  });
});

describe("Schätzung der Abzüge nach § 16 WoGG aus Brutto und Netto (Regel vom 28.10.2026)", () => {
  it("ohne Erwerbseinkommen: keine Abzüge", () => {
    expect(schaetzeAbzuege(0, 0, p2026)).toEqual({ steuer: false, kvpv: false, rv: false });
  });

  it("Minijob bis 603 €: keine KV/PV; RV nur, wenn das Netto kleiner ist", () => {
    expect(schaetzeAbzuege(60300, 60300, p2026)).toEqual({ steuer: false, kvpv: false, rv: false });
    expect(schaetzeAbzuege(60300, 58130, p2026)).toEqual({ steuer: false, kvpv: false, rv: true });
  });

  it("über 603 €: KV/PV und RV", () => {
    expect(schaetzeAbzuege(60301, 50000, p2026)).toEqual({ steuer: false, kvpv: true, rv: true });
  });

  it("Steuer erst, wenn Brutto minus Netto mehr als 22,5 % vom Brutto ist", () => {
    expect(schaetzeAbzuege(200000, 155000, p2026).steuer).toBe(false);
    expect(schaetzeAbzuege(200000, 154999, p2026).steuer).toBe(true);
    // T03: 1.300 → 1.000 € sind 23,1 %
    expect(schaetzeAbzuege(130000, 100000, p2026).steuer).toBe(true);
  });

  it("Stand 2027: Minijob-Grenze 633 € (Mindestlohn 14,60 €)", () => {
    const p2027 = rechtsstandZumStichtag("2027-01-01").wohngeld;
    expect(schaetzeAbzuege(63300, 50000, p2027).kvpv).toBe(false);
    expect(schaetzeAbzuege(63301, 50000, p2027).kvpv).toBe(true);
  });
});

describe("Sonstiges Einkommen (Version 0: voll, ohne Abzüge)", () => {
  it("zählt zwölffach ohne Abzüge, mit Hinweis „grob geschätzt“", () => {
    const h = testhaushalt("T01").eingabe;
    const [verdienend, partner] = h.erwachsene as [Erwachsener, Erwachsener];
    const e = rechne({ ...h, erwachsene: [verdienend, { ...partner, sonstigesEinkommen: 30000 }] });
    expect(e.einkommen.personen[1]?.jahreseinkommen).toBe("3600.0000000000");
    expect(e.einkommen.y).toBe("1908.2500000000");
    expect(e.betrag).toBe(66600);
    expect(e.hinweise).toContainEqual({ code: "sonstiges_einkommen_grob" });
  });
});

describe("Vermögen (§ 21 Nr. 3 WoGG)", () => {
  it("T06: 60.000 € liegen unter 60.000 + 2 × 30.000 €", () => {
    expect(rechne(testhaushalt("T06").eingabe).vermoegen).toEqual({ grenze: 12000000, ergebnis: "unter_grenze" });
  });

  it("über der Grenze: kein Anspruch", () => {
    const e = rechne({ ...testhaushalt("T06").eingabe, vermoegen: { von: 12000001, bis: null } });
    expect(e.anspruch).toBe("nein_vermoegen");
    expect(e.auszahlung).toBe(0);
  });

  it("Spanne über die Grenze hinweg: Anspruch bleibt, mit Hinweis", () => {
    const e = rechne({ ...testhaushalt("T06").eingabe, vermoegen: { von: 7000000, bis: null } });
    expect(e.vermoegen.ergebnis).toBe("unklar");
    expect(e.anspruch).toBe("ja");
    expect(e.hinweise).toContainEqual({ code: "vermoegen_unklar", grenze: 12000000 });
  });
});

describe("Mietenstufe aus Gemeinde oder Kreis", () => {
  it("Gemeinde nicht in der Liste: Mietenstufe des Kreises", () => {
    const h = { ...testhaushalt("T04").eingabe, gemeinde: { name: "Fürstenzell, Markt", kreis: "Passau" } };
    expect(rechne(h).mietenstufe).toBe("I");
  });

  it("unbekannte Gemeinde ohne Kreis: klarer Fehler", () => {
    const h = { ...testhaushalt("T01").eingabe, gemeinde: { name: "Atlantis", kreis: null } };
    expect(() => berechneWohngeld(h, { stichtag: STICHTAG })).toThrow(/Mietenstufe/);
  });
});

describe("Geplante Fassung ab 1.1.2027 (BT-Drs. 21/8284 und 21/8235, nicht beschlossen)", () => {
  it("T01: Heizkostenentlastung 111,80 € statt 197,80 €, neues c, Pauschbetrag 1.430 €: 684 € (berechnet)", () => {
    const e = rechne(testhaushalt("T01").eingabe, "2027-01-01");
    expect(e.miete.heizkostenentlastung).toBe(11180);
    // (2.400 × 12 − 1.430) × 70 % = 19.159 € im Jahr (BT-Drs. 21/8235: Pauschbetrag 1.430 €)
    expect(e.einkommen.personen[0]?.jahreseinkommen).toBe("19159.0000000000");
    expect(e.ungerundet).toBe("684.4432808089");
    expect(e.betrag).toBe(68400);
    expect(e.geplant).toBe(true);
    const geplant = e.parameterHinweise.filter((h) => h.status === "geplant").map((h) => h.name);
    expect(geplant).toEqual(
      expect.arrayContaining(["wohngeld.heizkostenentlastung", "wohngeld.formelwerte", "wohngeld.werbungskostenPauschbetrag"]),
    );
  });

  it("T04: Pocking steigt in Mietenstufe II, Wohngeld 669 € (berechnet)", () => {
    const e = rechne(testhaushalt("T04").eingabe, "2027-01-01");
    expect(e.mietenstufe).toBe("II");
    expect(e.betrag).toBe(66900);
    expect(e.parameterHinweise.map((h) => h.name)).toContain("mietenstufen.bayern");
  });

  it("T10: Regenstauf steigt in Mietenstufe III, Wohngeld 489 € (berechnet)", () => {
    const e = rechne(testhaushalt("T10").eingabe, "2027-01-01");
    expect(e.mietenstufe).toBe("III");
    expect(e.betrag).toBe(48900);
  });

  it("Minijob: 2026 mit Pauschbetrag (pruefen), 2027 ohne Werbungskosten (geplant)", () => {
    const h = mitEinkommen("T01", 50000, 50000);
    const e2026 = rechne(h);
    expect(e2026.einkommen.personen[0]).toEqual({
      jahreseinkommen: "4770.0000000000",
      abzuege: { steuer: false, kvpv: false, rv: false },
    });
    expect(e2026.parameterHinweise).toContainEqual(
      expect.objectContaining({ name: "wohngeld.werbungskostenMinijob", status: "pruefen" }),
    );
    const e2027 = rechne(h, "2027-01-01");
    expect(e2027.einkommen.personen[0]?.jahreseinkommen).toBe("6000.0000000000");
    expect(e2027.parameterHinweise).toContainEqual(
      expect.objectContaining({ name: "wohngeld.werbungskostenMinijob", status: "geplant" }),
    );
  });

  it("Mindestbetrag 15 € statt 10 €", () => {
    expect(rechtsstandZumStichtag("2027-01-01").wohngeld.mindestbetrag.wert).toBe(1500);
  });

  it("Stand 2026 ist nicht geplant", () => {
    const e = rechne(testhaushalt("T01").eingabe);
    expect(e.geplant).toBe(false);
    expect(e.parameterHinweise.filter((h) => h.status === "geplant")).toEqual([]);
  });
});
