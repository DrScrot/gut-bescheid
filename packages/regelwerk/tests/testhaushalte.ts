// Lädt die Testhaushalte T01–T10 aus tests/haushalte. Sollwerte stehen dort mit Quelle.
import type { Cent, Haushalt, Sgb2Anspruch } from "../src/index";
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

export interface Testhaushalt {
  id: string;
  haushalt: string;
  prueftVorAllem: string;
  erwartung: string;
  stichtag: string;
  /** null, solange die Eingaben erst in einem späteren Meilenstein feststehen. */
  eingabe: Haushalt | null;
  annahmen: string[];
  offen?: string;
  soll: {
    sgb2: {
      /** null, wenn das Fachkonzept keinen Bedarf angibt. */
      bedarf: Cent | null;
      freibetrag: Cent;
      vermoegensfreibetrag?: Cent;
      anspruch?: Sgb2Anspruch;
      quelle: string;
    } | null;
    // KiZ und Wohngeld kommen in M3.
    kiz: null;
    wohngeld: null;
  };
}

// JSON kennt keine Literal-Typen. Die Form prüft der Testlauf über berechneSgb2.
export const testhaushalte = [T01, T02, T03, T04, T05, T06, T07, T08, T09, T10] as unknown as Testhaushalt[];

export function testhaushalt(id: string): Testhaushalt & { eingabe: Haushalt } {
  const gefunden = testhaushalte.find((t) => t.id === id);
  if (!gefunden?.eingabe) throw new Error(`Testhaushalt ${id} fehlt oder hat keine Eingaben.`);
  return gefunden as Testhaushalt & { eingabe: Haushalt };
}
