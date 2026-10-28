// Wohngeld (WoGG): zu berücksichtigende Miete, Gesamteinkommen und die Formel nach § 19 WoGG mit Anlage 3.
// Version 0 rechnet für den ganzen Haushalt unter der Annahme, dass niemand Grundsicherung bezieht (§ 7 WoGG).
import type { Cent } from "./geld";
import { aufEuro, ausCent, ausText, geteiltDurch, mal, NACHKOMMASTELLEN, zuText, type Festkomma } from "./festkomma";
import type { Haushalt, Spanne } from "./haushalt";
import { mietenstufe as mietenstufeDer, MIETENSTUFEN, type Mietenstufe } from "./mietenstufen";
import {
  parameterHinweis,
  protokoll,
  rechtsstandZumStichtag,
  vereinige,
  type ParameterHinweis,
  type Personentabelle,
  type WohngeldParameter,
} from "./parameter";
import { pruefeHaushalt, type AusserhalbGrund } from "./sgb2";

/** Ob für das Jahreseinkommen je 10 % abgezogen werden (§ 16 WoGG). */
export interface Abzuege {
  steuer: boolean;
  kvpv: boolean;
  rv: boolean;
}

export type WohngeldAnspruch = "ja" | "nein_mindestbetrag" | "nein_vermoegen";

export type Vermoegensergebnis = "unter_grenze" | "ueber_grenze" | "unklar";

// Texte für die Oberfläche (M5, i18n) stehen am jeweiligen Code.
export type WohngeldHinweis =
  /** „Steuern und Sozialabgaben schätzen wir aus Brutto und Netto. Das Wohngeld kann höher oder niedriger sein.“ */
  | { code: "abzuege_geschaetzt" }
  /** „Weiteres Geld wie Arbeitslosengeld oder Elterngeld rechnen wir grob. Das Ergebnis ist nur eine Schätzung.“ */
  | { code: "sonstiges_einkommen_grob" }
  /** „Eure Miete liegt über dem Höchstbetrag. Für das Wohngeld zählt nur der Höchstbetrag.“ */
  | { code: "miete_ueber_hoechstbetrag" }
  /** „Habt ihr mehr als {grenze} € Erspartes, gibt es in der Regel kein Wohngeld.“ */
  | { code: "vermoegen_unklar"; grenze: Cent };

export type WohngeldErgebnis =
  | { imUmfang: false; stichtag: string; rechtsstand: string; gruende: AusserhalbGrund[] }
  | {
      imUmfang: true;
      stichtag: string;
      rechtsstand: string;
      /** Zu berücksichtigende Haushaltsmitglieder. */
      personen: number;
      mietenstufe: Mietenstufe;
      miete: {
        /** Kaltmiete plus Nebenkosten, ohne Heizung (§ 9 Abs. 2 WoGG). */
        bruttokaltmiete: Cent;
        hoechstbetrag: Cent;
        klimakomponente: Cent;
        heizkostenentlastung: Cent;
        /** Bruttokaltmiete über Höchstbetrag plus Klimakomponente. */
        gedeckelt: boolean;
        /** M der Formel in Euro, zehn Nachkommastellen. */
        m: string;
      };
      einkommen: {
        /** Je Haushaltsmitglied, Erwachsene zuerst. Jahreseinkommen in Euro nach den Abzügen (§§ 14–16 WoGG). */
        personen: { jahreseinkommen: string; abzuege: Abzuege }[];
        /** Freibeträge nach § 17 WoGG im Jahr. */
        freibetraege: Cent;
        /** Y der Formel: monatliches Gesamteinkommen in Euro, zehn Nachkommastellen. */
        y: string;
      };
      /** Ungerundetes Wohngeld z4 in Euro. */
      ungerundet: string;
      /** Gerundet auf volle Euro, mindestens 0. Rechnerisch, auch wenn kein Anspruch besteht. */
      betrag: Cent;
      vermoegen: { grenze: Cent; ergebnis: Vermoegensergebnis };
      anspruch: WohngeldAnspruch;
      /** Was ausgezahlt würde: betrag bei Anspruch, sonst 0. */
      auszahlung: Cent;
      /** Ein Wert aus einem nicht beschlossenen Gesetz ist eingeflossen. */
      geplant: boolean;
      hinweise: WohngeldHinweis[];
      parameterHinweise: ParameterHinweis[];
    };

