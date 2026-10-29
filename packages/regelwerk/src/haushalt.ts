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
  /** Eigenes Einkommen ohne Kindergeld: Unterhalt, Unterhaltsvorschuss. */
  einkommen: Cent;
  /** Ausbildungsvergütung des Kindes. Größer 0: außerhalb des Umfangs von Version 0. */
  ausbildungsverguetung: Cent;
  /**
   * Ist das Kind tagsüber betreut (Kita, Tagespflege, Schule, Hort)? Fehlt: unbekannt.
   * Nur für die Folgen-Karten (Zumutbarkeit, § 10 Abs. 1 Nr. 3 SGB II), die Rechnung nutzt es nicht.
   */
  betreuung?: boolean;
}

/** Betrag als Spanne, beide Grenzen eingeschlossen. Ein genauer Betrag hat von = bis. bis = null: nach oben offen. */
export interface Spanne {
  von: Cent;
  bis: Cent | null;
}

/**
 * Wohnort in Bayern, für die Mietenstufe beim Wohngeld. Namen wie in der Anlage zu § 1 Abs. 3 WoGV.
 * Steht die Gemeinde nicht einzeln in der Liste, gilt die Mietenstufe des Kreises.
 */
export interface Gemeinde {
  /** z. B. "Pocking, Stadt" oder "Nürnberg, Stadt". */
  name: string;
  /** Landkreis, z. B. "Passau". null bei kreisfreien Städten. */
  kreis: string | null;
}

export interface Haushalt {
  gemeinde: Gemeinde;
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
