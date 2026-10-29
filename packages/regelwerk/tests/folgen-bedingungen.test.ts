// Jede Bedingung im Folgen-Katalog: ein Fall, in dem der Eintrag erscheint, und Fälle, in denen nicht.
// Dazu: wie die Fakten aus Haushalt und Ergebnis entstehen (src/folgen.ts, ermittleFakten).
import { describe, expect, it } from "vitest";
import { erfuellt } from "../src/bedingung";
import { FOLGEN, ermittleFakten, type Fakten } from "../src/folgen";
import { berechne, type Erwachsener, type Haushalt, type Kind } from "../src/index";
import { testhaushalt } from "./testhaushalte";

// Neutral: kein Weg bringt Geld, niemand fällt unter eine Sonderregel.
const BASIS: Fakten = {
  ergebnis: "kein_anspruch",
  stichtag: "2026-07-01",
  erwachsene: 1,
  erwachseneOhneEigeneVersicherung: 0,
  erwachseneMitErwerbseinkommen: 0,
  erwachseneMitSonstigemEinkommen: 0,
  "kinder.unter14Monate": 0,
  "kinder.betreuungsalter": 0,
  "kinder.betreuungsalterOhneBetreuung": 0,
  "kinder.mitBetreuung": 0,
  "kinder.aeltestesJahre": 0,
  "kinder.mitEinkommen": 0,
  "wegA.betrag": 0,
  "wegA.grundsicherung": false,
  "wegA.nachEinsatzDesErsparten": false,
  "wegA.ausgeschlossenWegenErspartem": false,
  "kiz.anspruch": "nein_bedarf_nicht_gedeckt",
  "kiz.auszahlung": 0,
  "kiz.erweiterterZugangMitErspartem": false,
  "wohngeld.auszahlung": 0,
  "wegB.restAusErspartem": false,
};

type Fall = Partial<Fakten>;
// ja: Fälle, in denen der Eintrag erscheint. nein: Fälle, in denen nicht. Jeder Fall gilt auf BASIS.
const FAELLE: Record<string, { ja: Fall[]; nein: Fall[] }> = {};

const GRUND: Fall = { "wegA.grundsicherung": true };
const KIZ: Fall = { "kiz.auszahlung": 100 };
const WG: Fall = { "wohngeld.auszahlung": 100 };

function nurMitGrundsicherung(...ids: string[]) {
  for (const id of ids) FAELLE[id] = { ja: [GRUND], nein: [{}] };
}
function nurMit(fall: Fall, ...ids: string[]) {
  for (const id of ids) FAELLE[id] = { ja: [fall], nein: [{}] };
}

// Karten Weg A
Object.assign(FAELLE, {
  a_kinderbetreuung_unter_14_monate: {
    ja: [{ ...GRUND, "kinder.unter14Monate": 1 }],
    nein: [{ "kinder.unter14Monate": 1 }, GRUND],
  },
  a_kinderbetreuung_ab_14_monate: {
    ja: [{ ...GRUND, "kinder.betreuungsalter": 1 }],
    nein: [{ "kinder.betreuungsalter": 1 }, { ...GRUND, "kinder.betreuungsalter": 1, "kinder.unter14Monate": 1 }, GRUND],
  },
  a_kinderbetreuung_platz_fehlt: {
    ja: [{ ...GRUND, "kinder.betreuungsalterOhneBetreuung": 1 }],
    nein: [{ "kinder.betreuungsalterOhneBetreuung": 1 }, { ...GRUND, "kinder.betreuungsalter": 1 }],
  },
  a_partner: { ja: [{ ...GRUND, erwachsene: 2 }], nein: [{ erwachsene: 2 }, GRUND] },
  a_vorrang_kiz_wohngeld: {
    ja: [{ ...GRUND, ergebnis: "weg_b_deckt" }],
    nein: [{ ergebnis: "weg_b_deckt" }, { ...GRUND, ergebnis: "erweiterter_zugang" }],
  },
  a_kein_geld: {
    ja: [{}, { ergebnis: "weg_b_deckt", "kiz.auszahlung": 100 }],
    nein: [{ "wegA.betrag": 5000 }, { "wegA.ausgeschlossenWegenErspartem": true }],
  },
  a_erspartes_zuerst: {
    ja: [{ "wegA.nachEinsatzDesErsparten": true }, { "wegA.ausgeschlossenWegenErspartem": true }],
    nein: [{}],
  },
  a_erspartes: { ja: [GRUND], nein: [{}, { ...GRUND, "wegA.nachEinsatzDesErsparten": true }] },
  a_krankenversicherung: {
    ja: [{ ...GRUND, erwachseneOhneEigeneVersicherung: 1 }],
    nein: [{ erwachseneOhneEigeneVersicherung: 1 }, GRUND],
  },
  a_zustaendig: { ja: [{}], nein: [] },
});
nurMitGrundsicherung(
  "a_arbeit", "a_erstgespraech", "a_meldetermine", "a_kuerzungen", "a_arbeit_abgelehnt", "a_wohnung",
  "a_kontoauszuege", "a_ab_wann_geld", "a_bewilligung", "a_aenderungen", "a_einkommen_zaehlt",
);

