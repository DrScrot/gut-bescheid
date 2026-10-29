// Lesefassung des Folgen-Katalogs für Menschen: docs/folgen-katalog.md, erzeugt aus folgen/*.json.
// Schreiben mit `pnpm katalog` (scripts/katalog-schreiben.mjs). Ein Test vergleicht die Datei mit dieser Ausgabe,
// damit sie nie vom Katalog abweicht. Ohne Imports aus src/, damit Node das Skript direkt ausführen kann.
import katalog from "../folgen/katalog.json" with { type: "json" };
import einordnung from "../folgen/einordnung.json" with { type: "json" };
import schritte from "../folgen/naechste-schritte.json" with { type: "json" };
import unterlagen from "../folgen/unterlagen.json" with { type: "json" };

/** Lesbare Namen der Fakten (src/folgen.ts, FAKTEN). Ein Test prüft, dass jeder Fakt einen Namen hat. */
export const FAKT_NAMEN: Record<string, string> = {
  ergebnis: "Ergebnis",
  stichtag: "Stichtag",
  erwachsene: "Erwachsene",
  erwachseneOhneEigeneVersicherung: "Erwachsene mit Brutto höchstens an der Minijob-Grenze",
  erwachseneMitErwerbseinkommen: "Erwachsene mit Lohn",
  erwachseneMitSonstigemEinkommen: "Erwachsene mit weiterem Einkommen",
  "kinder.unter14Monate": "Kinder unter 14 Monaten",
  "kinder.betreuungsalter": "Kinder von 14 Monaten bis unter 14 Jahren",
  "kinder.betreuungsalterOhneBetreuung": "davon mit Angabe „nicht betreut“",
  "kinder.mitBetreuung": "Kinder mit Angabe „betreut“",
  "kinder.aeltestesJahre": "Alter des ältesten Kindes (Jahre)",
  "kinder.mitEinkommen": "Kinder mit Unterhalt oder Unterhaltsvorschuss",
  "wegA.betrag": "Betrag Weg A",
  "wegA.grundsicherung": "Grundsicherungsgeld möglich",
  "wegA.nachEinsatzDesErsparten": "Weg A erst nach Einsatz des Ersparten",
  "wegA.ausgeschlossenWegenErspartem": "Weg A wegen Erspartem ausgeschlossen",
  "kiz.anspruch": "Anspruch Kinderzuschlag",
  "kiz.auszahlung": "Kinderzuschlag",
  "kiz.erweiterterZugangMitErspartem": "erweiterter Zugang nur dank Erspartem",
  "wohngeld.auszahlung": "Wohngeld",
  "wegB.restAusErspartem": "Rest aus dem Ersparten",
};

/** Bedeutung der Platzhalter (src/folgen.ts, PLATZHALTER). Ein Test prüft, dass jeder Platzhalter erklärt ist. */
export const PLATZHALTER_NAMEN: Record<string, string> = {
  "sgb2.vermoegensfreibetrag": "Freibetrag für Erspartes in der Grundsicherung, je Haushalt",
  "kiz.vermoegensgrenze": "Grenze für Erspartes beim Kinderzuschlag, je Haushalt",
  "kiz.erweiterterZugangHoechstens": "höchster Fehlbetrag beim erweiterten Zugang",
  "wohngeld.vermoegensgrenze": "Grenze für Erspartes beim Wohngeld, je Haushalt",
  "kv.mindestbeitrag": "Mindestbeitrag einer freiwilligen Kranken- und Pflegeversicherung, auf Euro gerundet, je Kinderzahl",
  "kiz.entwurfGeprueftAm": "Tag, an dem der Stand des Entwurfs zum Kinderzuschlag 2027 geprüft wurde",
  "wohngeld.entwurfGeprueftAm": "Tag, an dem der Stand des Entwurfs zum Wohngeld 2027 geprüft wurde",
};

type Bedingung = Record<string, unknown>;

interface Eintrag {
  id: string;
  prioritaet: number;
  status: string;
  gueltigAb: string;
  fundstelle: string;
  notiz?: string;
  bedingung: Bedingung;
}

interface Karte extends Eintrag {
  weg: string;
  art: string;
  titel: string;
  text: string;
  textLeicht: string;
  hervorheben?: boolean;
}

interface Schritt extends Eintrag {
  weg: string;
  titel: string;
  stelle: string | null;
  kanal: string | null;
  link: string | null;
  dauer: { minuten: number | null; fundstelle: string | null; status: string } | null;
  text: string;
  textLeicht: string;
}

const WEG: Record<string, string> = { beide: "Beide Wege", A: "Weg A: Grundsicherung", B: "Weg B: Kinderzuschlag und Wohngeld" };
const ART: Record<string, string> = { pflicht: "Pflicht", pruefung: "Prüfung", gut_zu_wissen: "Gut zu wissen" };
const LEISTUNG: Record<string, string> = { sgb2: "Grundsicherung", kiz: "Kinderzuschlag", wohngeld: "Wohngeld" };
const ERSTER_STAND = "2026-07-01";

