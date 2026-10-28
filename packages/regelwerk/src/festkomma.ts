// Festkommazahlen für die Wohngeldformel: zehn Nachkommastellen (Anlage 3 Nr. 2 WoGG), als BigInt.
// Eine Festkommazahl ist der Wert in Euro mal 10^10. Gerundet wird bei jedem Produkt und jeder Division
// auf zehn Stellen, ab 5 auf (vom Betrag her, das Vorzeichen bleibt). Freigegeben von Nico am 28.10.2026.
import type { Cent } from "./geld";

export type Festkomma = bigint;

export const NACHKOMMASTELLEN = 10;
const SKALA = 10n ** BigInt(NACHKOMMASTELLEN);
const CENT_IN_SKALA = SKALA / 100n;

/** Liest "1.15", "0" oder die Schreibweise der Anlage 2 ("4.797E-4", "-1.200E-1"). */
export function ausText(text: string): Festkomma {
  const teile = /^(-?)(\d+)(?:\.(\d+))?(?:E(-?\d+))?$/.exec(text);
  if (teile === null) throw new RangeError(`"${text}" ist keine Dezimalzahl.`);
  const [, minus = "", ganz = "", bruch = "", hoch = "0"] = teile;
  // Wert = ziffern · 10^(−stellen)
  const stellen = bruch.length - Number(hoch);
  let wert = BigInt(ganz + bruch);
  if (stellen <= NACHKOMMASTELLEN) {
    wert *= 10n ** BigInt(NACHKOMMASTELLEN - stellen);
  } else {
    const teiler = 10n ** BigInt(stellen - NACHKOMMASTELLEN);
    if (wert % teiler !== 0n) throw new RangeError(`"${text}" hat mehr als ${NACHKOMMASTELLEN} Nachkommastellen.`);
    wert /= teiler;
  }
  return minus === "-" ? -wert : wert;
}

export function ausCent(cent: Cent): Festkomma {
  return BigInt(cent) * CENT_IN_SKALA;
}

/** a · b, auf zehn Stellen gerundet. */
export function mal(a: Festkomma, b: Festkomma): Festkomma {
  return gerundetGeteilt(a * b, SKALA);
}

/** a ÷ n, auf zehn Stellen gerundet. */
export function geteiltDurch(a: Festkomma, n: number): Festkomma {
  if (!Number.isSafeInteger(n) || n < 1) throw new RangeError(`Teiler muss eine ganze Zahl ab 1 sein, nicht ${n}.`);
  return gerundetGeteilt(a, BigInt(n));
}

/** Kaufmännisch auf volle Euro, Ergebnis in Cent. */
export function aufEuro(a: Festkomma): Cent {
  return Number(gerundetGeteilt(a, SKALA)) * 100;
}

export function zuText(a: Festkomma): string {
  const betrag = a < 0n ? -a : a;
  const ganz = betrag / SKALA;
  const bruch = (betrag % SKALA).toString().padStart(NACHKOMMASTELLEN, "0");
  return `${a < 0n ? "-" : ""}${ganz}.${bruch}`;
}

function gerundetGeteilt(zaehler: bigint, nenner: bigint): bigint {
  const negativ = zaehler < 0n;
  const betrag = negativ ? -zaehler : zaehler;
  const ganz = betrag / nenner;
  const ergebnis = 2n * (betrag % nenner) >= nenner ? ganz + 1n : ganz;
  return negativ ? -ergebnis : ergebnis;
}