// Karten Weg B
Object.assign(FAELLE, {
  b_arbeit_und_betreuung: { ja: [KIZ, WG], nein: [{}] },
  b_krankenversicherung: {
    ja: [{ ...KIZ, erwachseneOhneEigeneVersicherung: 1 }, { ...WG, erwachseneOhneEigeneVersicherung: 1 }],
    nein: [KIZ, { erwachseneOhneEigeneVersicherung: 1 }],
  },
  b_erweiterter_zugang_verguenstigungen: {
    ja: [{ ...KIZ, "kiz.anspruch": "erweiterter_zugang" }],
    nein: [{ ...KIZ, "kiz.anspruch": "ja" }, { "kiz.anspruch": "erweiterter_zugang" }],
  },
  b_erweiterter_zugang_erspartes: { ja: [{ "kiz.erweiterterZugangMitErspartem": true }], nein: [{}] },
  b_rest_aus_erspartem: { ja: [{ "wegB.restAusErspartem": true }], nein: [{}] },
  // Bewilligung 6 Monate ab Antragsmonat (§ 6a Abs. 7 BKGG): ab Stichtag 01.08.2026 reicht sie ins Jahr 2027.
  b_kiz_2027: {
    ja: [{ ...KIZ, stichtag: "2026-08-01" }, { ...KIZ, stichtag: "2026-12-31" }],
    nein: [{ ...KIZ, stichtag: "2026-07-31" }, { stichtag: "2026-08-01" }, { ...KIZ, stichtag: "2027-01-01" }],
  },
  b_wohngeld_2027: {
    ja: [{ ...WG, stichtag: "2026-07-01" }],
    nein: [{}, { ...WG, stichtag: "2026-01-31" }, { ...WG, stichtag: "2027-01-01" }],
  },
  // Ab Stichtag 2027 rechnet Gut Bescheid mit den Entwürfen (Hinweis des rechts-pruefer vom 28.10.2026).
  b_kiz_ab_2027: {
    ja: [{ ...KIZ, stichtag: "2027-01-01" }, { ...KIZ, stichtag: "2028-01-01" }],
    nein: [{ ...KIZ, stichtag: "2026-12-31" }, { stichtag: "2027-01-01" }],
  },
  b_wohngeld_ab_2027: {
    ja: [{ ...WG, stichtag: "2027-01-01" }],
    nein: [{ ...WG, stichtag: "2026-12-31" }, { stichtag: "2027-01-01" }],
  },
});
nurMit(KIZ, "b_kiz_6_monate", "b_kiz_ab_antragsmonat", "b_erspartes_kiz");
nurMit(WG, "b_wohngeld_12_monate", "b_wohngeld_aenderungen", "b_erspartes_wohngeld", "b_wohnung");
for (const id of ["b_kontoauszuege", "b_einkommen_zaehlt", "b_zustaendig"]) FAELLE[id] = { ja: [KIZ, WG], nein: [{}] };

