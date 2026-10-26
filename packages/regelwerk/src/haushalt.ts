// Eingaben des Regelwerks: das Haushaltsmodell aus dem Fachkonzept. Alle Beträge in ganzen Cent im Monat.
import type { Cent } from "./geld";

export interface Erwachsener {
  /** Alter in vollen Jahren. */
  alter: number;
  /** Erwerbseinkommen brutto. */
  brutto: Cent;
  /** Erwerbseinkommen netto. */
  netto: Cent;
  /** Weiteres Einkommen, z. B. Arbeitslosengeld, Krankengeld, Elterngeld. */
  sonstigesEinkommen: Cent;
}

export interface Kind {
  alter: { jahre: number; monate: number };
  /** Eigenes Einkommen ohne Kindergeld: Unterhalt, Unterhaltsvorschuss, Ausbildung. */
  einkommen: Cent;
}

/** Betrag als Spanne, beide Grenzen eingeschlossen. Ein genauer Betrag hat von = bis. bis = null: nach oben offen. */
export interface Spanne {
  von: Cent;
  bis: Cent | null;
}

export interface Haushalt {
  gemeinde: string;
  /** Ein oder zwei Erwachsene. */
  erwachsene: Erwachsener[];
  kinder: Kind[];
  kaltmiete: Cent;
  /** Nebenkosten ohne Heizung. */
  nebenkosten: Cent;
  heizkosten: Cent;
  /** Erspartes des ganzen Haushalts. */
  vermoegen: Spanne;
}
