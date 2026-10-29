// Folgen-Katalog (Fachkonzept, M4): zu einem Ergebnis die Karten je Weg, die Einordnung, den nächsten Schritt und
// die Unterlagen. Die Inhalte stehen in folgen/*.json, jeder Eintrag mit Fundstelle, Status und einer Bedingung
// (src/bedingung.ts). Die Bedingungen prüfen benannte Fakten, die hier einmal aus Haushalt und Ergebnis entstehen.
// Die Dateien werden statisch importiert und beim Laden geprüft, wie die Parameter.
import { erfuellt, pruefeBedingung, type Bedingung, type FaktArt } from "./bedingung";
import type { Cent } from "./geld";
import type { Haushalt, Kind } from "./haushalt";
import type { KizAnspruch } from "./kiz";
import { mindestbeitragFreiwillig } from "./krankenversicherung";
import { STATUS, istDatum, rechtsstandZumStichtag, type Parameter, type Status } from "./parameter";
import type { Ergebnis, Vergleichsergebnis } from "./vergleich";
import katalogDatei from "../folgen/katalog.json";
import einordnungDatei from "../folgen/einordnung.json";
import schritteDatei from "../folgen/naechste-schritte.json";
import unterlagenDatei from "../folgen/unterlagen.json";

export type BerechnetesErgebnis = Extract<Ergebnis, { imUmfang: true }>;
export type Weg = "A" | "B" | "beide";
/** pflicht: Handeln nötig, sonst drohen Folgen. pruefung: die Behörde schaut genauer hin. */
export type Art = "pflicht" | "pruefung" | "gut_zu_wissen";
export type Leistung = "sgb2" | "kiz" | "wohngeld";

const WEGE: readonly Weg[] = ["A", "B", "beide"];
const ARTEN: readonly Art[] = ["pflicht", "pruefung", "gut_zu_wissen"];
const LEISTUNGEN: readonly Leistung[] = ["sgb2", "kiz", "wohngeld"];
const ERGEBNISSE = ["weg_b_deckt", "erweiterter_zugang", "nur_weg_a", "kein_anspruch"] as const satisfies readonly Vergleichsergebnis[];
const KIZ_ANSPRUECHE = [
  "ja", "erweiterter_zugang", "nein_mindesteinkommen", "nein_kein_betrag", "nein_vermoegen", "nein_bedarf_nicht_gedeckt",
] as const satisfies readonly KizAnspruch[];

/**
 * Die Fakten, auf die sich Bedingungen beziehen. Anzahlen zählen Personen. Die Altersgrenzen für Kinder kommen aus
 * den Parametern des Rechtsstands (kinderbetreuungZumutbarAbMonaten, kinderbetreuungBedarfUnterJahren); die Namen
 * nennen die Werte, die seit 01.07.2026 gelten.
 */
