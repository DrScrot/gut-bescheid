// Folgen je Testhaushalt (M4): welche Karten in welcher Reihenfolge erscheinen, die Einordnung, der nächste Schritt
// und die Unterlagen. Die Soll-Listen stehen in tests/haushalte/T*.json (soll.folgen).
import { describe, expect, it } from "vitest";
import { folgen, type Folgen } from "../src/folgen";
import { berechne, type Erwachsener, type Haushalt } from "../src/index";
import { testhaushalt, testhaushalte, type FolgenSoll } from "./testhaushalte";

function rechne(h: Haushalt, stichtag = "2026-07-01") {
  const e = berechne(h, { stichtag });
  if (!e.imUmfang) throw new Error(`außerhalb des Umfangs: ${e.gruende.join(", ")}`);
  return { ergebnis: e, folgen: folgen(h, e) };
}

function ids(f: Folgen): Omit<FolgenSoll, "stichtag" | "quelle"> {
  return {
    einordnung: f.einordnung.id,
    wegA: f.karten.wegA.map((k) => k.id),
    wegB: f.karten.wegB.map((k) => k.id),
    beide: f.karten.beide.map((k) => k.id),
    naechsterSchritt:
      f.naechsterSchritt.art === "einer"
        ? { art: "einer", ids: [f.naechsterSchritt.schritt.id] }
        : { art: "wahl", ids: [f.naechsterSchritt.wegA.id, f.naechsterSchritt.wegB.id] },
    unterlagen: { wegA: f.unterlagen.wegA.map((u) => u.id), wegB: f.unterlagen.wegB.map((u) => u.id) },
  };
}

describe("Testhaushalte: Folgen wie in soll.folgen", () => {
  it("jeder Testhaushalt hat Soll-Folgen", () => {
    expect(testhaushalte.filter((t) => (t.soll.folgen ?? []).length === 0).map((t) => t.id)).toEqual([]);
  });

  for (const t of testhaushalte) {
    const { eingabe } = t;
    if (eingabe === null) continue;
    for (const soll of t.soll.folgen ?? []) {
      it(`${t.id}, Stichtag ${soll.stichtag}: ${t.haushalt}`, () => {
        const { stichtag, quelle, ...erwartet } = soll;
        expect(quelle).not.toBe("");
        expect(ids(rechne(eingabe, stichtag).folgen)).toEqual(erwartet);
      });
    }
  }
});

describe("Karten", () => {
  it("Platzhalter sind gefüllt, Beträge deutsch formatiert", () => {
    const { ergebnis, folgen: f } = rechne(testhaushalt("T01").eingabe);
    const alle = [...f.karten.wegA, ...f.karten.wegB, ...f.karten.beide];
    expect(alle.filter((k) => /[{}]/.test(k.titel + k.text + k.textLeicht)).map((k) => k.id)).toEqual([]);
    // Vermögensgrenze KiZ für 4 Personen: 40.000 € + 3 × 15.000 € (§ 6a Abs. 3 Satz 5 BKGG)
    expect(ergebnis.kiz.vermoegen.grenze).toBe(8500000);
    expect(alle.find((k) => k.id === "b_erspartes_kiz")?.text).toContain("85.000 €");
    expect(alle.find((k) => k.id === "a_erspartes")?.text).toContain(`${(ergebnis.sgb2.vermoegen.freibetrag / 100).toLocaleString("de-DE")} €`);
  });

  it("jede Karte trägt Fundstelle, Quelle und Status für „Warum?“", () => {
    const { folgen: f } = rechne(testhaushalt("T01").eingabe);
    for (const k of [...f.karten.wegA, ...f.karten.wegB, ...f.karten.beide]) {
      expect(k.fundstelle).not.toBe("");
      expect(["geprueft", "pruefen", "geplant"]).toContain(k.status);
      expect(["pflicht", "pruefung", "gut_zu_wissen"]).toContain(k.art);
    }
  });

  it("Stichtag: die Karte zum Kinderzuschlag 2027 erscheint ab 01.08.2026 (Bewilligung 6 Monate, § 6a Abs. 7 BKGG)", () => {
    const h = testhaushalt("T01").eingabe;
    expect(rechne(h, "2026-07-31").folgen.karten.wegB.map((k) => k.id)).not.toContain("b_kiz_2027");
    expect(rechne(h, "2026-08-01").folgen.karten.wegB.map((k) => k.id)).toContain("b_kiz_2027");
  });

  it("Stichtag ab 2027: statt der Ankündigung die Karten zur Rechnung nach Entwurf", () => {
    const h = testhaushalt("T01").eingabe;
    const ende2026 = rechne(h, "2026-12-31").folgen.karten.wegB.map((k) => k.id);
    const ab2027 = rechne(h, "2027-01-01").folgen.karten.wegB.map((k) => k.id);
    expect(ende2026).toEqual(expect.arrayContaining(["b_kiz_2027", "b_wohngeld_2027"]));
    expect(ende2026).not.toContain("b_kiz_ab_2027");
    expect(ab2027).toEqual(expect.arrayContaining(["b_kiz_ab_2027", "b_wohngeld_ab_2027"]));
    expect(ab2027).not.toContain("b_kiz_2027");
  });
});

