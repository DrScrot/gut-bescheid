// Mindestbeitrag einer freiwilligen Kranken- und Pflegeversicherung ohne eigenes Einkommen. Nur für die Folgen-Karte
// zur Krankenversicherung (M4, Nico 28.10.2026): ein Überschlag mit dem durchschnittlichen Zusatzbeitrag, jede Kasse
// hat ihren eigenen. Version 0 nimmt an, dass die Person Elternteil aller Kinder im Haushalt ist: kein Zuschlag für
// Kinderlose, Abschlag je Kind unter 25 Jahren ab dem zweiten (§ 55 Abs. 3 SGB XI).
import type { Cent } from "./geld";
import type { Haushalt, Krankenversicherung } from "./haushalt";
import { parameterHinweis, type KvParameter, type ParameterHinweis, type Rechtsstand, type Status } from "./parameter";

export interface Mindestbeitrag {
  cent: Cent;
  /** Der schwächste Status der verwendeten Parameter. */
  status: Status;
  fundstelle: string;
}

const STATUS_REIHENFOLGE: readonly Status[] = ["geprueft", "aus_quelle", "pruefen", "geplant"];

export function mindestbeitragFreiwillig(kv: KvParameter, kinderAlterJahre: readonly number[]): Mindestbeitrag {
  const { bezugsgroesse, mindestbemessung, beitragssatzErmaessigt, zusatzbeitragDurchschnitt, pflegeBeitragssatz } = kv;
  const pflege = pflegeBeitragssatz.wert;
  const kinder = kinderAlterJahre.filter((jahre) => jahre < pflege.kinderUnterJahren).length;
  const kinderMitAbschlag = Math.min(
    Math.max(kinder - pflege.abschlagAbKind + 1, 0),
    pflege.abschlagBisKind - pflege.abschlagAbKind + 1,
  );
  // Beitragspflichtig mindestens Bezugsgröße ÷ 90 je Kalendertag, der Monat zu 30 Tagen, auf Cent gerundet. Sätze in
  // Hundertstel Prozent. Kranken- und Pflegeversicherung je für sich auf Cent gerundet, wie die Kassen rechnen.
  const { teilJeKalendertag, tageJeMonat } = mindestbemessung.wert;
  const bemessung = Math.round((bezugsgroesse.wert * tageJeMonat) / teilJeKalendertag);
  const kranken = Math.round((bemessung * (beitragssatzErmaessigt.wert + zusatzbeitragDurchschnitt.wert)) / 10000);
  const pflegeBeitrag = Math.round((bemessung * (pflege.eltern - kinderMitAbschlag * pflege.abschlagJeKind)) / 10000);
  const cent = kranken + pflegeBeitrag;

  const teile = [bezugsgroesse, mindestbemessung, beitragssatzErmaessigt, zusatzbeitragDurchschnitt, pflegeBeitragssatz];
  const status = STATUS_REIHENFOLGE[Math.max(...teile.map((p) => STATUS_REIHENFOLGE.indexOf(p.status)))] ?? "pruefen";
  return { cent, status, fundstelle: teile.map((p) => p.fundstelle).join("; ") };
}

/** Wie eine Person auf Weg B gerechnet wird. unbekannt: keine Angabe, kein Beitrag. */
export type KvGerechnetAls = Exclude<Krankenversicherung, "weiss_nicht"> | "unbekannt";

// Texte für die Oberfläche (M5, i18n) stehen am jeweiligen Code; Entwürfe, vor M5 mit texte-schreiben und text-lektor.
export type KvHinweis =
  /** „Wie ihr krankenversichert seid, wissen wir nicht. Muss sich jemand selbst versichern, fehlt mit Kinderzuschlag und Wohngeld mehr Geld.“ */
  | { code: "kv_unbekannt" }
  /**
   * „Wir haben angenommen: {angenommen}.“ weiteresEinkommen: als versichert angenommen, weil die Person weiteres
   * Einkommen hat (angenommen = leistung). Dazu (Fassung des rechts-pruefer, 31.10.2026): „Wer Arbeitslosengeld oder
   * Krankengeld bekommt, ist nach den Regeln meist schon versichert. Wer Elterngeld bekommt und vorher über die Arbeit
   * versichert war, zahlt meist keinen Beitrag.“ Kippt das Ergebnis mit Beitrag, meldet der Vergleich kv_annahme_kippt.
   */
  | {
      code: "kv_angenommen";
      person: number;
      angenommen: "arbeit" | "leistung" | "familie" | "selbst";
      weiteresEinkommen: boolean;
    }
  /** „Den Beitrag zur privaten Versicherung kennen wir nicht. Darum wissen wir nicht sicher, ob Kinderzuschlag und Wohngeld reichen.“ */
  | { code: "kv_privat_ohne_beitrag"; person: number }
  /**
   * „Über den Partner familienversichert geht nur mit Ehe oder eingetragener Lebenspartnerschaft. Über die eigenen
   * Eltern geht es bis zu einem bestimmten Alter.“
   */
  | { code: "kv_familie_ohne_ehe"; person: number };

export interface KvWegB {
  /** Summe der Beiträge, die der Haushalt auf Weg B selbst zahlt. */
  beitrag: Cent;
  /** Je Erwachsenem (Index in haushalt.erwachsene). */
  personen: { index: number; gerechnetAls: KvGerechnetAls; beitrag: Cent }[];
  hinweise: KvHinweis[];
  /** Werte aus kv.json mit Status pruefen oder geplant, nur wenn jemand den Mindestbeitrag zahlt. */
  parameterHinweise: ParameterHinweis[];
}