export const FAKTEN = {
  ergebnis: { art: "text", werte: ERGEBNISSE },
  stichtag: { art: "datum" },
  erwachsene: { art: "zahl" },
  /**
   * Brutto höchstens Minijob-Grenze: nicht über eine Arbeit versichert. Weiteres Einkommen zählt hier nicht: Version 0
   * fragt seine Art nicht ab. Die Karte nennt selbst, wer schon versichert ist (ALG I, Krankengeld; beim Elterngeld
   * meist, wer davor pflichtversichert war). Siehe offene-rechtsfragen.md Punkt 25.
   */
  erwachseneOhneEigeneVersicherung: { art: "zahl" },
  erwachseneMitErwerbseinkommen: { art: "zahl" },
  erwachseneMitSonstigemEinkommen: { art: "zahl" },
  /** Kinder, die den 14. Lebensmonat noch nicht vollendet haben (§ 10 Abs. 1 Nr. 3 SGB II). */
  "kinder.unter14Monate": { art: "zahl" },
  /** Kinder ab vollendetem 14. Lebensmonat und unter 14 Jahren: Ihre Betreuung muss gesichert sein. */
  "kinder.betreuungsalter": { art: "zahl" },
  /** Davon Kinder mit der Angabe „nicht betreut“. Fehlt die Angabe, zählt das Kind nicht. */
  "kinder.betreuungsalterOhneBetreuung": { art: "zahl" },
  "kinder.mitBetreuung": { art: "zahl" },
  /** Alter des ältesten Kindes in vollen Jahren. */
  "kinder.aeltestesJahre": { art: "zahl" },
  /** Kinder mit eigenem Einkommen (Unterhalt, Unterhaltsvorschuss). */
  "kinder.mitEinkommen": { art: "zahl" },
  "wegA.betrag": { art: "zahl" },
  /** Anspruch auf Grundsicherungsgeld, auch wenn er vom Ersparten abhängt oder erst nach dessen Einsatz besteht. */
  "wegA.grundsicherung": { art: "ja_nein" },
  "wegA.nachEinsatzDesErsparten": { art: "ja_nein" },
  /** Erspartes über dem Freibetrag deckt, was mit Weg B fehlt: Weg A ist ausgeschlossen (wie T06). */
  "wegA.ausgeschlossenWegenErspartem": { art: "ja_nein" },
  "kiz.anspruch": { art: "text", werte: KIZ_ANSPRUECHE },
  "kiz.auszahlung": { art: "zahl" },
  "kiz.erweiterterZugangMitErspartem": { art: "ja_nein" },
  "wohngeld.auszahlung": { art: "zahl" },
  "wegB.restAusErspartem": { art: "ja_nein" },
} as const satisfies Record<string, FaktArt>;

export type FaktName = keyof typeof FAKTEN;
type WertZu<A> = A extends { art: "zahl" }
  ? number
  : A extends { art: "ja_nein" }
    ? boolean
    : A extends { art: "text"; werte: readonly (infer W)[] }
      ? W
      : string;
export type Fakten = { [K in FaktName]: WertZu<(typeof FAKTEN)[K]> };

/**
 * Platzhalter in Texten, etwa „{kiz.vermoegensgrenze}“, mit ihrem Format. euro: Cent als „85.000 €“ oder
 * „123,45 €“. euro_gerundet: auf volle Euro gerundet, für Überschläge mit „etwa“. datum: „28. Oktober 2026“.
 */
export const PLATZHALTER = {
  "sgb2.vermoegensfreibetrag": "euro",
  "kiz.vermoegensgrenze": "euro",
  "kiz.erweiterterZugangHoechstens": "euro",
  "wohngeld.vermoegensgrenze": "euro",
  /** Mindestbeitrag einer freiwilligen Kranken- und Pflegeversicherung (src/krankenversicherung.ts). */
  "kv.mindestbeitrag": "euro_gerundet",
  /** An diesem Tag waren die Entwürfe für 2027 nicht beschlossen. */
  "kiz.entwurfGeprueftAm": "datum",
  "wohngeld.entwurfGeprueftAm": "datum",
} as const satisfies Record<string, "euro" | "euro_gerundet" | "datum">;
type Platzhalter = keyof typeof PLATZHALTER;

/** Wert eines Platzhalters mit Status und Fundstelle der Parameter, aus denen er stammt. */
interface Platzhalterwert {
  wert: Cent | string;
  status: Status;
  fundstelle: string;
}

interface Grunddaten {
  id: string;
  /** Kleinste zuerst. */
  prioritaet: number;
  fundstelle: string;
  /** Links für „Warum?“. */
  quelle: string[];
  status: Status;
  gueltigAb: string;
  geprueftAm?: string;
  /** Intern, wird nicht angezeigt. */
  notiz?: string;
  bedingung: Bedingung;
}

export interface KarteDaten extends Grunddaten {
  weg: Weg;
  thema: string;
  art: Art;
  titel: string;
  text: string;
  textLeicht: string;
  /** Eigener, hervorgehobener Platz auf dem Bildschirm. Fehlt das Feld, false. */
  hervorheben: boolean;
}

export interface EinordnungDaten extends Grunddaten {
  text: string;
  textLeicht: string;
}