// Anlage 2 und 3 WoGG gehen bis 12 Haushaltsmitglieder. Darüber gilt § 19 Abs. 3 WoGG, das rechnet Version 0 nicht.
const HOECHSTENS_PERSONEN = 12;

export function berechneWohngeld(haushalt: Haushalt, optionen: { stichtag: string }): WohngeldErgebnis {
  const stand = rechtsstandZumStichtag(optionen.stichtag);
  const kopf = { stichtag: optionen.stichtag, rechtsstand: stand.gueltigAb };
  const gruende = pruefeHaushalt(haushalt, stand);
  if (gruende.length > 0) return { imUmfang: false, ...kopf, gruende };

  const p = protokoll("wohngeld", stand.wohngeld);
  const { erwachsene, kinder } = haushalt;
  const personen = erwachsene.length + kinder.length;
  if (personen > HOECHSTENS_PERSONEN) {
    throw new RangeError(`Mehr als ${HOECHSTENS_PERSONEN} Haushaltsmitglieder rechnet Version 0 nicht (§ 19 Abs. 3 WoGG).`);
  }
  if (p.nimm("formel").nachkommastellen !== NACHKOMMASTELLEN) {
    throw new Error(`wohngeld.formel: Version 0 rechnet mit ${NACHKOMMASTELLEN} Nachkommastellen.`);
  }

  // Miete (§§ 9, 11, 12 WoGG): Bruttokaltmiete bis Höchstbetrag plus Klimakomponente, dazu die Heizkostenentlastung.
  const stufe = mietenstufeDer(haushalt.gemeinde, stand.mietenstufen);
  const hoechstbetrag = hoechstbetragFuer(p.nimm("hoechstbetraege"), personen, stufe);
  const klimakomponente = nachPersonen(p.nimm("klimakomponente"), personen);
  const heizkostenentlastung = nachPersonen(p.nimm("heizkostenentlastung"), personen);
  const bruttokaltmiete = haushalt.kaltmiete + haushalt.nebenkosten;
  const deckel = hoechstbetrag + klimakomponente;
  const gedeckelt = bruttokaltmiete > deckel;
  const mCent = Math.min(bruttokaltmiete, deckel) + heizkostenentlastung;

  // Einkommen (§§ 14–17 WoGG), Jahresbeträge in Euro als Festkomma.
  const abzugJeArt = p.nimm("abzugJeArt");
  const pauschbetrag = p.nimm("werbungskostenPauschbetrag");
  const einkommenErwachsene = erwachsene.map((e) => {
    const abzuege = schaetzeAbzuege(e.brutto, e.netto, stand.wohngeld);
    if (e.brutto > 0) {
      p.merke("geringfuegigkeitsgrenze");
      p.merke("abzuegeSchaetzung");
    }
    // Bis zur Minijob-Grenze gilt das Brutto als pauschal besteuerter Minijob (§ 14 Abs. 1 Satz 3 Nr. 2 WoGG).
    // Werbungskosten höchstens bis zur Höhe der Einnahmen.
    const minijob = e.brutto > 0 && e.brutto <= stand.wohngeld.geringfuegigkeitsgrenze.wert;
    const werbungskosten = minijob && p.nimm("werbungskostenMinijob") === "keine" ? 0 : pauschbetrag;
    const erwerb = Math.max(e.brutto * 12 - werbungskosten, 0);
    const prozent = 100 - abzugJeArt * [abzuege.steuer, abzuege.kvpv, abzuege.rv].filter(Boolean).length;
    // Version 0 (Entscheidung vom 28.10.2026): weiteres Einkommen voll, ohne Abzüge. Die Regeln je Art
    // (Arbeitslosengeld, Krankengeld, Elterngeld) folgen in M5.
    const jahreseinkommen = geteiltDurch(ausCent(erwerb) * BigInt(prozent), 100) + ausCent(e.sonstigesEinkommen * 12);
    return { jahreseinkommen, abzuege };
  });
  // Unterhalt (§ 14 Abs. 2 Nr. 19 WoGG) und Unterhaltsvorschuss (Nr. 21) zählen beim Kind, ohne Abzüge.
  const einkommenKinder = kinder.map((k) => ({
    jahreseinkommen: ausCent(k.einkommen * 12),
    abzuege: { steuer: false, kvpv: false, rv: false },
  }));
  const einkommenPersonen = [...einkommenErwachsene, ...einkommenKinder];

  // § 17 Nr. 3 WoGG: Erwachsene allein mit Kindern, mindestens ein Kind unter 18 mit Kindergeld.
  // Im Umfang sind alle Kinder unter 18 und bekommen Kindergeld.
  const freibetraege = erwachsene.length === 1 && kinder.length > 0 ? p.nimm("freibetragAlleinerziehend") : 0;
  const summe = einkommenPersonen.reduce((s, e) => s + e.jahreseinkommen, 0n) - ausCent(freibetraege);
  const yUngedeckelt = geteiltDurch(summe > 0n ? summe : 0n, 12);

  // Anlage 3 Nr. 1: kleinere Werte für M und Y werden ersetzt.
  const mindestwerte = p.nimm("mindestwerte");
  const m = groesser(ausCent(mCent), ausCent(stelle(mindestwerte.m, personen)));
  const y = groesser(yUngedeckelt, ausCent(stelle(mindestwerte.y, personen)));

  // Anlage 3 Nr. 2: z1 bis z4 als Festkommazahlen mit zehn Nachkommastellen.
  const formelwerte = p.nimm("formelwerte");
  const a = ausText(stelle(formelwerte.a, personen));
  const b = ausText(stelle(formelwerte.b, personen));
  const c = ausText(stelle(formelwerte.c, personen));
  const z1 = a + mal(b, m) + mal(c, y);
  const z2 = mal(z1, y);
  const z3 = m - z2;
  const z4 = mal(ausText(p.nimm("formel").faktor), z3);

  // Anlage 3 Nr. 3: kaufmännisch auf volle Euro. Höchstens die zu berücksichtigende Miete, auf Euro abgerundet
  // (WoGVwV Nr. 19.21; geplant § 19 Abs. 4 WoGG). Die Obergrenze gilt nur als eingeflossen, wenn sie greift.
  p.nimm("rundung");
  const gerundet = z4 > 0n ? aufEuro(z4) : 0;
  const hoechstens = Math.floor(mCent / 100) * 100;
  if (gerundet > hoechstens) p.merke("obergrenzeMiete");
  const betrag = Math.min(gerundet, hoechstens);

  // Vermögen (§ 21 Nr. 3 WoGG)
  const vermoegensgrenze = grenzeFuer(p.nimm("vermoegensgrenze"), personen);
  const vermoegen = vergleicheVermoegen(haushalt.vermoegen, vermoegensgrenze);

  const anspruch: WohngeldAnspruch =
    betrag < p.nimm("mindestbetrag") ? "nein_mindestbetrag" : vermoegen === "ueber_grenze" ? "nein_vermoegen" : "ja";

  const hinweise: WohngeldHinweis[] = [];
  if (erwachsene.some((e) => e.brutto > 0)) hinweise.push({ code: "abzuege_geschaetzt" });
  if (erwachsene.some((e) => e.sonstigesEinkommen > 0)) hinweise.push({ code: "sonstiges_einkommen_grob" });
  if (gedeckelt) hinweise.push({ code: "miete_ueber_hoechstbetrag" });
  if (anspruch === "ja" && vermoegen === "unklar") hinweise.push({ code: "vermoegen_unklar", grenze: vermoegensgrenze });

  const mietenstufenHinweis = parameterHinweis("mietenstufen.bayern", stand.mietenstufen);
  const parameterHinweise = vereinige(p.hinweise(), mietenstufenHinweis === undefined ? [] : [mietenstufenHinweis]);

  return {
    imUmfang: true,
    ...kopf,
    personen,
    mietenstufe: stufe,
    miete: { bruttokaltmiete, hoechstbetrag, klimakomponente, heizkostenentlastung, gedeckelt, m: zuText(m) },
    einkommen: {
      personen: einkommenPersonen.map((e) => ({ jahreseinkommen: zuText(e.jahreseinkommen), abzuege: e.abzuege })),
      freibetraege,
      y: zuText(y),
    },
    ungerundet: zuText(z4),
    betrag,
    vermoegen: { grenze: vermoegensgrenze, ergebnis: vermoegen },
    anspruch,
    auszahlung: anspruch === "ja" ? betrag : 0,
    geplant: parameterHinweise.some((h) => h.status === "geplant"),
    hinweise,
    parameterHinweise,
  };
}