// Karten für beide Wege
Object.assign(FAELLE, {
  beide_reihenfolge: {
    ja: [{ ergebnis: "erweiterter_zugang" }],
    nein: [{ ergebnis: "weg_b_deckt" }, { ergebnis: "nur_weg_a" }],
  },
  beide_bildung_teilhabe: { ja: [GRUND, KIZ, WG], nein: [{}] },
});

// Einordnung
Object.assign(FAELLE, {
  einordnung_erspartes: {
    ja: [{ ergebnis: "weg_b_deckt", "wegA.ausgeschlossenWegenErspartem": true }],
    nein: [{ ergebnis: "weg_b_deckt" }, { "wegA.ausgeschlossenWegenErspartem": true }],
  },
  einordnung_ohne_grundsicherung: {
    ja: [{ ergebnis: "weg_b_deckt" }],
    nein: [{ ergebnis: "weg_b_deckt", ...GRUND }, { ergebnis: "nur_weg_a" }],
  },
  einordnung_weg_b_deckt: { ja: [{ ergebnis: "weg_b_deckt" }], nein: [{ ergebnis: "nur_weg_a" }] },
  einordnung_erweiterter_zugang: { ja: [{ ergebnis: "erweiterter_zugang" }], nein: [{ ergebnis: "weg_b_deckt" }] },
  einordnung_nur_weg_a_erspartes: {
    ja: [{ ergebnis: "nur_weg_a", "wegA.nachEinsatzDesErsparten": true }],
    nein: [{ ergebnis: "nur_weg_a" }, { ergebnis: "erweiterter_zugang", "wegA.nachEinsatzDesErsparten": true }],
  },
  einordnung_nur_weg_a: { ja: [{ ergebnis: "nur_weg_a" }], nein: [{ ergebnis: "weg_b_deckt" }] },
  einordnung_kein_anspruch: { ja: [{ ergebnis: "kein_anspruch" }], nein: [{ ergebnis: "weg_b_deckt" }] },
});

// Nächste Schritte
Object.assign(FAELLE, {
  kiz_und_wohngeld_online: {
    ja: [{ ergebnis: "weg_b_deckt", ...KIZ, ...WG }, { ergebnis: "erweiterter_zugang", ...KIZ, ...WG }],
    nein: [{ ergebnis: "nur_weg_a", ...KIZ, ...WG }, { ergebnis: "weg_b_deckt", ...KIZ }, { ergebnis: "weg_b_deckt", ...WG }],
  },
  kiz_online: {
    ja: [{ ergebnis: "weg_b_deckt", ...KIZ }],
    nein: [{ ergebnis: "weg_b_deckt", ...KIZ, ...WG }, { ergebnis: "nur_weg_a", ...KIZ }],
  },
  wohngeld_online: {
    ja: [{ ergebnis: "weg_b_deckt", ...WG }],
    nein: [{ ergebnis: "weg_b_deckt", ...KIZ, ...WG }, { ergebnis: "nur_weg_a", ...WG }],
  },
  // Randfall: kein_anspruch, aber Weg A zeigt den Sofortzuschlag (vergleich.ts; Hinweis des rechts-pruefer).
  grundsicherung_online: {
    ja: [{ ergebnis: "nur_weg_a" }, { ergebnis: "erweiterter_zugang" }, { ergebnis: "kein_anspruch", "wegA.betrag": 5000 }],
    nein: [{ ergebnis: "weg_b_deckt" }, { ergebnis: "kein_anspruch" }],
  },
  kein_antrag: {
    ja: [{ ergebnis: "kein_anspruch" }],
    nein: [{ ergebnis: "weg_b_deckt" }, { ergebnis: "kein_anspruch", "wegA.betrag": 5000 }],
  },
});

