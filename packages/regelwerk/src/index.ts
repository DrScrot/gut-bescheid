// Einstieg des Regelwerks. Rein rechnend: keine Oberfläche, kein Netzwerk.
export { anteil, pruefeBetrag, type Cent } from "./geld";
export type { Erwachsener, Haushalt, Kind, Spanne } from "./haushalt";
export {
  RECHTSSTAENDE,
  rechtsstandZumStichtag,
  type Parameter,
  type ParameterHinweis,
  type Rechtsstand,
  type Status,
} from "./parameter";
export {
  berechneSgb2,
  type AusserhalbGrund,
  type Sgb2Anspruch,
  type Sgb2Ergebnis,
  type Sgb2Hinweis,
} from "./sgb2";
