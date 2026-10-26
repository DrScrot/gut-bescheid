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
  const zaehler = betrag * prozent;
  const rest = zaehler % 100;
  const ganz = (zaehler - rest) / 100;
  return { cent: 2 * rest >= 100 ? ganz + 1 : ganz, gerundet: rest !== 0 };
}
