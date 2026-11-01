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

// Texte für die Oberfläche (M5, i18n) stehen am Code; Entwurf, vor M5 mit texte-schreiben und text-lektor.
export type VergleichHinweis =
  /**
   * Lücke A ist 0 oder kleiner, erst der Beitrag zur Krankenversicherung lässt Geld fehlen (Randfall, Nico 31.10.2026).
   * Fassung des rechts-pruefer (31.10.2026): „Wir haben den Beitrag zur Krankenversicherung mitgerechnet. Dann fehlen
   * Haushalten mit euren Angaben nach den Regeln etwa {wegB.fehlbetrag} im Monat. Für solche Fälle kann das Jobcenter
   * einen Zuschuss zahlen, auch neben Wohngeld. Gut Bescheid rechnet ihn noch nicht. Verbindlich ist nur der Bescheid.“
   * (§ 26 Abs. 2 und 4 SGB II; FW § 26 Rz. 26.42 Abs. 2, Stand 01.07.2026). sperrtErweitertenZugang: Der Beitrag löst
   * den erweiterten Zugang zum KiZ aus. Dann dazu: „Wer den Zuschuss beantragt, bekommt den Kinderzuschlag in diesem
   * Fall nicht mehr.“ (§ 6a Abs. 1a Nr. 3 BKGG: „erhält oder beantragt hat“).
   */
  | { code: "kv_zuschuss_jobcenter"; sperrtErweitertenZugang: boolean }
  /**
   * Bei „weiß nicht“ ist die Person wegen ihres weiteren Einkommens als versichert angenommen (src/krankenversicherung.ts).
   * Zahlt sie den Beitrag doch selbst, wäre die Ergebnisart eine andere (Nico, 31.10.2026). Entwurf: „Wir haben
   * angenommen, dass das weitere Einkommen die Krankenversicherung mit abdeckt. Ist das nicht so, wird der Beitrag selbst
   * gezahlt. Dann ergibt sich nach den Regeln ein anderes Ergebnis: {ergebnisMitBeitrag}.“
   */
  | { code: "kv_annahme_kippt"; person: number; ergebnisMitBeitrag: Vergleichsergebnis };

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
       * Ausgezahlter KiZ und ausgezahltes Wohngeld. fehlbetrag: Lücke A plus Beitrag zur Krankenversicherung minus
       * wirksamer KiZ und Wohngeld, 0 oder kleiner: gedeckt. krankenversicherung: Beitrag, den der Haushalt auf Weg B
       * selbst zahlt (DA-KiZ C.4.1 Abs. 5). restAusErspartem: Es fehlt noch Geld, Weg A ist aber wegen Erspartem über
       * dem Freibetrag ausgeschlossen; der Rest kommt aus dem Ersparten.
       */
      wegB: {
        kinderzuschlag: Cent;
        wohngeld: Cent;
        summe: Cent;
        fehlbetrag: Cent;
        krankenversicherung: Cent;
        restAusErspartem: boolean;
      };
      /** Kein Betrag, weil die Leistungen auf beiden Wegen gleich sind. */
      but: {
        wegA: { zustaendig: string; moeglich: boolean };
        wegB: { zustaendig: string; moeglich: boolean };
      };
      hinweise: VergleichHinweis[];
      sgb2: ImUmfang<Sgb2Ergebnis>;
      kiz: ImUmfang<KizErgebnis>;
      wohngeld: ImUmfang<WohngeldErgebnis>;
      /** Alle eingeflossenen Werte mit Status "pruefen" oder "geplant", jeder einmal. */
      parameterHinweise: ParameterHinweis[];
    };

export function berechne(haushalt: Haushalt, optionen: { stichtag: string }): Ergebnis {
  return vergleiche(haushalt, optionen.stichtag, true);
}