/** minuten nur aus einer amtlichen Angabe (fundstelle), sonst null mit Status pruefen. */
export interface Dauer {
  minuten: number | null;
  fundstelle: string | null;
  status: Status;
}

export interface SchrittDaten extends Grunddaten {
  weg: Weg;
  titel: string;
  stelle: string | null;
  kanal: string | null;
  link: string | null;
  dauer: Dauer | null;
  text: string;
  textLeicht: string;
}

export interface UnterlageDaten extends Grunddaten {
  weg: "A" | "B";
  leistung: Leistung;
  text: string;
}

export interface FolgenDaten {
  karten: readonly KarteDaten[];
  einordnung: readonly EinordnungDaten[];
  schritte: readonly SchrittDaten[];
  unterlagen: readonly UnterlageDaten[];
}

type Roh = Record<string, unknown>;

function eintraege(datei: unknown, schluessel: string, name: string): Roh[] {
  const liste = (datei as Roh | null)?.[schluessel];
  if (!Array.isArray(liste)) throw new Error(`folgen/${name}: Liste „${schluessel}“ fehlt.`);
  return liste as Roh[];
}

function text(r: Roh, feld: string, ort: string): string {
  const wert = r[feld];
  if (typeof wert !== "string" || wert.trim() === "") throw new Error(`${ort}: ${feld} fehlt.`);
  pruefePlatzhalter(wert, ort);
  return wert;
}

function textOderNull(r: Roh, feld: string, ort: string): string | null {
  return r[feld] === null ? null : text(r, feld, ort);
}

function auswahl<T extends string>(r: Roh, feld: string, erlaubt: readonly T[], name: string, ort: string): T {
  const wert = r[feld];
  if (!erlaubt.includes(wert as T)) throw new Error(`${ort}: ${name} ${JSON.stringify(wert)} ist unbekannt.`);
  return wert as T;
}

function pruefePlatzhalter(wert: string, ort: string): void {
  for (const [, name] of wert.matchAll(/\{([^}]*)\}/g)) {
    if (!Object.hasOwn(PLATZHALTER, name ?? "")) throw new Error(`${ort}: unbekannter Platzhalter {${name}}.`);
  }
  if (/[{}]/.test(wert.replace(/\{[^}]*\}/g, ""))) throw new Error(`${ort}: einzelne geschweifte Klammer im Text.`);
}

function pruefeLink(wert: unknown, was: string, ort: string): string {
  if (typeof wert !== "string" || !wert.startsWith("https://")) {
    throw new Error(`${ort}: ${was} ${JSON.stringify(wert)} muss mit https:// beginnen.`);
  }
  return wert;
}

function grunddaten(r: Roh, datei: string): Grunddaten {
  const { id } = r;
  if (typeof id !== "string" || !/^[a-z0-9_]+$/.test(id)) throw new Error(`folgen/${datei}: ungültige id ${JSON.stringify(id)}.`);
  const ort = `folgen/${datei}: ${id}`;
  const status = auswahl(r, "status", STATUS, "Status", ort);
  if (typeof r.fundstelle !== "string" || r.fundstelle.trim() === "") throw new Error(`${ort}: Fundstelle fehlt.`);
  if (typeof r.gueltigAb !== "string" || !istDatum(r.gueltigAb)) {
    throw new Error(`${ort}: gueltigAb ${JSON.stringify(r.gueltigAb)} ist kein Datum (JJJJ-MM-TT).`);
  }
  if (r.geprueftAm !== undefined && (typeof r.geprueftAm !== "string" || !istDatum(r.geprueftAm))) {
    throw new Error(`${ort}: geprueftAm ${JSON.stringify(r.geprueftAm)} ist kein Datum.`);
  }
  if (status === "geprueft" && r.geprueftAm === undefined) throw new Error(`${ort}: geprueftAm fehlt bei Status geprueft.`);
  if (!Array.isArray(r.quelle)) throw new Error(`${ort}: Quelle muss eine Liste sein.`);
  if (typeof r.prioritaet !== "number" || !Number.isInteger(r.prioritaet)) throw new Error(`${ort}: prioritaet muss eine ganze Zahl sein.`);
  if (r.notiz !== undefined && typeof r.notiz !== "string") throw new Error(`${ort}: notiz muss Text sein.`);
  return {
    id,
    prioritaet: r.prioritaet,
    fundstelle: r.fundstelle,
    quelle: r.quelle.map((q) => pruefeLink(q, "Quelle", ort)),
    status,
    gueltigAb: r.gueltigAb,
    ...(r.geprueftAm === undefined ? {} : { geprueftAm: r.geprueftAm as string }),
    ...(r.notiz === undefined ? {} : { notiz: r.notiz }),
    bedingung: pruefeBedingung(r.bedingung, FAKTEN, ort),
  };
}