function wann(b: Bedingung): string {
  if (Array.isArray(b.alle)) {
    const teile = (b.alle as Bedingung[]).map(wann);
    return teile.length === 0 ? "immer" : teile.join(" und ");
  }
  if (Array.isArray(b.eines)) return `(${(b.eines as Bedingung[]).map(wann).join(" oder ")})`;
  if (b.nicht !== undefined) return `nicht (${wann(b.nicht as Bedingung)})`;
  const name = FAKT_NAMEN[String(b.fakt)] ?? String(b.fakt);
  if ("ist" in b) {
    if (b.ist === true) return name;
    if (b.ist === false) return `nicht ${name}`;
    return b.ist === 0 ? `${name} = 0` : `${name} = ${String(b.ist)}`;
  }
  if (Array.isArray(b.in)) return `${name}: ${b.in.join(" oder ")}`;
  if ("ab" in b) return b.ab === 1 ? `${name} > 0` : `${name} ab ${String(b.ab)}`;
  return `${name} vor ${String(b.unter)}`;
}

const sortiert = <T extends Eintrag>(liste: readonly T[]): T[] =>
  [...liste].sort((a, b) => a.prioritaet - b.prioritaet || a.id.localeCompare(b.id) || a.gueltigAb.localeCompare(b.gueltigAb));

function fuss(e: Eintrag): string[] {
  return [
    `*Fundstelle:* ${e.fundstelle}  `,
    `*Erscheint, wenn:* ${wann(e.bedingung)}${e.gueltigAb === ERSTER_STAND ? "" : `  \n*Gilt ab:* ${e.gueltigAb}`}`,
    ...(e.notiz === undefined ? [] : ["", `*Notiz (intern):* ${e.notiz}`]),
    "",
  ];
}

export function lesefassung(): string {
  const z: string[] = [
    "# Folgen-Katalog (Lesefassung)",
    "",
    "Erzeugt aus `packages/regelwerk/folgen/*.json` mit `pnpm katalog`. Nicht von Hand ändern: Ein Test vergleicht diese Datei mit dem Katalog.",
    "",
    "Platzhalter in geschweiften Klammern füllt das Regelwerk je Haushalt:",
    "",
    ...Object.entries(PLATZHALTER_NAMEN).map(([name, bedeutung]) => `- \`{${name}}\`: ${bedeutung}`),
    "",
    "## Karten",
    "",
  ];

  const karten = katalog.karten as Karte[];
  let nr = 0;
  for (const weg of ["beide", "A", "B"]) {
    z.push(`### ${WEG[weg]}`, "");
    for (const k of sortiert(karten.filter((k) => k.weg === weg))) {
      nr += 1;
      const hervor = k.hervorheben === true ? " · **hervorgehoben**" : "";
      z.push(`**${nr}. ${k.titel}** · ${ART[k.art] ?? k.art} · \`${k.status}\` · \`${k.id}\`${hervor}`, "");
      z.push(k.text, "", `*Leichte Sprache:* ${k.textLeicht}`, "", ...fuss(k));
    }
  }

  z.push("## Einordnung je Ergebnis", "");
  for (const e of sortiert(einordnung.eintraege as (Eintrag & { text: string; textLeicht: string })[])) {
    z.push(`\`${e.id}\` · \`${e.status}\``, "", e.text, "", `*Leichte Sprache:* ${e.textLeicht}`, "", ...fuss(e));
  }

  z.push("## Nächster Schritt", "");
  for (const s of sortiert(schritte.schritte as Schritt[])) {
    const dauer =
      s.dauer === null ? "–" : s.dauer.minuten === null ? `offen (\`${s.dauer.status}\`)` : `etwa ${s.dauer.minuten} Minuten (${s.dauer.fundstelle ?? ""})`;
    z.push(`**${s.titel}** · ${WEG[s.weg] ?? s.weg} · \`${s.status}\` · \`${s.id}\``, "");
    z.push(`Stelle: ${s.stelle ?? "–"} · Weg: ${s.kanal ?? "–"} · Link: ${s.link ?? "–"} · Dauer: ${dauer}`, "");
    z.push(s.text, "", `*Leichte Sprache:* ${s.textLeicht}`, "", ...fuss(s));
  }

  z.push("## Unterlagen", "");
  for (const weg of ["A", "B"]) {
    z.push(`### ${WEG[weg]}`, "");
    for (const u of sortiert((unterlagen.unterlagen as (Eintrag & { weg: string; leistung: string; text: string })[]).filter((u) => u.weg === weg))) {
      z.push(`- **${u.text}** (${LEISTUNG[u.leistung] ?? u.leistung}) · \`${u.status}\` · \`${u.id}\` · wenn: ${wann(u.bedingung)} · *${u.fundstelle}*`);
    }
    z.push("");
  }
  return `${z.join("\n").trimEnd()}\n`;
}
