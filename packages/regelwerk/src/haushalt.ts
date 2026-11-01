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
  /** Wie die Person ohne Grundsicherung krankenversichert ist (Weg B). Fehlt: unbekannt. */
  krankenversicherung?: Krankenversicherung;
  /** Nur bei krankenversicherung "privat": Monatsbeitrag zur privaten Kranken- und Pflegeversicherung. Fehlt: unbekannt. */
  privatBeitrag?: Cent;
}

/**
 * Krankenversicherung ohne Grundsicherung, für den Beitrag auf Weg B (DA-KiZ C.4.1 Abs. 5, src/krankenversicherung.ts).
 * arbeit: pflichtversichert über einen Job über der Minijob-Grenze. leistung: über Arbeitslosengeld oder Krankengeld.
 * familie: familienversichert, kein eigener Beitrag. selbst: muss sich selbst gesetzlich versichern (Mindestbeitrag).
 * privat: privat versichert, Beitrag in privatBeitrag. weiss_nicht: wird aus den übrigen Angaben abgeleitet.
 */
export type Krankenversicherung = "arbeit" | "leistung" | "familie" | "selbst" | "privat" | "weiss_nicht";

/** Familienstand eines Paares. Die Ehe und die eingetragene Lebenspartnerschaft öffnen die Familienversicherung (§ 10 SGB V). */
export type Familienstand = "verheiratet" | "lebenspartnerschaft" | "nicht_verheiratet";

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
  /** Nur bei zwei Erwachsenen. Fehlt: unbekannt. */
  familienstand?: Familienstand;
  kinder: Kind[];
  kaltmiete: Cent;
  /** Nebenkosten ohne Heizung. */
  nebenkosten: Cent;
  heizkosten: Cent;
  /** Erspartes des ganzen Haushalts. */
  vermoegen: Spanne;
}
