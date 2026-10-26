// Rechtsstände des Regelwerks. Jeder Ordner parameter/<gueltigAb>/ ist ein Stand.
// Die Dateien werden statisch importiert: keine Netzwerk- oder Dateizugriffe zur Laufzeit.
import type { Cent } from "./geld";
import sgb2_2026_07_01 from "../parameter/2026-07-01/sgb2.json";
import sgb2_2027_01_01 from "../parameter/2027-01-01/sgb2.json";

export type Status = "geprueft" | "aus_quelle" | "pruefen" | "geplant";

const STATUS: readonly Status[] = ["geprueft", "aus_quelle", "pruefen", "geplant"];

export interface Parameter<W> {
  wert: W;
  einheit: string;
  fundstelle: string;
  gueltigAb: string;
  status: Status;
  geprueftAm?: string;
  hinweis?: string;
}

/** Betrag nach Alter in vollen Jahren, beide Grenzen eingeschlossen. bisAlter = null: nach oben offen. */
export interface Altersstufe {
  vonAlter: number;
  bisAlter: number | null;
  cent: Cent;
}

export interface Sgb2Parameter {
  regelbedarfStufe1: Parameter<Cent>;
  regelbedarfStufe2: Parameter<Cent>;
  regelbedarfKinder: Parameter<Altersstufe[]>;
  mehrbedarfAlleinerziehend: Parameter<{
    prozentGrund: number;
    einKindUnterAlter: number;
    mehrereKinderUnterAlter: number;
    mehrereKinderAnzahlVon: number;
    mehrereKinderAnzahlBis: number;
    prozentJeKind: number;
    prozentHoechstens: number;
  }>;
  grundabsetzbetrag: Parameter<Cent>;
  erwerbstaetigenfreibetrag: Parameter<{
    stufen: { uebersteigtCent: Cent; bisCent: Cent; prozent: number }[];
    obergrenzeMitMinderjaehrigemKindCent: Cent;
  }>;
  versicherungspauschale: Parameter<Cent>;
  kindergeld: Parameter<Cent>;
  vermoegensfreibetrag: Parameter<Altersstufe[]>;
  wohnkosten: Parameter<"tatsaechliche_kosten">;
  rundung: Parameter<"kaufmaennisch_cent">;
}

/**
 * Hinweise, die ein ganzer Rechtsstand mitbringt. {jahr} ist das Jahr des Stichtags.
 * regelsaetze_offen: „Für {jahr} sind die Regelsätze und das Kindergeld noch nicht festgelegt. Gerechnet wird mit den Werten von 2026.“
 */
export type RechtsstandHinweis = "regelsaetze_offen";

export interface Rechtsstand {
  gueltigAb: string;
  sgb2: Sgb2Parameter;
  hinweise: RechtsstandHinweis[];
}

/** Meldung, dass ein Wert mit Status "pruefen" oder "geplant" ins Ergebnis eingeflossen ist. */
export interface ParameterHinweis {
  name: string;
  status: "pruefen" | "geplant";
  fundstelle: string;
}

// JSON kennt keine Literal-Typen: Status und Text-Werte kommen als string an und werden zur Laufzeit geprüft.
type Roh<T> = {
  [K in keyof T]: T[K] extends Parameter<infer W>
    ? Omit<Parameter<W extends string ? string : W>, "status"> & { status: string }
    : never;
};

const TEXTWERTE: Partial<Record<keyof Sgb2Parameter, string>> = {
  wohnkosten: "tatsaechliche_kosten",
  rundung: "kaufmaennisch_cent",
};

function pruefeSgb2(gueltigAb: string, roh: Roh<Sgb2Parameter>): Sgb2Parameter {
  for (const [name, p] of Object.entries(roh) as [keyof Sgb2Parameter, Roh<Sgb2Parameter>[keyof Sgb2Parameter]][]) {
    const ort = `parameter/${gueltigAb}/sgb2.json: ${name}`;
    if (!STATUS.includes(p.status as Status)) throw new Error(`${ort} hat unbekannten Status "${p.status}".`);
    if (p.fundstelle.trim() === "") throw new Error(`${ort} hat keine Fundstelle.`);
    if (!istDatum(p.gueltigAb) || p.gueltigAb > gueltigAb) throw new Error(`${ort} hat ungültiges gueltigAb.`);
    const text = TEXTWERTE[name];
    if (text !== undefined && p.wert !== text) throw new Error(`${ort} hat unbekannten Wert "${String(p.wert)}".`);
  }
  return roh as Sgb2Parameter;
}

/** Alle Stände, ältester zuerst. */
export const RECHTSSTAENDE: readonly Rechtsstand[] = [
  {
    gueltigAb: "2026-07-01",
    sgb2: pruefeSgb2("2026-07-01", sgb2_2026_07_01 satisfies Roh<Sgb2Parameter>),
    hinweise: [],
  },
  {
    // Fortschreibung: Regelsätze und Kindergeld 2027 sind noch nicht festgelegt (Status pruefen).
    gueltigAb: "2027-01-01",
    sgb2: pruefeSgb2("2027-01-01", sgb2_2027_01_01 satisfies Roh<Sgb2Parameter>),
    hinweise: ["regelsaetze_offen"],
  },
];

function istDatum(text: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const datum = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(datum.getTime()) && datum.toISOString().slice(0, 10) === text;
}

/** Der Stand, der am Stichtag (JJJJ-MM-TT) gilt: der jüngste mit gueltigAb am oder vor dem Stichtag. */
export function rechtsstandZumStichtag(stichtag: string): Rechtsstand {
  if (!istDatum(stichtag)) throw new RangeError(`Stichtag "${stichtag}" ist kein Datum im Format JJJJ-MM-TT.`);
  const stand = RECHTSSTAENDE.filter((s) => s.gueltigAb <= stichtag).at(-1);
  if (stand === undefined) {
    throw new RangeError(
      `Kein Rechtsstand für Stichtag ${stichtag}. Frühester Stand: ${RECHTSSTAENDE[0]?.gueltigAb ?? "keiner"}.`,
    );
  }
  return stand;
}

export function parameterHinweis(name: string, p: Parameter<unknown>): ParameterHinweis | undefined {
  if (p.status !== "pruefen" && p.status !== "geplant") return undefined;
  return { name, status: p.status, fundstelle: p.fundstelle };
}