function karte(r: Roh): KarteDaten {
  const g = grunddaten(r, "katalog.json");
  const ort = `folgen/katalog.json: ${g.id}`;
  return {
    ...g,
    weg: auswahl(r, "weg", WEGE, "Weg", ort),
    thema: text(r, "thema", ort),
    art: auswahl(r, "art", ARTEN, "Art", ort),
    titel: text(r, "titel", ort),
    text: text(r, "text", ort),
    textLeicht: text(r, "textLeicht", ort),
    hervorheben: jaNein(r, "hervorheben", ort),
  };
}

function jaNein(r: Roh, feld: string, ort: string): boolean {
  const wert = r[feld];
  if (wert === undefined) return false;
  if (typeof wert !== "boolean") throw new Error(`${ort}: ${feld} muss true oder false sein, nicht ${JSON.stringify(wert)}.`);
  return wert;
}

function einordnung(r: Roh): EinordnungDaten {
  const g = grunddaten(r, "einordnung.json");
  const ort = `folgen/einordnung.json: ${g.id}`;
  return { ...g, text: text(r, "text", ort), textLeicht: text(r, "textLeicht", ort) };
}

function schritt(r: Roh): SchrittDaten {
  const g = grunddaten(r, "naechste-schritte.json");
  const ort = `folgen/naechste-schritte.json: ${g.id}`;
  return {
    ...g,
    weg: auswahl(r, "weg", WEGE, "Weg", ort),
    titel: text(r, "titel", ort),
    stelle: textOderNull(r, "stelle", ort),
    kanal: textOderNull(r, "kanal", ort),
    link: r.link === null ? null : pruefeLink(r.link, "Link", ort),
    dauer: dauer(r.dauer, ort),
    text: text(r, "text", ort),
    textLeicht: text(r, "textLeicht", ort),
  };
}

function dauer(roh: unknown, ort: string): Dauer | null {
  if (roh === null) return null;
  const r = roh as Roh;
  const minuten = r.minuten;
  if (minuten !== null && (typeof minuten !== "number" || !Number.isInteger(minuten) || minuten < 1)) {
    throw new Error(`${ort}: Dauer muss eine ganze Zahl Minuten oder null sein.`);
  }
  const fundstelle = r.fundstelle === null ? null : text(r, "fundstelle", `${ort} (Dauer)`);
  if (minuten !== null && fundstelle === null) throw new Error(`${ort}: Dauer braucht eine Fundstelle (amtliche Angabe).`);
  return { minuten, fundstelle, status: auswahl(r, "status", STATUS, "Status der Dauer", ort) };
}

function unterlage(r: Roh): UnterlageDaten {
  const g = grunddaten(r, "unterlagen.json");
  const ort = `folgen/unterlagen.json: ${g.id}`;
  return {
    ...g,
    weg: auswahl(r, "weg", ["A", "B"] as const, "Weg", ort),
    leistung: auswahl(r, "leistung", LEISTUNGEN, "Leistung", ort),
    text: text(r, "text", ort),
  };
}

function ohneDoppelte<T extends Grunddaten>(liste: T[], datei: string): T[] {
  const gesehen = new Set<string>();
  for (const e of liste) {
    const schluessel = `${e.id}@${e.gueltigAb}`;
    if (gesehen.has(schluessel)) throw new Error(`folgen/${datei}: id ${e.id} mit gueltigAb ${e.gueltigAb} doppelt.`);
    gesehen.add(schluessel);
  }
  return liste;
}

