// Mindestbeitrag einer freiwilligen Kranken- und Pflegeversicherung ohne eigenes Einkommen (M4, Karte zur
// Krankenversicherung, Nico 28.10.2026). Von Hand gerechnet am 29.10.2026 mit den Werten von 2026:
// beitragspflichtig mindestens 3.955 € ÷ 90 je Tag × 30 Tage = 1.318,33 € (§ 240 Abs. 4 Satz 1, § 223 Abs. 2 SGB V).
// Kranken- und Pflegeversicherung je auf Cent gerundet; vom rechts-pruefer am 29.10.2026 nachgerechnet.
import { describe, expect, it } from "vitest";
import type { Erwachsener, Haushalt } from "../src/haushalt";
import { beitragWegB, mindestbeitragFreiwillig } from "../src/krankenversicherung";
import { rechtsstandZumStichtag } from "../src/parameter";
import { testhaushalt } from "./testhaushalte";

const KV_2026 = rechtsstandZumStichtag("2026-07-01").kv;

describe("Mindestbeitrag freiwillige Versicherung (Überschlag mit Ø-Zusatzbeitrag)", () => {
  it.each([
    // Kinder (Alter), Satz in %, Cent
    [[4], "14,0 + 2,9 + 3,6 = 20,5", 27026],
    [[4, 8], "… + 3,35 = 20,25", 26696],
    [[1, 5, 12], "… + 3,1 = 20,0", 26367],
    [[1, 2, 3, 4, 5], "… + 2,6 = 19,5", 25708],
    [[1, 2, 3, 4, 5, 6], "höchstens 4 Abschläge: wie 5 Kinder", 25708],
  ])("Kinder %j: %s %%, %i Cent", (alter, _satz, cent) => {
    expect(mindestbeitragFreiwillig(KV_2026, alter).cent).toBe(cent);
  });

  it("Kinder ab 25 Jahren zählen für den Abschlag nicht (§ 55 Abs. 3 Satz 5 SGB XI)", () => {
    expect(mindestbeitragFreiwillig(KV_2026, [4, 25]).cent).toBe(27026);
  });

  it("Status: 2026 geprueft, 2028 pruefen (fortgeschrieben); Fundstellen aller Teile", () => {
    const m2026 = mindestbeitragFreiwillig(KV_2026, [4]);
    expect(m2026.status).toBe("geprueft");
    expect(m2026.fundstelle).toContain("§ 240 Abs. 4 Satz 1");
    expect(m2026.fundstelle).toContain("BAnz AT 10.11.2025 B7");
    expect(mindestbeitragFreiwillig(rechtsstandZumStichtag("2028-01-01").kv, [4]).status).toBe("pruefen");
  });

  it("2027 mit der geplanten Bezugsgröße 4.130 € (BR-Drs. 576/26): 282,22 € bei 1 Kind, 278,78 € bei 2 Kindern, Status geplant", () => {
    // Nachgerechnet vom rechts-pruefer am 29.10.2026: 1.376,67 € × 20,5 % und × 20,25 %, je Beitragsart auf Cent gerundet.
    const kv2027 = rechtsstandZumStichtag("2027-01-01").kv;
    expect(mindestbeitragFreiwillig(kv2027, [4]).cent).toBe(28222);
    expect(mindestbeitragFreiwillig(kv2027, [4, 8]).cent).toBe(27878);
    expect(mindestbeitragFreiwillig(kv2027, [4]).status).toBe("geplant");
  });
});

