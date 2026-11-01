// Lädt die Testhaushalte T01–T10 aus tests/haushalte. Sollwerte stehen dort mit Quelle.
import type { Cent, Haushalt, KizAnspruch, Sgb2Anspruch, Vergleichsergebnis } from "../src/index";
import T01 from "./haushalte/T01.json";
import T02 from "./haushalte/T02.json";
import T03 from "./haushalte/T03.json";
import T04 from "./haushalte/T04.json";
import T05 from "./haushalte/T05.json";
import T06 from "./haushalte/T06.json";
import T07 from "./haushalte/T07.json";
import T08 from "./haushalte/T08.json";
import T09 from "./haushalte/T09.json";
import T10 from "./haushalte/T10.json";

/** M4: Folgen zu einem Stichtag. Karten je Weg in der Reihenfolge der Anzeige, nächster Schritt und Unterlagen als ids. */
export interface FolgenSoll {
  stichtag: string;
  einordnung: string;
  wegA: string[];
  wegB: string[];
  beide: string[];
  /** einer: genau ein Schritt. wahl: je ein Schritt für Weg A und Weg B, in dieser Reihenfolge. */
  naechsterSchritt: { art: "einer" | "wahl"; ids: string[] };
  unterlagen: { wegA: string[]; wegB: string[] };
  quelle: string;
}

export interface Testhaushalt {
  id: string;
  haushalt: string;
  prueftVorAllem: string;
  erwartung: string;
  stichtag: string;
  /** null, solange die Eingaben erst in einem späteren Meilenstein feststehen. */
  eingabe: Haushalt | null;
  annahmen: string[];
  /** Abweichungen zu offiziellen Rechnern, mit Rechenweg. Nicht angeglichen. */
  abweichungen?: string[];
  offen?: string;
  soll: {
    sgb2: {
      /** null, wenn das Fachkonzept keinen Bedarf angibt. */
      bedarf: Cent | null;
      freibetrag: Cent;
      vermoegensfreibetrag?: Cent;
      anspruch?: Sgb2Anspruch;
      /** Parameter mit Status pruefen, die bei diesem Haushalt einfließen dürfen. */
      pruefen?: string[];
      quelle: string;
    } | null;
    wohngeld: {
      /** Amtlicher Wert, auf den Euro. Das Regelwerk darf höchstens 1 € abweichen. */
      betrag: Cent;
      /** Häkchen im Wohngeldrechner (§ 16 WoGG). Die Schätzregel muss dieselben finden. */
      abzuegeImRechner: ("steuer" | "kvpv" | "rv")[];
      quelle: string;
    } | null;
    kiz: {
      /** Ergebnis des KiZ-Lotsen (nur ja/nein). null: nicht im Lotsen geprüft. */
      anspruchLotse: boolean | null;
      /** Das Regelwerk weicht vom Lotsen ab, mit Rechenweg in abweichungen (T08, T02). */
      lotseWeichtAb?: boolean;
      anspruch: KizAnspruch;
      /** Vom Regelwerk berechnet, gegengerechnet. null: nicht festgelegt. */
      betrag: Cent | null;
      /** Es fehlen mit KiZ und Wohngeld (Bedarfsprüfung nach § 6a Abs. 1 Nr. 3 BKGG). */
      fehlbetrag?: Cent;
      betragStatus: "berechnet";
      quelle: string;
    } | null;
    vergleich: {
      ergebnis: Vergleichsergebnis;
      /** Lücke A plus Beitrag zur Krankenversicherung minus ausgezahlter KiZ und ausgezahltes Wohngeld. null: nicht festgelegt. */
      fehlbetrag: Cent | null;
      /** Beitrag zur Krankenversicherung auf Weg B (DA-KiZ C.4.1 Abs. 5). */
      krankenversicherung?: Cent;
      quelle: string;
    } | null;
    folgen?: FolgenSoll[];
  };
}

// JSON kennt keine Literal-Typen. Die Form prüft der Testlauf über die Rechnung.
export const testhaushalte = [T01, T02, T03, T04, T05, T06, T07, T08, T09, T10] as unknown as Testhaushalt[];

export function testhaushalt(id: string): Testhaushalt & { eingabe: Haushalt } {
  const gefunden = testhaushalte.find((t) => t.id === id);
  if (!gefunden?.eingabe) throw new Error(`Testhaushalt ${id} fehlt oder hat keine Eingaben.`);
  return gefunden as Testhaushalt & { eingabe: Haushalt };
}

/**
 * Derselbe Haushalt als verheiratetes Paar: wer verdient, ist über die Arbeit versichert, die andere Person über die
 * Familie. So rechnete das Regelwerk T02, T06 und T07 bis zum 31.10.2026 (ohne Beitrag auf Weg B).
 */
export function alsVerheiratet(h: Haushalt): Haushalt {
  return {
    ...h,
    familienstand: "verheiratet",
    erwachsene: h.erwachsene.map((e) => ({ ...e, krankenversicherung: e.brutto > 0 ? "arbeit" : "familie" })),
  };
}