/**
 * Schätzt aus Brutto und Netto, welche Abzüge nach § 16 WoGG gelten (Regel vom 28.10.2026, Status pruefen):
 * bis zur Minijob-Grenze keine Kranken- und Pflegeversicherung und Rentenversicherung nur, wenn vom Lohn etwas
 * abgeht; darüber beide. Steuer, wenn Brutto minus Netto mehr ist, als die Sozialabgaben höchstens sein können.
 * Kann in beide Richtungen irren: kleine Lohnsteuer bei Midijobs übersehen, oder andere Abzüge im Netto
 * (Entgeltumwandlung, Pfändung) für Steuer halten. In M5 prüfen: freiwillige Frage nach der Lohnsteuer auf der
 * Lohnabrechnung, mit „weiß nicht“ (vorgemerkt von Nico am 28.10.2026).
 */
export function schaetzeAbzuege(brutto: Cent, netto: Cent, p: WohngeldParameter): Abzuege {
  if (brutto === 0) return { steuer: false, kvpv: false, rv: false };
  if (brutto <= p.geringfuegigkeitsgrenze.wert) return { steuer: false, kvpv: false, rv: netto < brutto };
  const steuer = (brutto - netto) * 1000 > brutto * p.abzuegeSchaetzung.wert.steuerAbPromilleVomBrutto;
  return { steuer, kvpv: true, rv: true };
}