// kippPruefung: für jede Person, die wegen weiteren Einkommens als versichert angenommen ist, einmal mit Beitrag
// nachrechnen. Die Nachrechnung prüft selbst nicht noch einmal.
function vergleiche(haushalt: Haushalt, stichtag: string, kippPruefung: boolean): Ergebnis {
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
  // Den Beitrag zur Krankenversicherung zahlt der Haushalt auf Weg B selbst (DA-KiZ C.4.1 Abs. 5, wie in kiz.ts).
  const krankenversicherung = kiz.bedarfspruefung.krankenversicherung;
  const fehlbetrag = sgb2.lueckeA + krankenversicherung - kizWirksam - wohngeld.auszahlung;
  // Randfall (Nico, 31.10.2026): Ohne den Beitrag reicht das Einkommen (Lücke A ≤ 0), erst der Beitrag lässt Geld
  // fehlen. Weg A wäre dann nur der Zuschuss nach § 26 Abs. 2 SGB II, den Version 0 nicht rechnet. Die Ergebnisart
  // bleibt wie ohne Beitrag, dazu ein Hinweis (docs/offene-rechtsfragen.md).
  const nurDurchBeitrag = sgb2.lueckeA <= 0 && fehlbetrag > 0;
  const fehlbetragFuerErgebnis = nurDurchBeitrag ? fehlbetrag - krankenversicherung : fehlbetrag;
  // Erspartes über dem SGB-II-Freibetrag schließt Hilfebedürftigkeit aus, soweit es den Fehlbetrag deckt
  // (§ 9 Abs. 1 SGB II, wie in kiz.ts). Dann gibt es Weg A nicht, auch wenn mit Weg B noch Geld fehlt. Deckt es
  // ihn nicht, bleibt Weg A; das SGB-II-Ergebnis meldet, dass Erspartes zuerst eingesetzt wird.
  const erspartesDeckt = sgb2.vermoegen.ueberFreibetrag.von >= fehlbetrag;
  const wegAWegenVermoegenAusgeschlossen = sgb2.anspruch === "nein_vermoegen" && erspartesDeckt;
  const nachEinsatzDesErsparten = sgb2.anspruch === "nein_vermoegen" && !wegAWegenVermoegenAusgeschlossen;
  const wegAHatAnspruch = sgb2.anspruch === "ja" || sgb2.anspruch === "unklar_vermoegen";
  // Ob es den Sofortzuschlag auch ohne Grundsicherung gibt, wenn nur das Kindergeld den Anspruch verhindert, regelt
  // der Parameter sofortzuschlagOhneAnspruch (sgb2.ts; seit 28.10.2026 nicht). Auf Weg B kommt er nicht dazu: 2026 steckt er im KiZ (§ 6a Abs. 2 Satz 4 BKGG). Ob KiZ-Haushalte ihn 2027 nach
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
    krankenversicherung,
    // Im Randfall ist sgb2.anspruch "nein_einkommen"; deckt das Ersparte über dem Freibetrag den Beitrag, kommt der
    // Rest ebenfalls aus dem Ersparten (rechts-pruefer, 31.10.2026).
    restAusErspartem: fehlbetrag > 0 && (wegAWegenVermoegenAusgeschlossen || (nurDurchBeitrag && erspartesDeckt)),
  };

  let ergebnis: Vergleichsergebnis;
  // Löst erst der Beitrag den erweiterten Zugang aus, gilt er auch im Randfall (sonst fehlte die Reihenfolge-Karte).
  if (nurDurchBeitrag && kiz.anspruch === "erweiterter_zugang") ergebnis = "erweiterter_zugang";
  else if (fehlbetragFuerErgebnis <= 0 || wegAWegenVermoegenAusgeschlossen) {
    ergebnis = summe === 0 && (sgb2.lueckeA <= 0 || wegAWegenVermoegenAusgeschlossen) ? "kein_anspruch" : "weg_b_deckt";
  } else if (kiz.anspruch === "erweiterter_zugang") ergebnis = "erweiterter_zugang";
  else ergebnis = "nur_weg_a";

  // Deckt das Ersparte über dem Freibetrag den Beitrag, braucht es keinen Zuschuss.
  const hinweise: VergleichHinweis[] =
    nurDurchBeitrag && !erspartesDeckt
      ? [{ code: "kv_zuschuss_jobcenter", sperrtErweitertenZugang: kiz.anspruch === "erweiterter_zugang" }]
      : [];
  if (kippPruefung) {
    for (const h of kiz.krankenversicherung.hinweise) {
      if (h.code !== "kv_angenommen" || !h.weiteresEinkommen) continue;
      const mitBeitrag: Haushalt = {
        ...haushalt,
        erwachsene: haushalt.erwachsene.map((e, i) => (i === h.person ? { ...e, krankenversicherung: "selbst" } : e)),
      };
      const anders = vergleiche(mitBeitrag, stichtag, false);
      if (anders.imUmfang && anders.ergebnis !== ergebnis) {
        hinweise.push({ code: "kv_annahme_kippt", person: h.person, ergebnisMitBeitrag: anders.ergebnis });
      }
    }
  }

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
    hinweise,
    sgb2,
    kiz,
    wohngeld,
    parameterHinweise: vereinige(sgb2.parameterHinweise, kiz.parameterHinweise, wohngeld.parameterHinweise, but.parameterHinweise),
  };
}