// Beitrag auf Weg B (DA-KiZ C.4.1 Abs. 5, Stand 20.02.2026; Regeln für fehlende Angaben und „weiß nicht“ von Nico am
// 31.10.2026). Grundlage: T01 (Paar, Kinder 4 und 8): Mindestbeitrag 266,96 €. Minijob-Grenze 2026: 603 €.
describe("Beitrag zur Krankenversicherung auf Weg B", () => {
  const STAND = rechtsstandZumStichtag("2026-07-01");
  const t01 = testhaushalt("T01").eingabe;
  const [verdiener, partner] = t01.erwachsene as [Erwachsener, Erwachsener];
  const paar = (a: Partial<Erwachsener>, b: Partial<Erwachsener>, extra: Partial<Haushalt> = {}): Haushalt => ({
    ...t01,
    erwachsene: [{ ...verdiener, ...a }, { ...partner, ...b }],
    ...extra,
  });
  const beitraege = (h: Haushalt, stichtag = "2026-07-01") =>
    beitragWegB(h, rechtsstandZumStichtag(stichtag)).personen.map((p) => [p.gerechnetAls, p.beitrag]);

  it("arbeit, leistung, familie: kein Beitrag; selbst: Mindestbeitrag", () => {
    const h = paar({ krankenversicherung: "arbeit" }, { krankenversicherung: "selbst" }, { familienstand: "nicht_verheiratet" });
    expect(beitraege(h)).toEqual([["arbeit", 0], ["selbst", 26696]]);
    expect(beitragWegB(h, STAND)).toMatchObject({ beitrag: 26696, hinweise: [] });
    const versichert = paar({ krankenversicherung: "leistung" }, { krankenversicherung: "familie" }, { familienstand: "verheiratet" });
    expect(beitragWegB(versichert, STAND)).toMatchObject({ beitrag: 0, hinweise: [] });
  });

  it("privat mit Beitrag: genau dieser Betrag", () => {
    const h = paar({ krankenversicherung: "arbeit" }, { krankenversicherung: "privat", privatBeitrag: 41250 });
    expect(beitragWegB(h, STAND)).toMatchObject({ beitrag: 41250, hinweise: [] });
  });

  it("privat ohne Beitrag: kein Abzug, aber Hinweis, dass Weg B unsicher ist (Nico, 31.10.2026)", () => {
    const h = paar({ krankenversicherung: "arbeit" }, { krankenversicherung: "privat" });
    expect(beitragWegB(h, STAND)).toMatchObject({ beitrag: 0, hinweise: [{ code: "kv_privat_ohne_beitrag", person: 1 }] });
  });

  it("ohne Angaben: kein Beitrag, Hinweis nur, wenn jemand ohne Job über der Minijob-Grenze ist", () => {
    expect(beitragWegB(t01, STAND)).toMatchObject({ beitrag: 0, hinweise: [{ code: "kv_unbekannt" }] });
    const beideMitJob = paar({}, { brutto: 80000, netto: 64000 });
    expect(beitragWegB(beideMitJob, STAND)).toMatchObject({ beitrag: 0, hinweise: [] });
  });

  it("nicht verheiratet und ohne Angabe: wie „weiß nicht“ (Nico, 31.10.2026)", () => {
    const h = paar({}, {}, { familienstand: "nicht_verheiratet" });
    expect(beitraege(h)).toEqual([["arbeit", 0], ["selbst", 26696]]);
    expect(beitragWegB(h, STAND).hinweise).toEqual([
      { code: "kv_angenommen", person: 0, angenommen: "arbeit", weiteresEinkommen: false },
      { code: "kv_angenommen", person: 1, angenommen: "selbst", weiteresEinkommen: false },
    ]);
  });

  it("weiß nicht, Minijob: selbst, ein Minijob ist kein versichertes Einkommen (§ 240 Abs. 4 Satz 1 SGB V)", () => {
    const h = paar({ krankenversicherung: "arbeit" }, { brutto: 60300, netto: 60300, krankenversicherung: "weiss_nicht" });
    expect(beitraege(h)).toEqual([["arbeit", 0], ["selbst", 26696]]);
  });

  it("weiß nicht, Job über der Minijob-Grenze: über die Arbeit versichert", () => {
    const h = paar({ krankenversicherung: "weiss_nicht" }, { krankenversicherung: "selbst" });
    expect(beitraege(h)).toEqual([["arbeit", 0], ["selbst", 26696]]);
  });

  it("weiß nicht, nur weiteres Einkommen (Art unbekannt): versichert angenommen, kein Beitrag (§ 192 Abs. 1 Nr. 2, § 224 SGB V; Nico, 31.10.2026)", () => {
    const h = paar({ krankenversicherung: "arbeit" }, { sonstigesEinkommen: 90000, krankenversicherung: "weiss_nicht" });
    expect(beitraege(h)).toEqual([["arbeit", 0], ["leistung", 0]]);
    expect(beitragWegB(h, STAND).hinweise).toEqual([
      { code: "kv_angenommen", person: 1, angenommen: "leistung", weiteresEinkommen: true },
    ]);
  });

  it("weiß nicht, verheiratet, beide ohne Job, eine Person mit weiterem Einkommen: sie versichert, die andere über sie familienversichert", () => {
    const h = paar(
      { brutto: 0, netto: 0, sonstigesEinkommen: 90000, krankenversicherung: "weiss_nicht" },
      { krankenversicherung: "weiss_nicht" },
      { familienstand: "verheiratet" },
    );
    expect(beitraege(h)).toEqual([["leistung", 0], ["familie", 0]]);
  });

  it("weiß nicht, verheiratet, Partner mit Job: familienversichert", () => {
    const h = paar({ krankenversicherung: "arbeit" }, { krankenversicherung: "weiss_nicht" }, { familienstand: "verheiratet" });
    expect(beitraege(h)).toEqual([["arbeit", 0], ["familie", 0]]);
  });

  it("weiß nicht, Lebenspartnerschaft, beide ohne versicherten Job: die erste Person selbst, die zweite über sie familienversichert", () => {
    const h = paar(
      { brutto: 0, netto: 0, krankenversicherung: "weiss_nicht" },
      { krankenversicherung: "weiss_nicht" },
      { familienstand: "lebenspartnerschaft" },
    );
    expect(beitraege(h)).toEqual([["selbst", 26696], ["familie", 0]]);
  });

  it("weiß nicht, verheiratet, Partner privat versichert: selbst (Familienversicherung nur über ein Mitglied der gesetzlichen Kasse)", () => {
    const h = paar(
      { krankenversicherung: "privat", privatBeitrag: 30000 },
      { krankenversicherung: "weiss_nicht" },
      { familienstand: "verheiratet" },
    );
    expect(beitraege(h)).toEqual([["privat", 30000], ["selbst", 26696]]);
  });

  it("familie ohne Ehe: gerechnet wie angegeben, mit Hinweis", () => {
    const h = paar({ krankenversicherung: "arbeit" }, { krankenversicherung: "familie" }, { familienstand: "nicht_verheiratet" });
    expect(beitragWegB(h, STAND)).toMatchObject({ beitrag: 0, hinweise: [{ code: "kv_familie_ohne_ehe", person: 1 }] });
  });

  it("alleinerziehend mit Minijob und „weiß nicht“: selbst", () => {
    const h: Haushalt = { ...t01, erwachsene: [{ ...partner, brutto: 60300, netto: 60300, krankenversicherung: "weiss_nicht" }] };
    expect(beitraege(h)).toEqual([["selbst", 26696]]);
  });

  it("Werte 2027 geplant: als Hinweise, aber nur, wenn jemand selbst zahlt", () => {
    const selbst = paar({ krankenversicherung: "arbeit" }, { krankenversicherung: "selbst" });
    const namen = beitragWegB(selbst, rechtsstandZumStichtag("2027-01-01")).parameterHinweise.map((h) => h.name);
    expect(namen).toContain("kv.bezugsgroesse");
    const versichert = paar({ krankenversicherung: "arbeit" }, { krankenversicherung: "familie" }, { familienstand: "verheiratet" });
    expect(beitragWegB(versichert, rechtsstandZumStichtag("2027-01-01")).parameterHinweise).toEqual([]);
  });
});