/** Prüft die vier Dateien und gibt sie typisiert zurück. Wirft beim ersten Fehler mit Datei und id. */
export function ladeFolgen(roh: { katalog: unknown; einordnung: unknown; schritte: unknown; unterlagen: unknown }): FolgenDaten {
  return {
    karten: ohneDoppelte(eintraege(roh.katalog, "karten", "katalog.json").map(karte), "katalog.json"),
    einordnung: ohneDoppelte(eintraege(roh.einordnung, "eintraege", "einordnung.json").map(einordnung), "einordnung.json"),
    schritte: ohneDoppelte(eintraege(roh.schritte, "schritte", "naechste-schritte.json").map(schritt), "naechste-schritte.json"),
    unterlagen: ohneDoppelte(eintraege(roh.unterlagen, "unterlagen", "unterlagen.json").map(unterlage), "unterlagen.json"),
  };
}

export const FOLGEN: FolgenDaten = ladeFolgen({
  katalog: katalogDatei,
  einordnung: einordnungDatei,
  schritte: schritteDatei,
  unterlagen: unterlagenDatei,
});

/** Leitet die Fakten für die Bedingungen ab. Prüft dabei die Angabe zur Betreuung, die nur die Folgen nutzen. */
export function ermittleFakten(haushalt: Haushalt, ergebnis: BerechnetesErgebnis): Fakten {
  haushalt.kinder.forEach((k, i) => {
    if (k.betreuung !== undefined && typeof k.betreuung !== "boolean") {
      throw new TypeError(`kinder[${i}].betreuung muss true, false oder leer sein, nicht ${JSON.stringify(k.betreuung)}.`);
    }
  });
  const stand = rechtsstandZumStichtag(ergebnis.stichtag);
  const minijobGrenze = stand.wohngeld.geringfuegigkeitsgrenze.wert;
  const zumutbarAbMonaten = stand.sgb2.kinderbetreuungZumutbarAbMonaten.wert;
  const betreuungUnterJahren = stand.sgb2.kinderbetreuungBedarfUnterJahren.wert;
  const monate = (k: Kind) => k.alter.jahre * 12 + k.alter.monate;
  const imBetreuungsalter = (k: Kind) => monate(k) >= zumutbarAbMonaten && k.alter.jahre < betreuungUnterJahren;
  const { erwachsene, kinder } = haushalt;
  const { sgb2, wegA, wegB, kiz, wohngeld } = ergebnis;
  const grundsicherung = sgb2.anspruch === "ja" || sgb2.anspruch === "unklar_vermoegen" || wegA.nachEinsatzDesErsparten;

  return {
    ergebnis: ergebnis.ergebnis,
    stichtag: ergebnis.stichtag,
    erwachsene: erwachsene.length,
    erwachseneOhneEigeneVersicherung: erwachsene.filter((e) => e.brutto <= minijobGrenze).length,
    erwachseneMitErwerbseinkommen: erwachsene.filter((e) => e.brutto > 0).length,
    erwachseneMitSonstigemEinkommen: erwachsene.filter((e) => e.sonstigesEinkommen > 0).length,
    "kinder.unter14Monate": kinder.filter((k) => monate(k) < zumutbarAbMonaten).length,
    "kinder.betreuungsalter": kinder.filter(imBetreuungsalter).length,
    "kinder.betreuungsalterOhneBetreuung": kinder.filter((k) => imBetreuungsalter(k) && k.betreuung === false).length,
    "kinder.mitBetreuung": kinder.filter((k) => k.betreuung === true).length,
    "kinder.aeltestesJahre": Math.max(0, ...kinder.map((k) => k.alter.jahre)),
    "kinder.mitEinkommen": kinder.filter((k) => k.einkommen > 0).length,
    "wegA.betrag": wegA.betrag,
    "wegA.grundsicherung": grundsicherung,
    "wegA.nachEinsatzDesErsparten": wegA.nachEinsatzDesErsparten,
    "wegA.ausgeschlossenWegenErspartem": sgb2.anspruch === "nein_vermoegen" && !wegA.nachEinsatzDesErsparten,
    "kiz.anspruch": kiz.anspruch,
    "kiz.auszahlung": kiz.auszahlung,
    "kiz.erweiterterZugangMitErspartem": kiz.hinweise.some((h) => h.code === "erweiterter_zugang_mit_erspartem"),
    "wohngeld.auszahlung": wohngeld.auszahlung,
    "wegB.restAusErspartem": wegB.restAusErspartem,
  };
}

