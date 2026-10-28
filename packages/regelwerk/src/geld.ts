// Geld rechnet das Regelwerk nur in ganzen Cent, nie mit Kommazahlen.

/** Geldbetrag in ganzen Cent. Kann negativ sein (z. B. Lücke A). */
export type Cent = number;

/** Prüft eine Eingabe: ganze Cent, nicht negativ. Wirft mit Feldnamen. */
export function pruefeBetrag(wert: unknown, feld: string): Cent {
  if (typeof wert !== "number" || !Number.isSafeInteger(wert) || wert < 0) {
    throw new RangeError(`${feld} muss ein ganzer Cent-Betrag ab 0 sein, nicht ${String(wert)}.`);
  }
  return wert;
}

/**
 * `prozent` Prozent von `betrag`, auf ganze Cent gerundet.
 * Ab einem halben Cent wird aufgerundet (§ 41 Abs. 2 SGB II).
 * `gerundet` sagt, ob dabei ein Bruchteil von Cent weggefallen ist.
 */
export function anteil(betrag: Cent, prozent: number): { cent: Cent; gerundet: boolean } {
  pruefeBetrag(betrag, "betrag");
  if (!Number.isSafeInteger(prozent) || prozent < 0) {
    throw new RangeError(`prozent muss eine ganze Zahl ab 0 sein, nicht ${prozent}.`);
  }
  return bruchteil(betrag * prozent, 100);
}

/** `betrag` geteilt durch `durch`, gerundet wie bei `anteil`. Etwa für den Kopfteil der Wohnkosten. */
export function geteilt(betrag: Cent, durch: number): { cent: Cent; gerundet: boolean } {
  pruefeBetrag(betrag, "betrag");
  if (!Number.isSafeInteger(durch) || durch < 1) {
    throw new RangeError(`durch muss eine ganze Zahl ab 1 sein, nicht ${durch}.`);
  }
  return bruchteil(betrag, durch);
}

/**
 * Auf volle Euro gerundet, unter 50 Cent nach unten, sonst nach oben (§ 11 Abs. 2 BKGG). Ergebnis in Cent.
 * Nur für Beträge ab 0.
 */
export function aufEuro(betrag: Cent): Cent {
  pruefeBetrag(betrag, "betrag");
  return bruchteil(betrag, 100).cent * 100;
}

function bruchteil(zaehler: number, nenner: number): { cent: Cent; gerundet: boolean } {
  const rest = zaehler % nenner;
  const ganz = (zaehler - rest) / nenner;
  return { cent: 2 * rest >= nenner ? ganz + 1 : ganz, gerundet: rest !== 0 };
}