describe("Platzhalter mit Datum und Beitrag (Nico, 28.10.2026)", () => {
  const karte = (f: Folgen, id: string) => [...f.karten.wegA, ...f.karten.wegB].find((k) => k.id === id);

  it.each([
    ["2026-12-31", "b_kiz_2027"],
    ["2026-12-31", "b_wohngeld_2027"],
    ["2027-01-01", "b_kiz_ab_2027"],
    ["2027-01-01", "b_wohngeld_ab_2027"],
  ])("Stichtag %s, %s: nennt den Tag, an dem der Stand des Entwurfs geprüft wurde, statt „beim letzten Stand“", (stichtag, id) => {
    const k = karte(rechne(testhaushalt("T01").eingabe, stichtag).folgen, id);
    expect(k?.text).toContain("Am 28. Oktober 2026 war");
    expect(k?.textLeicht).toContain("Am 28. Oktober 2026 war");
    expect(`${k?.text} ${k?.textLeicht}`).not.toMatch(/letzten Stand|ist noch nicht (beschlossen|sicher|fertig)/);
  });

  it("Krankenversicherung: Mindestbeitrag gerundet, mit Pflege-Abschlag je Kind ab dem zweiten (T01: 2 Kinder, T08: 1 Kind)", () => {
    // 3.955 € ÷ 3 × (14,0 + 2,9 + 3,35) % = 266,96 € → etwa 267 €; mit einem Kind 3,6 % Pflege: 270,26 € → etwa 270 €
    expect(karte(rechne(testhaushalt("T01").eingabe).folgen, "b_krankenversicherung")?.text).toContain("etwa 267 €");
    expect(karte(rechne(testhaushalt("T08").eingabe).folgen, "b_krankenversicherung")?.text).toContain("etwa 270 €");
  });

  it("Krankenversicherung: Familienversicherung auch in eingetragener Lebenspartnerschaft (§ 10 Abs. 1 SGB V, Nico 31.10.2026)", () => {
    const k = karte(rechne(testhaushalt("T01").eingabe).folgen, "b_krankenversicherung");
    expect(k?.text).toContain("eingetragenen Lebenspartnerschaft");
    expect(k?.textLeicht).toContain("eingetragenen Lebens-Partnerschaft");
  });

  it("ab 2027: Mindestbeitrag mit der geplanten Bezugsgröße 4.130 €, als Hinweis geplant an der Karte", () => {
    // 4.130 € ÷ 3 = 1.376,67 €; × 16,9 % = 232,66 €, × 3,35 % = 46,12 € → 278,78 € → etwa 279 €
    const { folgen: f } = rechne(testhaushalt("T01").eingabe, "2027-01-01");
    expect(karte(f, "b_krankenversicherung")?.text).toContain("etwa 279 € im Monat oder mehr");
    expect(f.statusHinweise).toContainEqual(
      expect.objectContaining({ id: "b_krankenversicherung.kv.mindestbeitrag", status: "geplant" }),
    );
  });

  it("ein Platzhalter mit Status pruefen in einem Eintrag, der selbst pruefen ist, meldet nur den Eintrag", () => {
    const { folgen: f } = rechne(testhaushalt("T01").eingabe);
    expect(f.statusHinweise.map((h) => h.id).filter((id) => id.startsWith("b_erspartes_wohngeld"))).toEqual(["b_erspartes_wohngeld"]);
  });
});

