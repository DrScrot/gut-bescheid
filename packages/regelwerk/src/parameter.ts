// Rechtsstände des Regelwerks. Jeder Ordner parameter/<gueltigAb>/ ist ein Stand.
// Die Dateien werden statisch importiert: keine Netzwerk- oder Dateizugriffe zur Laufzeit.
import type { Cent } from "./geld";
import { indexiere, type MietenstufenFassung } from "./mietenstufen";
import mietenstufenBayern from "../daten/mietstufen-bayern.json";
import but_2026_07_01 from "../parameter/2026-07-01/but.json";
import kiz_2026_07_01 from "../parameter/2026-07-01/kiz.json";
import sgb2_2026_07_01 from "../parameter/2026-07-01/sgb2.json";
import wohngeld_2026_07_01 from "../parameter/2026-07-01/wohngeld.json";
import but_2027_01_01 from "../parameter/2027-01-01/but.json";
import kiz_2027_01_01 from "../parameter/2027-01-01/kiz.json";
import sgb2_2027_01_01 from "../parameter/2027-01-01/sgb2.json";
import wohngeld_2027_01_01 from "../parameter/2027-01-01/wohngeld.json";
import but_2028_01_01 from "../parameter/2028-01-01/but.json";
import kiz_2028_01_01 from "../parameter/2028-01-01/kiz.json";
import sgb2_2028_01_01 from "../parameter/2028-01-01/sgb2.json";
import wohngeld_2028_01_01 from "../parameter/2028-01-01/wohngeld.json";

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
  sofortzuschlagKind: Parameter<Cent>;
  /** § 72 Abs. 1 Satz 2 Nr. 2 SGB II auf Haushalte ohne Anspruch angewendet (Entscheidung vom 28.10.2026). */
  sofortzuschlagOhneAnspruch: Parameter<"wenn_luecke_ohne_kindergeld_positiv">;
  vermoegensfreibetrag: Parameter<Altersstufe[]>;
  wohnkosten: Parameter<"tatsaechliche_kosten">;
  rundung: Parameter<"kaufmaennisch_cent">;
}

export interface KizParameter {
  hoechstbetrag: Parameter<Cent>;
  mindesteinkommen: Parameter<{ paarCent: Cent; alleinerziehendCent: Cent }>;
  anrechnungKindeseinkommen: Parameter<number>;
  anrechnungElterneinkommen: Parameter<{ erwerbProzent: number; anderesProzent: number }>;
  /** Stelle 0 = ein Kind. */
  wohnkostenanteilEltern: Parameter<{ paar: number[]; alleinerziehend: number[] }>;
  vermoegensgrenze: Parameter<{ berechtigtCent: Cent; jeWeiterePersonCent: Cent }>;
  erweiterterZugang: Parameter<{ hoechstensFehlbetragCent: Cent; mindestensAbsetzbetraegeErwerbCent: Cent }>;
  rundung: Parameter<"kaufmaennisch_euro_gesamt">;
}

/** Betrag nach Zahl der Haushaltsmitglieder: Stelle 0 = eine Person, ab der letzten Stelle jeWeiterePerson dazu. */
export interface Personentabelle {
  jePersonenzahl: Cent[];
  jeWeiterePerson: Cent;
}

export interface WohngeldParameter {
  /** Zeile = Personenzahl ab 1, Spalte = Mietenstufe I bis VII. */
  hoechstbetraege: Parameter<{ jePersonenzahl: Cent[][]; jeWeiterePerson: Cent[] }>;
  klimakomponente: Parameter<Personentabelle>;
  heizkostenentlastung: Parameter<Personentabelle>;
  /** Dezimalzahlen als Text, Stelle 0 = eine Person. */
  formelwerte: Parameter<{ a: string[]; b: string[]; c: string[] }>;
  mindestwerte: Parameter<{ m: Cent[]; y: Cent[] }>;
  formel: Parameter<{ faktor: string; nachkommastellen: number }>;
  rundung: Parameter<"kaufmaennisch_euro">;
  /** Das Wohngeld höchstens so hoch wie die zu berücksichtigende Miete. */
  obergrenzeMiete: Parameter<"hoechstens_miete">;
  mindestbetrag: Parameter<Cent>;
  abzugJeArt: Parameter<number>;
  werbungskostenPauschbetrag: Parameter<Cent>;
  /** Pauschal besteuerter Minijob: Pauschbetrag abziehen oder keine Werbungskosten. */
  werbungskostenMinijob: Parameter<"pauschbetrag" | "keine">;
  freibetragAlleinerziehend: Parameter<Cent>;
  vermoegensgrenze: Parameter<{ erstesMitgliedCent: Cent; jeWeiteresMitgliedCent: Cent; hoechstensCent: Cent | null }>;
  geringfuegigkeitsgrenze: Parameter<Cent>;
  abzuegeSchaetzung: Parameter<{ steuerAbPromilleVomBrutto: number }>;
}