/** Gemeinsame Felder der Ausgabe: Texte mit gefüllten Platzhaltern, Fundstelle für „Warum?“. */
export interface FolgenText {
  id: string;
  text: string;
  textLeicht: string;
  fundstelle: string;
  quelle: string[];
  status: Status;
}

export interface FolgenKarte extends FolgenText {
  weg: Weg;
  thema: string;
  art: Art;
  titel: string;
  /** Eigener, hervorgehobener Platz, unabhängig von der Art. */
  hervorheben: boolean;
}

export interface FolgenSchritt extends FolgenText {
  weg: Weg;
  titel: string;
  stelle: string | null;
  kanal: string | null;
  link: string | null;
  dauer: Dauer | null;
}

export interface FolgenUnterlage {
  id: string;
  weg: "A" | "B";
  leistung: Leistung;
  text: string;
  fundstelle: string;
  quelle: string[];
  status: Status;
}

/** einer: genau ein Schritt. wahl: echte Wahl, die Oberfläche fragt „Welchen Weg willst du gehen?“. */
export type NaechsterSchritt =
  | { art: "einer"; schritt: FolgenSchritt }
  | { art: "wahl"; wegA: FolgenSchritt; wegB: FolgenSchritt };

/** Ein angezeigter Eintrag mit Status pruefen oder geplant. Bei der Dauer eines Schritts: id „<schritt>.dauer“. */
export interface StatusHinweis {
  id: string;
  status: "pruefen" | "geplant";
  fundstelle: string;
}

export interface Folgen {
  stichtag: string;
  einordnung: FolgenText;
  /** Je Liste nach prioritaet sortiert, die wichtigsten zuerst. */
  karten: { wegA: FolgenKarte[]; wegB: FolgenKarte[]; beide: FolgenKarte[] };
  naechsterSchritt: NaechsterSchritt;
  unterlagen: { wegA: FolgenUnterlage[]; wegB: FolgenUnterlage[] };
  statusHinweise: StatusHinweis[];
}

// Je id die jüngste Fassung, die am Stichtag gilt; sortiert nach prioritaet, bei Gleichstand nach id.
function gueltig<T extends Grunddaten>(liste: readonly T[], stichtag: string): T[] {
  const juengste = new Map<string, T>();
  for (const e of liste) {
    if (e.gueltigAb > stichtag) continue;
    const bisher = juengste.get(e.id);
    if (bisher === undefined || bisher.gueltigAb < e.gueltigAb) juengste.set(e.id, e);
  }
  return [...juengste.values()].sort((a, b) => a.prioritaet - b.prioritaet || (a.id < b.id ? -1 : 1));
}

/** Betrag deutsch formatiert: 8500000 → „85.000 €“, 12345 → „123,45 €“. */
function euro(cent: Cent): string {
  const ganz = String(Math.trunc(cent / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const rest = Math.abs(cent % 100);
  return `${ganz}${rest === 0 ? "" : `,${String(rest).padStart(2, "0")}`} €`;
}

const MONATE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember",
];

/** Datum deutsch ausgeschrieben: „2026-10-28“ → „28. Oktober 2026“. */
function datum(iso: string): string {
  const [jahr, monat, tag] = iso.split("-").map(Number);
  return `${tag}. ${MONATE[(monat ?? 1) - 1]} ${jahr}`;
}

function formatiere(name: Platzhalter, wert: Cent | string): string {
  const format = PLATZHALTER[name];
  if (format === "datum") return datum(String(wert));
  const cent = Number(wert);
  return euro(format === "euro_gerundet" ? Math.round(cent / 100) * 100 : cent);
}

function platzhalterIn(vorlage: string): Platzhalter[] {
  return [...vorlage.matchAll(/\{([^}]+)\}/g)].map((m) => m[1] as Platzhalter);
}

