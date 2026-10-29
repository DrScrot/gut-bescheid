// Einstieg des Regelwerks. Rein rechnend: keine Oberfläche, kein Netzwerk.
export { anteil, aufEuro, geteilt, pruefeBetrag, type Cent } from "./geld";
export type { Erwachsener, Gemeinde, Haushalt, Kind, Spanne } from "./haushalt";
export { mietenstufe, type Mietenstufe, type MietenstufenFassung } from "./mietenstufen";
export {
  RECHTSSTAENDE,
  rechtsstandZumStichtag,
  type Parameter,
  type ParameterHinweis,
  type Rechtsstand,
  type RechtsstandHinweis,
  type Status,
} from "./parameter";
export {
  berechneSgb2,
  type AusserhalbGrund,
  type Sgb2Anspruch,
  type Sgb2Ergebnis,
  type Sgb2Hinweis,
} from "./sgb2";
export {
  berechneWohngeld,
  schaetzeAbzuege,
  type Abzuege,
  type WohngeldAnspruch,
  type WohngeldErgebnis,
  type WohngeldHinweis,
} from "./wohngeld";
export { berechneKiz, type KizAnspruch, type KizErgebnis, type KizHinweis } from "./kiz";
export { berechneBut, type ButErgebnis } from "./but";
export { berechne, type Ergebnis, type Vergleichsergebnis } from "./vergleich";
export { erfuellt, pruefeBedingung, type Bedingung, type FaktArt, type Wert } from "./bedingung";
export { mindestbeitragFreiwillig, type Mindestbeitrag } from "./krankenversicherung";
export {
  FAKTEN,
  FOLGEN,
  PLATZHALTER,
  ermittleFakten,
  folgen,
  ladeFolgen,
  type Art,
  type BerechnetesErgebnis,
  type Dauer,
  type FaktName,
  type Fakten,
  type Folgen,
  type FolgenDaten,
  type FolgenKarte,
  type FolgenSchritt,
  type FolgenText,
  type FolgenUnterlage,
  type Leistung,
  type NaechsterSchritt,
  type StatusHinweis,
  type Weg,
} from "./folgen";