export interface ButParameter {
  schulbedarf: Parameter<{ erstesHalbjahrCent: Cent; zweitesHalbjahrCent: Cent }>;
  teilhabe: Parameter<Cent>;
  tatsaechlicheKosten: Parameter<string[]>;
  zustaendigWegA: Parameter<"jobcenter">;
  zustaendigWegB: Parameter<"landkreis_oder_kreisfreie_stadt">;
}

/**
 * Hinweise, die ein ganzer Rechtsstand mitbringt. {jahr} ist das Jahr des Stichtags.
 * regelsaetze_offen: „Für {jahr} sind die Regelsätze noch nicht festgelegt. Dafür rechnen wir mit den Werten von 2026.“
 */
export type RechtsstandHinweis = "regelsaetze_offen";

export interface Rechtsstand {
  gueltigAb: string;
  sgb2: Sgb2Parameter;
  kiz: KizParameter;
  wohngeld: WohngeldParameter;
  but: ButParameter;
  mietenstufen: MietenstufenFassung;
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

/** textwerte: für Parameter mit Text-Wert die erlaubten Werte. */
function pruefeTeil<T>(
  datei: string,
  gueltigAb: string,
  roh: Roh<T>,
  textwerte: Partial<Record<keyof T, readonly string[]>>,
): T {
  for (const [name, p] of Object.entries(roh) as [keyof T & string, Roh<T>[keyof T]][]) {
    const ort = `parameter/${gueltigAb}/${datei}: ${name}`;
    if (!STATUS.includes(p.status as Status)) throw new Error(`${ort} hat unbekannten Status "${p.status}".`);
    if (p.fundstelle.trim() === "") throw new Error(`${ort} hat keine Fundstelle.`);
    if (!istDatum(p.gueltigAb) || p.gueltigAb > gueltigAb) throw new Error(`${ort} hat ungültiges gueltigAb.`);
    const erlaubt = textwerte[name];
    if (erlaubt !== undefined && !erlaubt.includes(p.wert as string)) {
      throw new Error(`${ort} hat unbekannten Wert "${String(p.wert)}".`);
    }
  }
  return roh as T;
}

const SGB2_TEXTWERTE = {
  wohnkosten: ["tatsaechliche_kosten"],
  rundung: ["kaufmaennisch_cent"],
  sofortzuschlagOhneAnspruch: ["wenn_luecke_ohne_kindergeld_positiv"],
} as const;
const KIZ_TEXTWERTE = { rundung: ["kaufmaennisch_euro_gesamt"] } as const;
const WOHNGELD_TEXTWERTE = {
  rundung: ["kaufmaennisch_euro"],
  obergrenzeMiete: ["hoechstens_miete"],
  werbungskostenMinijob: ["pauschbetrag", "keine"],
} as const;
const BUT_TEXTWERTE = { zustaendigWegA: ["jobcenter"], zustaendigWegB: ["landkreis_oder_kreisfreie_stadt"] } as const;

function stand(
  gueltigAb: string,
  dateien: {
    sgb2: Roh<Sgb2Parameter>;
    kiz: Roh<KizParameter>;
    wohngeld: Roh<WohngeldParameter>;
    but: Roh<ButParameter>;
  },
  hinweise: RechtsstandHinweis[],
): Rechtsstand {
  return {
    gueltigAb,
    sgb2: pruefeTeil("sgb2.json", gueltigAb, dateien.sgb2, SGB2_TEXTWERTE),
    kiz: pruefeTeil("kiz.json", gueltigAb, dateien.kiz, KIZ_TEXTWERTE),
    wohngeld: pruefeTeil("wohngeld.json", gueltigAb, dateien.wohngeld, WOHNGELD_TEXTWERTE),
    but: pruefeTeil("but.json", gueltigAb, dateien.but, BUT_TEXTWERTE),
    mietenstufen: mietenstufenZum(gueltigAb),
    hinweise,
  };
}

// Die jüngste Fassung der Mietenstufen, die am Tag des Rechtsstands gilt. Jede Fassung wird beim Laden geprüft:
// Status hier, Stufen und doppelte Namen in indexiere.
interface RohFassung {
  gueltigAb: string;
  fundstelle: string;
  status: string;
  gemeinden: Record<string, string>;
  kreise: Record<string, string>;
}

const MIETENSTUFEN_FASSUNGEN = (mietenstufenBayern.fassungen as unknown as RohFassung[]).map((roh) => {
  if (!STATUS.includes(roh.status as Status)) throw new Error(`Mietenstufen ${roh.gueltigAb}: Status "${roh.status}".`);
  if (!istDatum(roh.gueltigAb) || roh.fundstelle.trim() === "") {
    throw new Error(`Mietenstufen ${roh.gueltigAb}: gueltigAb oder Fundstelle fehlt.`);
  }
  const fassung = roh as MietenstufenFassung;
  indexiere(fassung, mietenstufenBayern.gleicheGemeinde);
  return fassung;
});

function mietenstufenZum(gueltigAb: string): MietenstufenFassung {
  const fassung = MIETENSTUFEN_FASSUNGEN.filter((f) => f.gueltigAb <= gueltigAb).at(-1);
  if (fassung === undefined) throw new Error(`Keine Mietenstufen für den Stand ${gueltigAb}.`);
  return fassung;
}

/** Alle Stände, ältester zuerst. */
export const RECHTSSTAENDE: readonly Rechtsstand[] = [
  stand(
    "2026-07-01",
    {
      sgb2: sgb2_2026_07_01 satisfies Roh<Sgb2Parameter>,
      kiz: kiz_2026_07_01 satisfies Roh<KizParameter>,
      wohngeld: wohngeld_2026_07_01 satisfies Roh<WohngeldParameter>,
      but: but_2026_07_01 satisfies Roh<ButParameter>,
    },
    [],
  ),
  // Fortschreibung: Regelsätze und Schulbedarf 2027 sind noch nicht festgelegt (Status pruefen). Status geplant
  // nach Regierungsentwürfen: Wohngeld (BT-Drs. 21/8284), KiZ-Höchstbetrag (BT-Drs. 21/7860), Kindergeld und
  // Arbeitnehmer-Pauschbetrag (BT-Drs. 21/8235).
  stand(
    "2027-01-01",
    {
      sgb2: sgb2_2027_01_01 satisfies Roh<Sgb2Parameter>,
      kiz: kiz_2027_01_01 satisfies Roh<KizParameter>,
      wohngeld: wohngeld_2027_01_01 satisfies Roh<WohngeldParameter>,
      but: but_2027_01_01 satisfies Roh<ButParameter>,
    },
    ["regelsaetze_offen"],
  ),
  // Wie 2027, Kindergeld 272 € ab 1.1.2028 (BT-Drs. 21/8235, Art. 2 und 5, Status geplant).
  stand(
    "2028-01-01",
    {
      sgb2: sgb2_2028_01_01 satisfies Roh<Sgb2Parameter>,
      kiz: kiz_2028_01_01 satisfies Roh<KizParameter>,
      wohngeld: wohngeld_2028_01_01 satisfies Roh<WohngeldParameter>,
      but: but_2028_01_01 satisfies Roh<ButParameter>,
    },
    ["regelsaetze_offen"],
  ),
];

function istDatum(text: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const datum = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(datum.getTime()) && datum.toISOString().slice(0, 10) === text;
}

/** Der Stand, der am Stichtag (JJJJ-MM-TT) gilt: der jüngste mit gueltigAb am oder vor dem Stichtag. */
export function rechtsstandZumStichtag(stichtag: string): Rechtsstand {
  if (!istDatum(stichtag)) throw new RangeError(`Stichtag "${stichtag}" ist kein Datum im Format JJJJ-MM-TT.`);
  const gefunden = RECHTSSTAENDE.filter((s) => s.gueltigAb <= stichtag).at(-1);
  if (gefunden === undefined) {
    throw new RangeError(
      `Kein Rechtsstand für Stichtag ${stichtag}. Frühester Stand: ${RECHTSSTAENDE[0]?.gueltigAb ?? "keiner"}.`,
    );
  }
  return gefunden;
}

export function parameterHinweis(name: string, p: Pick<Parameter<unknown>, "status" | "fundstelle">): ParameterHinweis | undefined {
  if (p.status !== "pruefen" && p.status !== "geplant") return undefined;
  return { name, status: p.status, fundstelle: p.fundstelle };
}

/** Merkt sich, welche Parameter eines Teils eingeflossen sind, damit das Ergebnis ungeprüfte Werte melden kann. */
export function protokoll<T extends { [K in keyof T]: Parameter<unknown> }>(teil: string, parameter: T) {
  const genutzt = new Set<keyof T & string>();
  return {
    nimm<K extends keyof T & string>(name: K): T[K]["wert"] {
      genutzt.add(name);
      return parameter[name].wert;
    },
    /** Für Parameter, die nur unter Bedingungen einfließen, etwa eine Rundung, die etwas ändert. */
    merke(name: keyof T & string): void {
      genutzt.add(name);
    },
    hinweise(): ParameterHinweis[] {
      return [...genutzt].flatMap((name) => parameterHinweis(`${teil}.${name}`, parameter[name]) ?? []);
    },
  };
}

/** Hinweise aus mehreren Teilen, jeder Name nur einmal. */
export function vereinige(...listen: ParameterHinweis[][]): ParameterHinweis[] {
  const gesehen = new Set<string>();
  return listen.flat().filter((h) => !gesehen.has(h.name) && gesehen.add(h.name));
}