// Unterlagen
const A: Fall = { "wegA.betrag": 100 };
const ERWERB: Fall = { erwachseneMitErwerbseinkommen: 1 };
nurMit(A, "sgb2_ausweis", "sgb2_kontoauszuege", "sgb2_mietvertrag", "sgb2_nebenkosten", "sgb2_mietquittungen", "sgb2_ausgaben", "sgb2_vermoegen");
nurMit(KIZ, "kiz_wohnkosten", "kiz_versicherungen", "kiz_aufenthaltstitel");
nurMit(
  WG,
  "wohngeld_mietvertrag", "wohngeld_mietbescheinigung", "wohngeld_mietzahlung", "wohngeld_versicherung",
  "wohngeld_vermoegen", "wohngeld_aufenthaltstitel",
);
Object.assign(FAELLE, {
  sgb2_lohn: { ja: [{ ...A, ...ERWERB }], nein: [A, ERWERB] },
  kiz_lohn: { ja: [{ ...KIZ, ...ERWERB }], nein: [KIZ, ERWERB] },
  kiz_fahrtkosten: { ja: [{ ...KIZ, ...ERWERB }], nein: [KIZ, ERWERB] },
  kiz_bescheide: {
    ja: [{ ...KIZ, "kinder.mitEinkommen": 1 }, { ...KIZ, erwachseneMitSonstigemEinkommen: 1 }],
    nein: [KIZ, { "kinder.mitEinkommen": 1 }],
  },
  kiz_betreuungskosten: { ja: [{ ...KIZ, "kinder.mitBetreuung": 1 }], nein: [KIZ, { "kinder.mitBetreuung": 1 }] },
  wohngeld_verdienst: { ja: [{ ...WG, ...ERWERB }], nein: [WG, ERWERB] },
  wohngeld_bescheide: {
    ja: [{ ...WG, ...KIZ }, { ...WG, erwachseneMitSonstigemEinkommen: 1 }, { ...WG, "kinder.mitEinkommen": 1 }],
    nein: [WG, KIZ],
  },
  wohngeld_unterhalt: { ja: [{ ...WG, "kinder.mitEinkommen": 1 }], nein: [WG, { "kinder.mitEinkommen": 1 }] },
  wohngeld_schulbescheinigung: {
    ja: [{ ...WG, "kinder.aeltestesJahre": 16 }],
    nein: [WG, { ...WG, "kinder.aeltestesJahre": 15 }, { "kinder.aeltestesJahre": 16 }],
  },
});

const ALLE = [...FOLGEN.karten, ...FOLGEN.einordnung, ...FOLGEN.schritte, ...FOLGEN.unterlagen];

describe("Bedingung je Eintrag", () => {
  it("für jeden Eintrag gibt es Testfälle, und jeder Testfall gehört zu einem Eintrag", () => {
    expect(Object.keys(FAELLE).sort()).toEqual(ALLE.map((e) => e.id).sort());
  });

  for (const eintrag of ALLE) {
    const faelle = FAELLE[eintrag.id];
    if (faelle === undefined) continue;
    faelle.ja.forEach((fall, i) => {
      it(`${eintrag.id} erscheint (Fall ${i + 1}: ${JSON.stringify(fall)})`, () => {
        expect(erfuellt(eintrag.bedingung, { ...BASIS, ...fall })).toBe(true);
      });
    });
    faelle.nein.forEach((fall, i) => {
      it(`${eintrag.id} erscheint nicht (Fall ${i + 1}: ${JSON.stringify(fall)})`, () => {
        expect(erfuellt(eintrag.bedingung, { ...BASIS, ...fall })).toBe(false);
      });
    });
  }

  it("für jedes Ergebnis passt mindestens eine Einordnung", () => {
    for (const ergebnis of ["weg_b_deckt", "erweiterter_zugang", "nur_weg_a", "kein_anspruch"] as const) {
      for (const [grundsicherung, ausgeschlossen, nachEinsatz] of [
        [true, false, false],
        [false, false, false],
        [false, true, false],
        [true, false, true],
      ]) {
        const fakten: Fakten = {
          ...BASIS,
          ergebnis,
          "wegA.grundsicherung": grundsicherung as boolean,
          "wegA.ausgeschlossenWegenErspartem": ausgeschlossen as boolean,
          "wegA.nachEinsatzDesErsparten": nachEinsatz as boolean,
        };
        expect(FOLGEN.einordnung.some((e) => erfuellt(e.bedingung, fakten))).toBe(true);
      }
    }
  });

  it("für jedes Ergebnis passt ein nächster Schritt, auch ohne Anspruch mit Sofortzuschlag", () => {
    for (const ergebnis of ["weg_b_deckt", "erweiterter_zugang", "nur_weg_a", "kein_anspruch"] as const) {
      for (const betragA of [0, 5000]) {
        const fakten: Fakten = { ...BASIS, ergebnis, ...KIZ, ...WG, "wegA.betrag": betragA };
        expect(FOLGEN.schritte.some((s) => erfuellt(s.bedingung, fakten)), `${ergebnis}, Weg A ${betragA}`).toBe(true);
      }
    }
  });
});

