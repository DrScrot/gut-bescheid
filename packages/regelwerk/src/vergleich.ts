// Vergleich der Wege (Fachkonzept, Entscheidungslogik Schritt 4).
// Weg A: Grundsicherung (SGB II). Weg B: Kinderzuschlag und Wohngeld, ohne Grundsicherung.
import type { Cent } from "./geld";
import type { Haushalt } from "./haushalt";
import { berechneBut } from "./but";
import { berechneKiz, type KizErgebnis } from "./kiz";
import { vereinige, type ParameterHinweis } from "./parameter";
import { berechneSgb2, type AusserhalbGrund, type Sgb2Anspruch, type Sgb2Ergebnis } from "./sgb2";
import { berechneWohngeld, type WohngeldErgebnis } from "./wohngeld";

/**
 * weg_b_deckt: Einkommen, Kindergeld, KiZ und Wohngeld decken den Bedarf. Oder Weg A ist wegen Erspartem über dem
 * Freibetrag ausgeschlossen, dann kommt der Rest aus dem Ersparten.
 * erweiterter_zugang: Mit Einkommen, Erspartem über dem Freibetrag, KiZ und Wohngeld fehlen höchstens 100 €
 * (wegB.fehlbetrag rechnet ohne Erspartes). Echte Wahl, Weg B bringt etwas weniger Geld.
 * nur_weg_a: Mit Weg B fehlt mehr. Nur die Grundsicherung deckt den Bedarf.
 * kein_anspruch: Einkommen oder Erspartes decken den Bedarf, und auf keinem Weg gibt es Geld.
 */
export type Vergleichsergebnis = "weg_b_deckt" | "erweiterter_zugang" | "nur_weg_a" | "kein_anspruch";

type ImUmfang<T> = Extract<T, { imUmfang: true }>;

export type Ergebnis =
  | { imUmfang: false; stichtag: string; rechtsstand: string; gruende: AusserhalbGrund[] }
  | {
      imUmfang: true;
      stichtag: string;
      rechtsstand: string;
      ergebnis: Vergleichsergebnis;
      /**
       * betrag: Lücke A, wenn ein Anspruch besteht oder nur das Vermögen ihn offenlässt, plus Sofortzuschlag
       * (§ 72 SGB II). Ohne Anspruch nur der Sofortzuschlag, wenn allein das Kindergeld den Anspruch verhindert.
       * nachEinsatzDesErsparten: Erspartes über dem Freibetrag schließt den Anspruch erst einmal aus, deckt aber
       * nicht, was mit Weg B fehlt. betrag gilt dann, sobald das Ersparte eingesetzt ist.
       */
      wegA: { anspruch: Sgb2Anspruch; betrag: Cent; sofortzuschlag: Cent; nachEinsatzDesErsparten: boolean };
      /**
       * Ausgezahlter KiZ und ausgezahltes Wohngeld. fehlbetrag: Lücke A minus wirksamer KiZ und Wohngeld,
       * 0 oder kleiner: gedeckt. restAusErspartem: Es fehlt noch Geld, Weg A ist aber wegen Erspartem über dem
       * Freibetrag ausgeschlossen; der Rest kommt aus dem Ersparten.
       */
      wegB: { kinderzuschlag: Cent; wohngeld: Cent; summe: Cent; fehlbetrag: Cent; restAusErspartem: boolean };
      /** Kein Betrag, weil die Leistungen auf beiden Wegen gleich sind. */
      but: {
        wegA: { zustaendig: string; moeglich: boolean };
        wegB: { zustaendig: string; moeglich: boolean };
      };
      sgb2: ImUmfang<Sgb2Ergebnis>;
      kiz: ImUmfang<KizErgebnis>;
      wohngeld: ImUmfang<WohngeldErgebnis>;
      /** Alle eingeflossenen Werte mit Status "pruefen" oder "geplant", jeder einmal. */
      parameterHinweise: ParameterHinweis[];
    };

