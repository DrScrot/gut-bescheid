// Die Daten des Folgen-Katalogs (folgen/*.json): Felder, Fundstellen, Texte nach .claude/skills/texte-schreiben.
import { describe, expect, it } from "vitest";
import { FOLGEN, PLATZHALTER, ladeFolgen } from "../src/folgen";
import katalog from "../folgen/katalog.json";
import einordnung from "../folgen/einordnung.json";
import schritte from "../folgen/naechste-schritte.json";
import unterlagen from "../folgen/unterlagen.json";
import { lesbarkeit, saetze, woerter } from "./lesbarkeit";

// Fachkonzept, Texte: Amstad mindestens 70 je Text, Sätze unter 15 Wörtern.
const AMSTAD_MINDESTENS = 70;
const SATZ_HOECHSTENS_WOERTER = 14;
const TITEL_HOECHSTENS_WOERTER = 6;

// Für die Messung: Platzhalter durch typische Werte ersetzen (lange Zahlen sind beim Vorlesen lang).
const BEISPIELWERTE: Record<string, string> = {
  "sgb2.vermoegensfreibetrag": "30.000 €",
  "kiz.vermoegensgrenze": "70.000 €",
  "kiz.erweiterterZugangHoechstens": "100 €",
  "wohngeld.vermoegensgrenze": "150.000 €",
  "kv.mindestbeitrag": "270 €",
  "kiz.entwurfGeprueftAm": "28. Oktober 2026",
  "wohngeld.entwurfGeprueftAm": "28. Oktober 2026",
};

// .claude/skills/texte-schreiben: verbotene Wörter; dazu Amtskürzel und Einzelfallprognosen (RDG).
const VERBOTEN: [RegExp, string][] = [
  [/\bentdeck/i, "entdecke"],
  [/\bmühelos/i, "mühelos"],
  [/\bnahtlos/i, "nahtlos"],
  [/\brevolutionär/i, "revolutionär"],
  [/\bganzheitlich/i, "ganzheitlich"],
  [/\bmaßgeschneidert/i, "maßgeschneidert"],
  [/\bsmart\b/i, "smart"],
  [/\bintelligent/i, "intelligent"],
  [/\bReise\b/i, "Reise"],
  [/\bPower\b/i, "Power"],
  [/\blass uns\b/i, "Lass uns"],
  [/!{2,}/, "Ausrufezeichen-Kette"],
  [/\p{Extended_Pictographic}/u, "Emoji"],
  [/\bSanktion/i, "Sanktion (stattdessen: Kürzung um … %, wenn …)"],
  [/\b(z\. ?B\.|bzw\.|ggf\.|u\. ?a\.|d\. ?h\.|i\. ?d\. ?R\.|inkl\.|ca\.)/, "Abkürzung"],
  [/\b(du bekommst|ihr bekommt)\s+\d/i, "Einzelfallprognose mit Betrag"],
  [/\bwird (von )?(dir|dich|euch)\b/i, "Einzelfallprognose (wird von dir …)"],
  [/\bdu wirst\b/i, "Einzelfallprognose (du wirst …)"],
];

type MitTexten = { id: string; text: string; textLeicht?: string; titel?: string };

const alleTexte: { datei: string; eintrag: MitTexten }[] = [
  ...katalog.karten.map((eintrag) => ({ datei: "katalog.json", eintrag })),
  ...einordnung.eintraege.map((eintrag) => ({ datei: "einordnung.json", eintrag })),
  ...schritte.schritte.map((eintrag) => ({ datei: "naechste-schritte.json", eintrag })),
];

function mitBeispielwerten(text: string): string {
  return text.replace(/\{([^}]+)\}/g, (_, name: string) => BEISPIELWERTE[name] ?? `{${name}}`);
}