// Haushalte für die Fakten: T01 (Paar, Kinder 4 und 8) mit geänderten Kindern oder Erwachsenen.
function kind(jahre: number, monate: number, betreuung?: boolean): Kind {
  return { alter: { jahre, monate }, einkommen: 0, ausbildungsverguetung: 0, ...(betreuung === undefined ? {} : { betreuung }) };
}

function fakten(h: Haushalt, stichtag = "2026-07-01"): Fakten {
  const e = berechne(h, { stichtag });
  if (!e.imUmfang) throw new Error(`außerhalb des Umfangs: ${e.gruende.join(", ")}`);
  return ermittleFakten(h, e);
}

const T01 = testhaushalt("T01").eingabe;
const mitKindern = (...kinder: Kind[]): Haushalt => ({ ...T01, kinder });
const mitZweitem = (zweiter: Partial<Erwachsener>): Haushalt => ({
  ...T01,
  erwachsene: [T01.erwachsene[0] as Erwachsener, { ...(T01.erwachsene[1] as Erwachsener), ...zweiter }],
});

describe("Fakten aus Haushalt und Ergebnis", () => {
  it("Kind unter 14 Monaten: bis 13 Monate (§ 10 Abs. 1 Nr. 3 SGB II: „den 14. Lebensmonat vollendet“)", () => {
    expect(fakten(mitKindern(kind(1, 1)))["kinder.unter14Monate"]).toBe(1);
    expect(fakten(mitKindern(kind(1, 2)))["kinder.unter14Monate"]).toBe(0);
  });

  it("Betreuungsalter: ab 14 Monaten bis unter 14 Jahren (FW § 10 Rz. 10.16: Jugendliche in der Regel ohne Betreuungsbedarf)", () => {
    expect(fakten(mitKindern(kind(1, 1), kind(1, 2), kind(13, 11), kind(14, 0)))["kinder.betreuungsalter"]).toBe(2);
  });

  it("Betreuung: fehlt = unbekannt, zählt weder als betreut noch als unbetreut", () => {
    const f = fakten(mitKindern(kind(3, 0), kind(5, 0, false), kind(8, 0, true), kind(1, 0, false)));
    expect(f["kinder.betreuungsalterOhneBetreuung"]).toBe(1);
    expect(f["kinder.mitBetreuung"]).toBe(1);
  });

  it("Betreuung muss ja oder nein sein, wenn sie angegeben ist", () => {
    const h = mitKindern({ ...kind(3, 0), betreuung: "ja" as unknown as boolean });
    expect(() => fakten(h)).toThrow(/betreuung/);
  });

  it("Alter des ältesten Kindes und Kinder mit eigenem Einkommen", () => {
    const f = fakten(mitKindern(kind(15, 11), kind(16, 0), { ...kind(9, 0), einkommen: 22700 }));
    expect(f["kinder.aeltestesJahre"]).toBe(16);
    expect(f["kinder.mitEinkommen"]).toBe(1);
  });

  it("ohne eigene Krankenversicherung: Brutto höchstens Minijob-Grenze (603 € in 2026)", () => {
    expect(fakten(mitZweitem({ brutto: 0, netto: 0 })).erwachseneOhneEigeneVersicherung).toBe(1);
    expect(fakten(mitZweitem({ brutto: 60300, netto: 60300 })).erwachseneOhneEigeneVersicherung).toBe(1);
    expect(fakten(mitZweitem({ brutto: 60400, netto: 50000 })).erwachseneOhneEigeneVersicherung).toBe(0);
  });

  it("weiteres Einkommen ändert daran nichts: Version 0 kennt seine Art nicht, die Karte nennt, wer schon versichert ist", () => {
    // Mit ALG I oder Krankengeld ist man versichert, beim Elterngeld bleibt man es meist (§ 192 Abs. 1 Nr. 2 SGB V).
    // Das sagt die Karte selbst; die Bedingung zeigt sie deshalb allen mit Brutto höchstens an der Minijob-Grenze.
    expect(fakten(mitZweitem({ sonstigesEinkommen: 50000 })).erwachseneOhneEigeneVersicherung).toBe(1);
  });

  it("Minijob-Grenze nach Stichtag: 620 € ist 2026 über der Grenze, 2027 darunter (633 €)", () => {
    const h = mitZweitem({ brutto: 62000, netto: 62000 });
    expect(fakten(h, "2026-07-01").erwachseneOhneEigeneVersicherung).toBe(0);
    expect(fakten(h, "2027-01-01").erwachseneOhneEigeneVersicherung).toBe(1);
  });

  it("Erwachsene mit Erwerbseinkommen und mit weiterem Einkommen", () => {
    const f = fakten(mitZweitem({ sonstigesEinkommen: 50000 }));
    expect(f.erwachseneMitErwerbseinkommen).toBe(1);
    expect(f.erwachseneMitSonstigemEinkommen).toBe(1);
  });

  it("T01: Grundsicherung, Kinderzuschlag und Wohngeld", () => {
    expect(fakten(T01)).toMatchObject({
      ergebnis: "weg_b_deckt",
      erwachsene: 2,
      "wegA.grundsicherung": true,
      "wegA.betrag": 95900,
      "kiz.anspruch": "ja",
      "kiz.auszahlung": 59400,
      "wohngeld.auszahlung": 77500,
    });
  });

  it("T09: keine Grundsicherung, auf Weg A kein Geld (kein Sofortzuschlag, Entscheidung von Nico am 28.10.2026)", () => {
    expect(fakten(testhaushalt("T09").eingabe)).toMatchObject({
      "wegA.grundsicherung": false,
      "wegA.ausgeschlossenWegenErspartem": false,
      "wegA.betrag": 0,
    });
  });

  it("T06: Weg A wegen Erspartem ausgeschlossen", () => {
    expect(fakten(testhaushalt("T06").eingabe)).toMatchObject({
      "wegA.grundsicherung": false,
      "wegA.ausgeschlossenWegenErspartem": true,
      "wegA.nachEinsatzDesErsparten": false,
    });
  });

  it("Erspartes 50 € über dem Freibetrag (wie vergleich.test.ts): erweiterter Zugang nur dank Erspartem", () => {
    const h: Haushalt = {
      ...mitZweitem({}),
      erwachsene: [{ ...(T01.erwachsene[0] as Erwachsener), brutto: 120000, netto: 96000 }, T01.erwachsene[1] as Erwachsener],
      vermoegen: { von: 3005000, bis: 3005000 },
    };
    expect(fakten(h)).toMatchObject({
      ergebnis: "erweiterter_zugang",
      "wegA.grundsicherung": true,
      "wegA.nachEinsatzDesErsparten": true,
      "wegA.ausgeschlossenWegenErspartem": false,
      "kiz.erweiterterZugangMitErspartem": true,
    });
  });
});