describe("Hinweise auf ungeprüfte Einträge", () => {
  it("T01: Wohngeld-Vermögensgrenze (pruefen), Wohngeld 2027 (geplant), Dauer des Antrags (pruefen)", () => {
    const { folgen: f } = rechne(testhaushalt("T01").eingabe);
    expect(f.statusHinweise.map((h) => `${h.id}:${h.status}`)).toEqual([
      "b_erspartes_wohngeld:pruefen",
      "b_wohngeld_2027:geplant",
      "kiz_und_wohngeld_online.dauer:pruefen",
    ]);
  });

  it("T09: kein Eintrag zum Sofortzuschlag mehr; die Regel meldet das Ergebnis als Parameter (pruefen)", () => {
    const { ergebnis, folgen: f } = rechne(testhaushalt("T09").eingabe);
    expect(f.statusHinweise.map((h) => `${h.id}:${h.status}`)).toEqual([
      "b_erspartes_wohngeld:pruefen",
      "b_wohngeld_2027:geplant",
      "kiz_und_wohngeld_online.dauer:pruefen",
    ]);
    expect(ergebnis.parameterHinweise.map((h) => h.name)).toContain("sgb2.sofortzuschlagOhneAnspruch");
  });
});

// Sonderfälle, die in T01–T10 nicht vorkommen.
const T01 = testhaushalt("T01").eingabe;
const T09 = testhaushalt("T09").eingabe;
function mitEinkommen(h: Haushalt, brutto: number, netto: number): Haushalt {
  const [verdienend, ...rest] = h.erwachsene as [Erwachsener, ...Erwachsener[]];
  return { ...h, erwachsene: [{ ...verdienend, brutto, netto }, ...rest] };
}