export function berechne(haushalt: Haushalt, optionen: { stichtag: string }): Ergebnis {
  const { stichtag } = optionen;
  const sgb2 = berechneSgb2(haushalt, { stichtag });
  if (!sgb2.imUmfang) return sgb2;
  const wohngeld = berechneWohngeld(haushalt, { stichtag });
  // Der KiZ prüft den Bedarf mit dem Wohngeld, das ausgezahlt würde (§ 6a Abs. 1 Nr. 3 Satz 3 BKGG).
  const kiz = berechneKiz(haushalt, { stichtag, wohngeld: wohngeld.imUmfang ? wohngeld.auszahlung : 0 });
  if (!wohngeld.imUmfang || !kiz.imUmfang) throw new Error("Umfang von SGB II, KiZ und Wohngeld widerspricht sich.");
  const but = berechneBut(haushalt, { stichtag });

  const summe = kiz.auszahlung + wohngeld.auszahlung;
  // Für den Bedarf zählt vom KiZ nur, was nach SGB II beim Haushalt ankommt (siehe kiz.ts).
  const kizWirksam = kiz.auszahlung > 0 ? kiz.bedarfspruefung.kinderzuschlagWirksam : 0;
  const fehlbetrag = sgb2.lueckeA - kizWirksam - wohngeld.auszahlung;
  // Erspartes über dem SGB-II-Freibetrag schließt Hilfebedürftigkeit aus, soweit es den Fehlbetrag deckt
  // (§ 9 Abs. 1 SGB II, wie in kiz.ts). Dann gibt es Weg A nicht, auch wenn mit Weg B noch Geld fehlt. Deckt es
  // ihn nicht, bleibt Weg A; das SGB-II-Ergebnis meldet, dass Erspartes zuerst eingesetzt wird.
  const wegAWegenVermoegenAusgeschlossen =
    sgb2.anspruch === "nein_vermoegen" && sgb2.vermoegen.ueberFreibetrag.von >= fehlbetrag;
  const nachEinsatzDesErsparten = sgb2.anspruch === "nein_vermoegen" && !wegAWegenVermoegenAusgeschlossen;
  const wegAHatAnspruch = sgb2.anspruch === "ja" || sgb2.anspruch === "unklar_vermoegen";
  // Den Sofortzuschlag gibt es auch ohne Grundsicherung, wenn nur das Kindergeld den Anspruch verhindert (sgb2.ts).
  // Auf Weg B kommt er nicht dazu: 2026 steckt er im KiZ (§ 6a Abs. 2 Satz 4 BKGG). Ob KiZ-Haushalte ihn 2027 nach
  // dem Entwurf (Sofortzuschlag im KiZ gestrichen) nach § 72 SGB II bekommen, ist offen (docs/offene-rechtsfragen.md).
  const sofortzuschlag = wegAWegenVermoegenAusgeschlossen ? 0 : sgb2.sofortzuschlag.betrag;
  const wegA = {
    anspruch: sgb2.anspruch,
    betrag: (wegAHatAnspruch || nachEinsatzDesErsparten ? sgb2.lueckeA : 0) + sofortzuschlag,
    sofortzuschlag,
    nachEinsatzDesErsparten,
  };
  const wegB = {
    kinderzuschlag: kiz.auszahlung,
    wohngeld: wohngeld.auszahlung,
    summe,
    fehlbetrag,
    restAusErspartem: fehlbetrag > 0 && wegAWegenVermoegenAusgeschlossen,
  };

  let ergebnis: Vergleichsergebnis;
  if (wegB.fehlbetrag <= 0 || wegAWegenVermoegenAusgeschlossen) {
    ergebnis = summe === 0 && (sgb2.lueckeA <= 0 || wegAWegenVermoegenAusgeschlossen) ? "kein_anspruch" : "weg_b_deckt";
  } else if (kiz.anspruch === "erweiterter_zugang") ergebnis = "erweiterter_zugang";
  else ergebnis = "nur_weg_a";

  return {
    imUmfang: true,
    stichtag,
    rechtsstand: sgb2.rechtsstand,
    ergebnis,
    wegA,
    wegB,
    // Weg B nur mit KiZ oder Wohngeld (§ 6b Abs. 1 Satz 1 BKGG).
    but: {
      wegA: { zustaendig: but.zustaendig.wegA, moeglich: wegAHatAnspruch || nachEinsatzDesErsparten },
      wegB: { zustaendig: but.zustaendig.wegB, moeglich: summe > 0 },
    },
    sgb2,
    kiz,
    wohngeld,
    parameterHinweise: vereinige(sgb2.parameterHinweise, kiz.parameterHinweise, wohngeld.parameterHinweise, but.parameterHinweise),
  };
}