function hoechstbetragFuer(tabelle: WohngeldParameter["hoechstbetraege"]["wert"], personen: number, stufe: Mietenstufe): Cent {
  const spalte = MIETENSTUFEN.indexOf(stufe);
  const zeilen = tabelle.jePersonenzahl;
  const bis = Math.min(personen, zeilen.length);
  const grund = zeilen[bis - 1]?.[spalte];
  const mehr = tabelle.jeWeiterePerson[spalte];
  if (grund === undefined || mehr === undefined) throw new Error(`Kein Höchstbetrag für ${personen} Personen, Stufe ${stufe}.`);
  return grund + (personen - bis) * mehr;
}

function nachPersonen(tabelle: Personentabelle, personen: number): Cent {
  const bis = Math.min(personen, tabelle.jePersonenzahl.length);
  return stelle(tabelle.jePersonenzahl, bis) + (personen - bis) * tabelle.jeWeiterePerson;
}

/** Wert für eine Personenzahl aus einer Liste, Stelle 0 = eine Person. */
function stelle<T>(liste: T[], personen: number): T {
  const wert = liste[personen - 1];
  if (wert === undefined) throw new Error(`Kein Wert für ${personen} Personen.`);
  return wert;
}

function grenzeFuer(g: WohngeldParameter["vermoegensgrenze"]["wert"], personen: number): Cent {
  const grenze = g.erstesMitgliedCent + (personen - 1) * g.jeWeiteresMitgliedCent;
  return g.hoechstensCent === null ? grenze : Math.min(grenze, g.hoechstensCent);
}

function vergleicheVermoegen(vermoegen: Spanne, grenze: Cent): Vermoegensergebnis {
  if (vermoegen.von > grenze) return "ueber_grenze";
  if (vermoegen.bis !== null && vermoegen.bis <= grenze) return "unter_grenze";
  return "unklar";
}

function groesser(a: Festkomma, b: Festkomma): Festkomma {
  return a > b ? a : b;
}