describe("Daten laden", () => {
  it("alle vier Dateien sind gültig und vollständig geladen", () => {
    expect(FOLGEN.karten).toHaveLength(katalog.karten.length);
    expect(FOLGEN.einordnung).toHaveLength(einordnung.eintraege.length);
    expect(FOLGEN.schritte).toHaveLength(schritte.schritte.length);
    expect(FOLGEN.unterlagen).toHaveLength(unterlagen.unterlagen.length);
  });

  it("jede id kommt über alle Dateien nur einmal vor", () => {
    const ids = [...FOLGEN.karten, ...FOLGEN.einordnung, ...FOLGEN.schritte, ...FOLGEN.unterlagen].map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each([
    ["unbekannter Status", { status: "fertig" }, /Status/],
    ["leere Fundstelle", { fundstelle: " " }, /Fundstelle/],
    ["kein Datum", { gueltigAb: "1.7.2026" }, /gueltigAb/],
    ["unbekannter Weg", { weg: "C" }, /Weg/],
    ["unbekannte Art", { art: "warnung" }, /Art/],
    ["Quelle ohne https", { quelle: ["http://example.org"] }, /Quelle/],
    ["unbekannter Platzhalter", { text: "Es sind {kiz.irgendwas}." }, /kiz\.irgendwas/],
    ["unbekannter Fakt in der Bedingung", { bedingung: { fakt: "kinder.anzahl", ab: 1 } }, /kinder\.anzahl/],
    ["geprueft ohne geprueftAm", { status: "geprueft", geprueftAm: undefined }, /geprueftAm/],
  ])("Laden scheitert bei %s", (_, aenderung, meldung) => {
    const [erste, ...rest] = katalog.karten;
    const kaputt = { ...katalog, karten: [{ ...erste, ...aenderung }, ...rest] };
    expect(() => ladeFolgen({ katalog: kaputt, einordnung, schritte, unterlagen })).toThrow(meldung);
  });

  it("Laden scheitert bei doppelter id mit gleichem gueltigAb", () => {
    const kaputt = { ...katalog, karten: [...katalog.karten, katalog.karten[0]] };
    expect(() => ladeFolgen({ katalog: kaputt, einordnung, schritte, unterlagen })).toThrow(/doppelt/);
  });

  it("Laden scheitert bei einer Dauer ohne Fundstelle", () => {
    const [erster, ...rest] = schritte.schritte;
    const kaputt = { ...schritte, schritte: [{ ...erster, dauer: { minuten: 20, fundstelle: null, status: "geprueft" } }, ...rest] };
    expect(() => ladeFolgen({ katalog, einordnung, schritte: kaputt, unterlagen })).toThrow(/Dauer/);
  });
});

describe("Fundstellen", () => {
  it("jeder Eintrag mit Status geprueft hat eine Quelle zum Nachlesen", () => {
    const ohneQuelle = [...FOLGEN.karten, ...FOLGEN.einordnung, ...FOLGEN.schritte, ...FOLGEN.unterlagen]
      .filter((e) => e.status === "geprueft" && e.quelle.length === 0)
      .map((e) => e.id);
    expect(ohneQuelle).toEqual([]);
  });

  it("Einträge mit Status pruefen oder geplant sagen in der Notiz oder Fundstelle, warum", () => {
    const ohneGrund = FOLGEN.karten
      .filter((k) => k.status !== "geprueft" && k.notiz === undefined && !/nicht beschlossen|nicht im Original/.test(k.fundstelle))
      .map((k) => k.id);
    expect(ohneGrund).toEqual([]);
  });
});

describe("Texte (Skill texte-schreiben, Fachkonzept)", () => {
  for (const { datei, eintrag } of alleTexte) {
    for (const feld of ["text", "textLeicht"] as const) {
      const roh = eintrag[feld];
      if (roh === undefined) continue;
      const text = mitBeispielwerten(roh);

      it(`${datei} ${eintrag.id}.${feld}: Amstad mindestens ${AMSTAD_MINDESTENS}`, () => {
        expect(lesbarkeit(text).amstad).toBeGreaterThanOrEqual(AMSTAD_MINDESTENS);
      });

      it(`${datei} ${eintrag.id}.${feld}: jeder Satz unter 15 Wörtern`, () => {
        const zuLang = saetze(text).filter((s) => woerter(s).length > SATZ_HOECHSTENS_WOERTER);
        expect(zuLang).toEqual([]);
      });
    }

    it(`${datei} ${eintrag.id}: keine verbotenen Wörter, Kürzel oder Prognosen`, () => {
      const gefunden = [eintrag.titel ?? "", eintrag.text, eintrag.textLeicht ?? ""].flatMap((t) =>
        VERBOTEN.filter(([muster]) => muster.test(t)).map(([, name]) => name),
      );
      expect(gefunden).toEqual([]);
    });
  }

  it("Titel haben höchstens 6 Wörter", () => {
    const zuLang = [...katalog.karten, ...schritte.schritte]
      .filter((e) => woerter(e.titel).length > TITEL_HOECHSTENS_WOERTER)
      .map((e) => e.id);
    expect(zuLang).toEqual([]);
  });

  it("Leichte Sprache trennt lange Wörter mit Bindestrich, nicht mit Mediopunkt (Entscheidung von Nico am 28.10.2026)", () => {
    const mitMediopunkt = alleTexte.filter(({ eintrag }) => eintrag.textLeicht?.includes("·")).map(({ eintrag }) => eintrag.id);
    expect(mitMediopunkt).toEqual([]);
  });

  it("Unterlagen: kurz und ohne verbotene Wörter", () => {
    const probleme = unterlagen.unterlagen.flatMap((u) => [
      ...(woerter(u.text).length > SATZ_HOECHSTENS_WOERTER ? [`${u.id}: zu lang`] : []),
      ...VERBOTEN.filter(([muster]) => muster.test(u.text)).map(([, name]) => `${u.id}: ${name}`),
    ]);
    expect(probleme).toEqual([]);
  });

  it("jeder Platzhalter in den Texten ist bekannt und hat einen Beispielwert für die Messung", () => {
    const genutzt = new Set(
      alleTexte.flatMap(({ eintrag }) =>
        [eintrag.titel ?? "", eintrag.text, eintrag.textLeicht ?? ""].flatMap((t) => [...t.matchAll(/\{([^}]+)\}/g)].map((m) => m[1])),
      ),
    );
    for (const name of genutzt) {
      expect(Object.keys(PLATZHALTER)).toContain(name);
      expect(Object.keys(BEISPIELWERTE)).toContain(name);
    }
  });
});

describe("Reihenfolge (Fachkonzept, Darstellung in der App)", () => {
  it("bei Weg A und B stehen Kinderbetreuung und Partner vor allen anderen Karten", () => {
    for (const weg of ["A", "B"] as const) {
      const karten = FOLGEN.karten.filter((k) => k.weg === weg);
      const familie = karten.filter((k) => k.thema === "kinderbetreuung" || k.thema === "partner");
      const andere = karten.filter((k) => k.thema !== "kinderbetreuung" && k.thema !== "partner");
      expect(Math.max(...familie.map((k) => k.prioritaet))).toBeLessThan(Math.min(...andere.map((k) => k.prioritaet)));
    }
  });

  it("die Karte zur Reihenfolge der Anträge steht für beide Wege ganz oben (Entscheidung von Nico am 28.10.2026)", () => {
    const beide = FOLGEN.karten.filter((k) => k.weg === "beide").sort((a, b) => a.prioritaet - b.prioritaet);
    expect(beide[0]?.id).toBe("beide_reihenfolge");
  });

  it("hervorgehoben wird nur die Karte zur Reihenfolge der Anträge, über ein eigenes Feld (Nico, 28.10.2026)", () => {
    expect(FOLGEN.karten.filter((k) => k.hervorheben).map((k) => k.id)).toEqual(["beide_reihenfolge"]);
  });
});

describe("Feld hervorheben", () => {
  const karte = katalog.karten.find((k) => k.id === "beide_reihenfolge");

  it("fehlt es, ist die Karte nicht hervorgehoben", () => {
    const ohne = katalog.karten.find((k) => k.id === "a_zustaendig");
    const geladen = ladeFolgen({ katalog: { karten: [ohne] }, einordnung, schritte, unterlagen });
    expect(geladen.karten[0]?.hervorheben).toBe(false);
  });

  it("muss true oder false sein", () => {
    const falsch = { karten: [{ ...karte, hervorheben: "ja" }] };
    expect(() => ladeFolgen({ katalog: falsch, einordnung, schritte, unterlagen })).toThrow(/hervorheben/);
  });
});
