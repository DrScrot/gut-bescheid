// Bildung und Teilhabe (§ 28 SGB II, § 6b BKGG). Die Leistungen sind auf beiden Wegen gleich, deshalb
// erscheint kein Betrag im Vergleich. Unterschiedlich ist nur, wo man sie beantragt.
import type { Cent } from "./geld";
import type { Haushalt } from "./haushalt";
import { protokoll, rechtsstandZumStichtag, type ButParameter, type ParameterHinweis } from "./parameter";

export interface ButErgebnis {
  stichtag: string;
  rechtsstand: string;
  leistungen: {
    /** Je Schulkind und Halbjahr. */
    schulbedarf: { erstesHalbjahr: Cent; zweitesHalbjahr: Cent };
    /** Je Kind unter 18, wenn Kosten für Verein, Musik oder Freizeiten entstehen. */
    teilhabeMonatlich: Cent;
    /** Leistungen in Höhe der tatsächlichen Kosten. */
    tatsaechlicheKosten: string[];
  };
  zustaendig: { wegA: ButParameter["zustaendigWegA"]["wert"]; wegB: ButParameter["zustaendigWegB"]["wert"] };
  kinderUnter18: number;
  parameterHinweise: ParameterHinweis[];
}

export function berechneBut(haushalt: Haushalt, optionen: { stichtag: string }): ButErgebnis {
  const stand = rechtsstandZumStichtag(optionen.stichtag);
  const p = protokoll("but", stand.but);
  const schulbedarf = p.nimm("schulbedarf");
  return {
    stichtag: optionen.stichtag,
    rechtsstand: stand.gueltigAb,
    leistungen: {
      schulbedarf: { erstesHalbjahr: schulbedarf.erstesHalbjahrCent, zweitesHalbjahr: schulbedarf.zweitesHalbjahrCent },
      teilhabeMonatlich: p.nimm("teilhabe"),
      tatsaechlicheKosten: p.nimm("tatsaechlicheKosten"),
    },
    zustaendig: { wegA: p.nimm("zustaendigWegA"), wegB: p.nimm("zustaendigWegB") },
    kinderUnter18: haushalt.kinder.filter((k) => k.alter.jahre < 18).length,
    parameterHinweise: p.hinweise(),
  };
}