describe("Sonderfälle", () => {
  it("erweiterter Zugang nur dank Erspartem (offene-rechtsfragen Punkt 3): Karte zum zweiten Monat, Wahl zwischen den Wegen", () => {
    const h = { ...mitEinkommen(T01, 120000, 96000), vermoegen: { von: 3005000, bis: 3005000 } };
    const { ergebnis, folgen: f } = rechne(h);
    expect(ergebnis.ergebnis).toBe("erweiterter_zugang");
    expect(f.einordnung.id).toBe("einordnung_erweiterter_zugang");
    expect(f.karten.beide[0]?.id).toBe("beide_reihenfolge");
    expect(f.karten.beide[0]?.hervorheben).toBe(true);
    expect([...f.karten.wegA, ...f.karten.wegB, ...f.karten.beide.slice(1)].some((k) => k.hervorheben)).toBe(false);
    expect(f.karten.wegB.map((k) => k.id)).toEqual(
      expect.arrayContaining(["b_erweiterter_zugang_verguenstigungen", "b_erweiterter_zugang_erspartes"]),
    );
    const wegA = f.karten.wegA.map((k) => k.id);
    expect(wegA).toContain("a_erspartes_zuerst");
    expect(wegA).not.toContain("a_erspartes");
    expect(ids(f).naechsterSchritt).toEqual({ art: "wahl", ids: ["grundsicherung_online", "kiz_und_wohngeld_online"] });
  });

  it("nur Weg A, Erspartes knapp über dem Freibetrag: erst das Ersparte, dann Grundsicherung", () => {
    const h = { ...mitEinkommen(T01, 120000, 96000), vermoegen: { von: 3002000, bis: 3002000 } };
    const { ergebnis, folgen: f } = rechne(h);
    expect(ergebnis.ergebnis).toBe("nur_weg_a");
    expect(f.einordnung.id).toBe("einordnung_nur_weg_a_erspartes");
    expect(f.karten.wegA.map((k) => k.id)).toContain("a_erspartes_zuerst");
    expect(ids(f).naechsterSchritt).toEqual({ art: "einer", ids: ["grundsicherung_online"] });
  });

  it("kein Anspruch (T09 mit 8.000 € brutto): kein Antrag nötig, Weg A sagt „kein Geld“, sonst nur die Zuständigkeit", () => {
    const { ergebnis, folgen: f } = rechne(mitEinkommen(T09, 800000, 500000));
    expect(ergebnis.ergebnis).toBe("kein_anspruch");
    expect(ids(f)).toEqual({
      einordnung: "einordnung_kein_anspruch",
      wegA: ["a_kein_geld", "a_zustaendig"],
      wegB: [],
      beide: [],
      naechsterSchritt: { art: "einer", ids: ["kein_antrag"] },
      unterlagen: { wegA: [], wegB: [] },
    });
    expect(f.naechsterSchritt.art === "einer" && f.naechsterSchritt.schritt.link).toBeNull();
  });

  it("nur Wohngeld deckt den Bedarf (T09 mit 5.000 € brutto): Wohngeld online beantragen", () => {
    const { ergebnis, folgen: f } = rechne(mitEinkommen(T09, 500000, 345000));
    expect(ergebnis.ergebnis).toBe("weg_b_deckt");
    expect(ergebnis.wegB).toMatchObject({ kinderzuschlag: 0, wohngeld: 7300 });
    expect(f.einordnung.id).toBe("einordnung_ohne_grundsicherung");
    expect(ids(f).naechsterSchritt).toEqual({ art: "einer", ids: ["wohngeld_online"] });
    expect(f.karten.wegB.map((k) => k.id).filter((id) => id.startsWith("b_kiz"))).toEqual([]);
  });

  it("Kind ohne Betreuung: Karte „Noch keine Betreuung“ nach der Karte zur Kinderbetreuung", () => {
    const h: Haushalt = { ...testhaushalt("T10").eingabe };
    h.kinder = h.kinder.map((k, i) => (i === 0 ? { ...k, betreuung: false } : k));
    const wegA = rechne(h).folgen.karten.wegA.map((k) => k.id);
    expect(wegA.slice(0, 3)).toEqual(["a_kinderbetreuung_ab_14_monate", "a_kinderbetreuung_platz_fehlt", "a_partner"]);
  });

  it("Kind mit Betreuung: Kosten der Betreuung gehören zu den Unterlagen für den Kinderzuschlag", () => {
    const h: Haushalt = { ...testhaushalt("T10").eingabe };
    h.kinder = h.kinder.map((k) => ({ ...k, betreuung: true }));
    const { folgen: f } = rechne(h);
    expect(f.unterlagen.wegB.map((u) => u.id)).toContain("kiz_betreuungskosten");
    expect(f.karten.wegA.map((k) => k.id)).not.toContain("a_kinderbetreuung_platz_fehlt");
  });

  it("Unterlagen tragen Leistung und Fundstelle", () => {
    const { folgen: f } = rechne(testhaushalt("T03").eingabe);
    expect(new Set(f.unterlagen.wegB.map((u) => u.leistung))).toEqual(new Set(["kiz", "wohngeld"]));
    expect(f.unterlagen.wegA.every((u) => u.leistung === "sgb2" && u.fundstelle !== "")).toBe(true);
  });
});