function fuelle(vorlage: string, werte: Readonly<Record<Platzhalter, Platzhalterwert>>): string {
  return vorlage.replace(/\{([^}]+)\}/g, (_, name: Platzhalter) => formatiere(name, werte[name].wert));
}

const ausParameter = (wert: Cent | string, p: Pick<Parameter<unknown>, "status" | "fundstelle">): Platzhalterwert => ({
  wert,
  status: p.status,
  fundstelle: p.fundstelle,
});

export function folgen(haushalt: Haushalt, ergebnis: BerechnetesErgebnis): Folgen {
  const fakten = ermittleFakten(haushalt, ergebnis);
  const { stichtag } = ergebnis;
  const stand = rechtsstandZumStichtag(stichtag);
  const kvMindestbeitrag = mindestbeitragFreiwillig(stand.kv, haushalt.kinder.map((k) => k.alter.jahre));
  const werte: Record<Platzhalter, Platzhalterwert> = {
    "sgb2.vermoegensfreibetrag": ausParameter(ergebnis.sgb2.vermoegen.freibetrag, stand.sgb2.vermoegensfreibetrag),
    "kiz.vermoegensgrenze": ausParameter(ergebnis.kiz.vermoegen.grenze, stand.kiz.vermoegensgrenze),
    "kiz.erweiterterZugangHoechstens": ausParameter(
      stand.kiz.erweiterterZugang.wert.hoechstensFehlbetragCent,
      stand.kiz.erweiterterZugang,
    ),
    "wohngeld.vermoegensgrenze": ausParameter(ergebnis.wohngeld.vermoegen.grenze, stand.wohngeld.vermoegensgrenze),
    "kv.mindestbeitrag": { wert: kvMindestbeitrag.cent, status: kvMindestbeitrag.status, fundstelle: kvMindestbeitrag.fundstelle },
    "kiz.entwurfGeprueftAm": ausParameter(stand.kiz.entwurfGeprueftAm.wert, stand.kiz.entwurfGeprueftAm),
    "wohngeld.entwurfGeprueftAm": ausParameter(stand.wohngeld.entwurfGeprueftAm.wert, stand.wohngeld.entwurfGeprueftAm),
  };
  const passend = <T extends Grunddaten>(liste: readonly T[]) => gueltig(liste, stichtag).filter((e) => erfuellt(e.bedingung, fakten));
  const texte = (e: Grunddaten & { text: string; textLeicht: string }): FolgenText => ({
    id: e.id,
    text: fuelle(e.text, werte),
    textLeicht: fuelle(e.textLeicht, werte),
    fundstelle: e.fundstelle,
    quelle: e.quelle,
    status: e.status,
  });
  const alsKarte = (k: KarteDaten): FolgenKarte => ({
    ...texte(k),
    weg: k.weg,
    thema: k.thema,
    art: k.art,
    titel: fuelle(k.titel, werte),
    hervorheben: k.hervorheben,
  });
  const alsSchritt = (s: SchrittDaten): FolgenSchritt => ({
    ...texte(s),
    weg: s.weg,
    titel: s.titel,
    stelle: s.stelle,
    kanal: s.kanal,
    link: s.link,
    dauer: s.dauer,
  });

  const [einordnungDaten] = passend(FOLGEN.einordnung);
  if (einordnungDaten === undefined) throw new Error(`Keine Einordnung für das Ergebnis ${ergebnis.ergebnis}.`);

  const karten = passend(FOLGEN.karten);
  const kartenFuer = (weg: Weg) => karten.filter((k) => k.weg === weg).map(alsKarte);

  // Je Weg der erste passende Schritt. Ein Schritt für beide Wege steht allein.
  const schritte = passend(FOLGEN.schritte);
  const schrittFuer = (weg: Weg) => schritte.find((s) => s.weg === weg);
  const [a, b, beide] = [schrittFuer("A"), schrittFuer("B"), schrittFuer("beide")];
  let naechsterSchritt: NaechsterSchritt;
  if (beide !== undefined) naechsterSchritt = { art: "einer", schritt: alsSchritt(beide) };
  else if (a !== undefined && b !== undefined) naechsterSchritt = { art: "wahl", wegA: alsSchritt(a), wegB: alsSchritt(b) };
  else if (a !== undefined || b !== undefined) naechsterSchritt = { art: "einer", schritt: alsSchritt((a ?? b) as SchrittDaten) };
  else throw new Error(`Kein nächster Schritt für das Ergebnis ${ergebnis.ergebnis}.`);

  const unterlagen = passend(FOLGEN.unterlagen).map(
    (u): FolgenUnterlage => ({ id: u.id, weg: u.weg, leistung: u.leistung, text: u.text, fundstelle: u.fundstelle, quelle: u.quelle, status: u.status }),
  );

  // Platzhalter mit Status pruefen oder geplant in angezeigten Texten. Ist der Eintrag selbst pruefen oder geplant,
  // reicht der Hinweis auf den Eintrag.
  const platzhalterHinweise = (e: Grunddaten & { text: string; textLeicht: string; titel?: string }): StatusHinweis[] => {
    if (e.status === "pruefen" || e.status === "geplant") return [];
    const namen = new Set(platzhalterIn(`${e.titel ?? ""} ${e.text} ${e.textLeicht}`));
    return [...namen].flatMap((name) => {
      const { status, fundstelle } = werte[name];
      return status === "pruefen" || status === "geplant" ? [{ id: `${e.id}.${name}`, status, fundstelle }] : [];
    });
  };
  const gezeigteSchritte = [a, b, beide].filter(
    (s): s is SchrittDaten =>
      s !== undefined &&
      (naechsterSchritt.art === "einer" ? naechsterSchritt.schritt.id === s.id : [naechsterSchritt.wegA.id, naechsterSchritt.wegB.id].includes(s.id)),
  );

  const ergebnisFolgen: Omit<Folgen, "statusHinweise"> = {
    stichtag,
    einordnung: texte(einordnungDaten),
    karten: { wegA: kartenFuer("A"), wegB: kartenFuer("B"), beide: kartenFuer("beide") },
    naechsterSchritt,
    unterlagen: { wegA: unterlagen.filter((u) => u.weg === "A"), wegB: unterlagen.filter((u) => u.weg === "B") },
  };
  const platzhalter = [einordnungDaten, ...karten, ...gezeigteSchritte].flatMap(platzhalterHinweise);
  return { ...ergebnisFolgen, statusHinweise: [...statusHinweise(ergebnisFolgen), ...platzhalter] };
}

// Reihenfolge wie auf dem Bildschirm: Einordnung, Karten A, B, beide, Schritt(e), Unterlagen.
function statusHinweise(f: Omit<Folgen, "statusHinweise">): StatusHinweis[] {
  const hinweise: StatusHinweis[] = [];
  const merke = (id: string, status: Status, fundstelle: string) => {
    if (status === "pruefen" || status === "geplant") hinweise.push({ id, status, fundstelle });
  };
  const schritte = f.naechsterSchritt.art === "einer" ? [f.naechsterSchritt.schritt] : [f.naechsterSchritt.wegA, f.naechsterSchritt.wegB];
  for (const e of [f.einordnung, ...f.karten.wegA, ...f.karten.wegB, ...f.karten.beide]) merke(e.id, e.status, e.fundstelle);
  for (const s of schritte) {
    merke(s.id, s.status, s.fundstelle);
    if (s.dauer !== null) merke(`${s.id}.dauer`, s.dauer.status, s.dauer.fundstelle ?? "keine amtliche Angabe zur Dauer gefunden");
  }
  for (const u of [...f.unterlagen.wegA, ...f.unterlagen.wegB]) merke(u.id, u.status, u.fundstelle);
  return hinweise;
}
