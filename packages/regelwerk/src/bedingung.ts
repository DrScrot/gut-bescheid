// Bedingungen als Daten (Folgen-Katalog): wann ein Eintrag erscheint. Ausgewertet gegen benannte Fakten.
// Form: { alle: [...] }, { eines: [...] }, { nicht: ... } oder ein Vergleich { fakt, ist | in | ab | unter }.
// ab heißt „größer oder gleich“, unter heißt „kleiner als“, beides für Zahlen und Daten (JJJJ-MM-TT).
import { istDatum } from "./parameter";

export type Wert = string | number | boolean;

/** Welche Werte ein Fakt haben kann. Text-Fakten nennen ihre erlaubten Werte, damit Tippfehler beim Laden auffallen. */
export type FaktArt =
  | { art: "zahl" }
  | { art: "ja_nein" }
  | { art: "datum" }
  | { art: "text"; werte: readonly string[] };

export type Bedingung =
  | { alle: Bedingung[] }
  | { eines: Bedingung[] }
  | { nicht: Bedingung }
  | { fakt: string; ist: Wert }
  | { fakt: string; in: Wert[] }
  | { fakt: string; ab: number | string }
  | { fakt: string; unter: number | string };

const VERGLEICHE: readonly string[] = ["ist", "in", "ab", "unter"];

/** Prüft eine Bedingung aus JSON gegen die bekannten Fakten. Wirft mit Ort und Grund. */
export function pruefeBedingung(roh: unknown, arten: Readonly<Record<string, FaktArt>>, ort: string): Bedingung {
  if (typeof roh !== "object" || roh === null || Array.isArray(roh)) {
    throw new Error(`${ort}: Bedingung ${JSON.stringify(roh)} ist kein Objekt.`);
  }
  const r = roh as Record<string, unknown>;
  if ("fakt" in r) return pruefeVergleich(r, arten, ort);
  const schluessel = Object.keys(r);
  const [verknuepfung] = schluessel;
  if (schluessel.length !== 1 || verknuepfung === undefined) {
    throw new Error(`${ort}: Bedingung braucht genau eine Verknüpfung, nicht ${JSON.stringify(schluessel)}.`);
  }
  if (verknuepfung === "alle" || verknuepfung === "eines") {
    const liste = r[verknuepfung];
    if (!Array.isArray(liste)) throw new Error(`${ort}: „${verknuepfung}“ braucht eine Liste.`);
    const teile = liste.map((b) => pruefeBedingung(b, arten, ort));
    return verknuepfung === "alle" ? { alle: teile } : { eines: teile };
  }
  if (verknuepfung === "nicht") return { nicht: pruefeBedingung(r.nicht, arten, ort) };
  throw new Error(`${ort}: unbekannte Verknüpfung „${verknuepfung}“.`);
}

function pruefeVergleich(r: Record<string, unknown>, arten: Readonly<Record<string, FaktArt>>, ort: string): Bedingung {
  const { fakt } = r;
  if (typeof fakt !== "string") throw new Error(`${ort}: „fakt“ muss ein Name sein, nicht ${JSON.stringify(fakt)}.`);
  const art = arten[fakt];
  if (art === undefined) throw new Error(`${ort}: unbekannter Fakt „${fakt}“.`);
  const vergleiche = Object.keys(r).filter((k) => k !== "fakt");
  const [vergleich] = vergleiche;
  if (vergleiche.length !== 1 || vergleich === undefined || !VERGLEICHE.includes(vergleich)) {
    throw new Error(`${ort}: Fakt „${fakt}“ braucht genau einen Vergleich (ist, in, ab oder unter).`);
  }
  const wert = r[vergleich];
  if (vergleich === "in") {
    if (!Array.isArray(wert) || wert.length === 0) throw new Error(`${ort}: „in“ bei „${fakt}“ braucht eine Liste.`);
    for (const w of wert) pruefeWert(w, art, fakt, ort);
    return { fakt, in: wert as Wert[] };
  }
  if (vergleich === "ist") {
    pruefeWert(wert, art, fakt, ort);
    return { fakt, ist: wert as Wert };
  }
  if (art.art !== "zahl" && art.art !== "datum") {
    throw new Error(`${ort}: „${vergleich}“ geht nur bei Zahlen und Daten, nicht bei „${fakt}“.`);
  }
  pruefeWert(wert, art, fakt, ort);
  return vergleich === "ab" ? { fakt, ab: wert as number | string } : { fakt, unter: wert as number | string };
}

function pruefeWert(wert: unknown, art: FaktArt, fakt: string, ort: string): void {
  const passt =
    art.art === "zahl"
      ? typeof wert === "number" && Number.isFinite(wert)
      : art.art === "ja_nein"
        ? typeof wert === "boolean"
        : art.art === "datum"
          ? typeof wert === "string" && istDatum(wert)
          : typeof wert === "string" && art.werte.includes(wert);
  if (!passt) throw new Error(`${ort}: Wert ${JSON.stringify(wert)} passt nicht zum Fakt „${fakt}“ (${art.art}).`);
}

/** Wertet eine geprüfte Bedingung aus. Fehlt ein Fakt, ist das ein Fehler im Programm, kein „nein“. */
export function erfuellt(bedingung: Bedingung, fakten: Readonly<Record<string, Wert>>): boolean {
  if ("alle" in bedingung) return bedingung.alle.every((b) => erfuellt(b, fakten));
  if ("eines" in bedingung) return bedingung.eines.some((b) => erfuellt(b, fakten));
  if ("nicht" in bedingung) return !erfuellt(bedingung.nicht, fakten);
  const wert = fakten[bedingung.fakt];
  if (wert === undefined) throw new Error(`Fakt „${bedingung.fakt}“ fehlt.`);
  if ("ist" in bedingung) return wert === bedingung.ist;
  if ("in" in bedingung) return bedingung.in.includes(wert);
  if ("ab" in bedingung) return vergleiche(wert, bedingung.ab, bedingung.fakt) >= 0;
  return vergleiche(wert, bedingung.unter, bedingung.fakt) < 0;
}

// Daten im Format JJJJ-MM-TT lassen sich als Text vergleichen.
function vergleiche(wert: Wert, grenze: number | string, fakt: string): number {
  if (typeof wert === "number" && typeof grenze === "number") return wert - grenze;
  if (typeof wert === "string" && typeof grenze === "string") return wert < grenze ? -1 : wert > grenze ? 1 : 0;
  throw new Error(`Fakt „${fakt}“: ${JSON.stringify(wert)} lässt sich nicht mit ${JSON.stringify(grenze)} vergleichen.`);
}
