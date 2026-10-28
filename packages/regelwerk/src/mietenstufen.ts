// Mietenstufe einer Gemeinde in Bayern (§ 12 WoGG, Anlage zu § 1 Abs. 3 WoGV).
// Die Listen in daten/mietstufen-bayern.json sind 1:1 aus der Quelle übernommen. Die Fassungen schreiben
// dieselbe Gemeinde verschieden („bei“ oder „b.“, „Stadt“ oder „Große Kreisstadt“). Gesucht wird darum
// über einen Schlüssel, in dem diese Unterschiede verschwinden.
import type { Gemeinde } from "./haushalt";
import type { Status } from "./parameter";

export type Mietenstufe = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";

export const MIETENSTUFEN: readonly Mietenstufe[] = ["I", "II", "III", "IV", "V", "VI", "VII"];

export interface MietenstufenFassung {
  gueltigAb: string;
  fundstelle: string;
  status: Status;
  gemeinden: Record<string, Mietenstufe>;
  kreise: Record<string, Mietenstufe>;
}

// Gemeindeart am Ende des Namens. Ein Zusatz wie ", Landkreis Freising" bleibt, er unterscheidet Gemeinden.
const ART = /, (Stadt|Markt|Große Kreisstadt|Landeshauptstadt)$/;

// Schreibweisen, die zwischen den Fassungen wechseln. Reihenfolge zählt: "an der" vor "an".
const SCHREIBWEISEN: [RegExp, string][] = [
  [/\bbei\b/g, "b."],
  [/\ban der\b/g, "a. d."],
  [/\bin der\b/g, "i. d."],
  [/\bam\b/g, "a."],
  [/\ban\b/g, "a."],
  [/\bim\b/g, "i."],
  [/\bOberpfalz\b/g, "OPf."],
  [/\bi\. Bayern\b/g, "i. Bay."],
  [/^Neustadt\/Aisch\b/, "Neustadt a. d. Aisch"],
  [/ i\. Ufr\./g, ""],
];

/** Vergleichsschlüssel für Gemeinde- und Kreisnamen. */
export function schluessel(name: string): string {
  let s = name.trim().replace(ART, "");
  for (const [muster, ersatz] of SCHREIBWEISEN) s = s.replace(muster, ersatz);
  return s.replace(/\s+/g, " ").toLowerCase();
}

interface Mietenstufenindex {
  gemeinden: Map<string, Mietenstufe>;
  kreise: Map<string, Mietenstufe>;
}

const INDIZES = new WeakMap<MietenstufenFassung, Mietenstufenindex>();

/**
 * Baut den Suchindex und prüft die Liste: gültige Stufen, keine zwei Namen mit demselben Schlüssel.
 * gleicheGemeinde: Namenspaare, die der Schlüssel nicht zusammenbringt, z. B. "Eching" und
 * "Eching, Landkreis Freising". Wirft bei Fehlern in der Liste.
 */
export function indexiere(fassung: MietenstufenFassung, gleicheGemeinde: readonly string[][]): void {
  const ort = `daten/mietstufen-bayern.json, Fassung ${fassung.gueltigAb}`;
  const baue = (eintraege: Record<string, string>, art: string) => {
    const index = new Map<string, Mietenstufe>();
    for (const [name, stufe] of Object.entries(eintraege)) {
      if (!MIETENSTUFEN.includes(stufe as Mietenstufe)) throw new Error(`${ort}: ${art} "${name}" hat Stufe "${stufe}".`);
      const k = schluessel(name);
      if (index.has(k)) throw new Error(`${ort}: ${art} "${name}" doppelt (Schlüssel "${k}").`);
      index.set(k, stufe as Mietenstufe);
    }
    return index;
  };
  const gemeinden = baue(fassung.gemeinden, "Gemeinde");
  const kreise = baue(fassung.kreise, "Kreis");
  for (const namen of gleicheGemeinde) {
    const schluesselListe = namen.map(schluessel);
    const stufe = schluesselListe.map((k) => gemeinden.get(k)).find((s) => s !== undefined);
    if (stufe === undefined) continue;
    for (const k of schluesselListe) if (!gemeinden.has(k)) gemeinden.set(k, stufe);
  }
  INDIZES.set(fassung, { gemeinden, kreise });
}

/**
 * Mietenstufe der Gemeinde, sonst die ihres Kreises. Unbekannt: Fehler.
 * Grenze von Version 0: Die Liste nennt zu Gemeinden keinen Kreis. Gleichnamige kleinere Gemeinden in anderen
 * Kreisen (z. B. Eching am Ammersee, Kreis Landsberg) bekämen die Stufe der Gemeinde aus der Liste. In M5 über den
 * amtlichen Gemeindeschlüssel lösen.
 */
export function mietenstufe(gemeinde: Gemeinde, fassung: MietenstufenFassung): Mietenstufe {
  if (!INDIZES.has(fassung)) indexiere(fassung, []);
  const index = INDIZES.get(fassung) as Mietenstufenindex;
  const stufe =
    index.gemeinden.get(schluessel(gemeinde.name)) ??
    (gemeinde.kreis === null ? undefined : index.kreise.get(schluessel(gemeinde.kreis)));
  if (stufe === undefined) {
    throw new RangeError(
      `Keine Mietenstufe für "${gemeinde.name}"${gemeinde.kreis === null ? "" : ` (Kreis ${gemeinde.kreis})`} ` +
        `in der Liste Bayern, Fassung ab ${fassung.gueltigAb}.`,
    );
  }
  return stufe;
}
