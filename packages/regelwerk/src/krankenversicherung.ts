// Mindestbeitrag einer freiwilligen Kranken- und Pflegeversicherung ohne eigenes Einkommen. Nur für die Folgen-Karte
// zur Krankenversicherung (M4, Nico 28.10.2026): ein Überschlag mit dem durchschnittlichen Zusatzbeitrag, jede Kasse
// hat ihren eigenen. Version 0 nimmt an, dass die Person Elternteil aller Kinder im Haushalt ist: kein Zuschlag für
// Kinderlose, Abschlag je Kind unter 25 Jahren ab dem zweiten (§ 55 Abs. 3 SGB XI).
import type { Cent } from "./geld";
import type { KvParameter, Status } from "./parameter";

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