const MITGLIED: readonly KvGerechnetAls[] = ["arbeit", "leistung", "selbst"];

/**
 * Beitrag zur Kranken- und Pflegeversicherung, den der Haushalt auf Weg B selbst zahlt (DA-KiZ C.4.1 Abs. 5). Auf Weg A
 * ist man über die Grundsicherung pflichtversichert (§ 5 Abs. 1 Nr. 2a SGB V). Regeln für fehlende Angaben und „weiß
 * nicht“: Entscheidung von Nico am 31.10.2026.
 * - Keine Angabe: kein Beitrag. Hinweis, wenn jemand ohne Job über der Minijob-Grenze ist. Ist das Paar nicht
 *   verheiratet, gilt eine fehlende Angabe als „weiß nicht“.
 * - „Weiß nicht“: Job über der Minijob-Grenze → arbeit (ein Minijob ist kein versichertes Einkommen). Weiteres
 *   Einkommen, dessen Art Version 0 nicht kennt → leistung: Mit Arbeitslosengeld ist man pflichtversichert, mit
 *   Krankengeld oder Elterngeld bleibt die Mitgliedschaft meist beitragsfrei erhalten (§ 192 Abs. 1 Nr. 2, § 224 SGB V;
 *   Empfehlung des rechts-pruefer, Entscheidung von Nico am 31.10.2026). Sonst bei Ehe oder Lebenspartnerschaft familie
 *   über ein Mitglied der gesetzlichen Kasse (§ 10 Abs. 1 SGB V); ist keins da, versichert sich die erste Person selbst
 *   und die zweite über sie. Sonst selbst.
 * - privat: der angegebene Monatsbeitrag; ohne Betrag kein Abzug und ein Hinweis.
 * Der Mindestbeitrag nimmt an, dass die Person Elternteil aller Kinder ist (siehe mindestbeitragFreiwillig).
 */
export function beitragWegB(haushalt: Haushalt, stand: Rechtsstand): KvWegB {
  const { erwachsene, familienstand } = haushalt;
  const minijobGrenze = stand.wohngeld.geringfuegigkeitsgrenze.wert;
  const ehe = erwachsene.length === 2 && (familienstand === "verheiratet" || familienstand === "lebenspartnerschaft");
  const hinweise: KvHinweis[] = [];

  // Erster Durchgang: Angaben und Ableitungen, die nicht vom Partner abhängen. offen: „weiß nicht“ ohne versicherten
  // Job und ohne weiteres Einkommen.
  const angaben = erwachsene.map(
    (e) => e.krankenversicherung ?? (familienstand === "nicht_verheiratet" ? "weiss_nicht" : undefined),
  );
  const erster = erwachsene.map((e, index): KvGerechnetAls | "offen" => {
    const angabe = angaben[index];
    if (angabe === undefined) return "unbekannt";
    if (angabe !== "weiss_nicht") return angabe;
    if (e.brutto > minijobGrenze) return "arbeit";
    return e.sonstigesEinkommen > 0 ? "leistung" : "offen";
  });
  // Zweiter Durchgang: Familienversicherung über den Partner, sonst selbst.
  const gerechnet = erster.map((g, index): KvGerechnetAls => {
    if (g !== "offen") return g;
    if (!ehe) return "selbst";
    const anderer = erster[1 - index];
    if (anderer !== undefined && MITGLIED.includes(anderer as KvGerechnetAls)) return "familie";
    // Beide offen: die erste Person versichert sich selbst, die zweite über sie.
    if (anderer === "offen") return index === 0 ? "selbst" : "familie";
    return "selbst";
  });

  let mindestbeitrag: Mindestbeitrag | undefined;
  const personen = erwachsene.map((e, index) => {
    const gerechnetAls = gerechnet[index] ?? "unbekannt";
    if (angaben[index] === "weiss_nicht") {
      hinweise.push({
        code: "kv_angenommen",
        person: index,
        angenommen: gerechnetAls as "arbeit" | "leistung" | "familie" | "selbst",
        weiteresEinkommen: gerechnetAls === "leistung",
      });
    }
    if (gerechnetAls === "familie" && familienstand === "nicht_verheiratet") {
      hinweise.push({ code: "kv_familie_ohne_ehe", person: index });
    }
    let beitrag = 0;
    if (gerechnetAls === "selbst") {
      mindestbeitrag ??= mindestbeitragFreiwillig(stand.kv, haushalt.kinder.map((k) => k.alter.jahre));
      beitrag = mindestbeitrag.cent;
    } else if (gerechnetAls === "privat") {
      if (e.privatBeitrag === undefined) hinweise.push({ code: "kv_privat_ohne_beitrag", person: index });
      beitrag = e.privatBeitrag ?? 0;
    }
    return { index, gerechnetAls, beitrag };
  });

  const ohneJobUnbekannt = personen.some((p, i) => p.gerechnetAls === "unbekannt" && (erwachsene[i]?.brutto ?? 0) <= minijobGrenze);
  if (ohneJobUnbekannt) hinweise.unshift({ code: "kv_unbekannt" });

  const parameterHinweise =
    mindestbeitrag === undefined
      ? []
      : (Object.entries(stand.kv) as [string, KvParameter[keyof KvParameter]][]).flatMap(
          ([name, p]) => parameterHinweis(`kv.${name}`, p) ?? [],
        );
  return { beitrag: personen.reduce((s, p) => s + p.beitrag, 0), personen, hinweise, parameterHinweise };
}
