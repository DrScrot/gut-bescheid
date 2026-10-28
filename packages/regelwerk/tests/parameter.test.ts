import { describe, expect, it } from "vitest";
import { RECHTSSTAENDE, rechtsstandZumStichtag } from "../src/parameter";

const STATUS = ["geprueft", "aus_quelle", "pruefen", "geplant"];
const DATUM = /^\d{4}-\d{2}-\d{2}$/;

describe("Rechtsstand per Stichtag", () => {
  it("nimmt den Stand ab 1.7.2026 für Stichtage ab diesem Tag", () => {
    expect(rechtsstandZumStichtag("2026-07-01").gueltigAb).toBe("2026-07-01");
    expect(rechtsstandZumStichtag("2026-10-26").gueltigAb).toBe("2026-07-01");
    expect(rechtsstandZumStichtag("2026-12-31").gueltigAb).toBe("2026-07-01");
  });

  it("nimmt ab 1.1.2027 den fortgeschriebenen Stand, auch für spätere Jahre", () => {
    expect(rechtsstandZumStichtag("2027-01-01").gueltigAb).toBe("2027-01-01");
    expect(rechtsstandZumStichtag("2030-06-01").gueltigAb).toBe("2027-01-01");
  });

  it("meldet einen klaren Fehler vor dem frühesten Stand", () => {
    expect(() => rechtsstandZumStichtag("2026-06-30")).toThrow(/Kein Rechtsstand/);
  });

  it("lehnt Stichtage im falschen Format ab", () => {
    expect(() => rechtsstandZumStichtag("26.10.2026")).toThrow(/Stichtag/);
    expect(() => rechtsstandZumStichtag("2026-13-01")).toThrow(/Stichtag/);
  });
});

describe("Parameterdateien", () => {
  for (const stand of RECHTSSTAENDE) {
    describe(`Stand ${stand.gueltigAb}`, () => {
      const teile = { sgb2: stand.sgb2, kiz: stand.kiz, wohngeld: stand.wohngeld, but: stand.but };
      for (const [teil, parameter] of Object.entries(teile)) {
        for (const [name, p] of Object.entries(parameter)) {
          it(`${teil}.${name} hat Wert, Fundstelle, gültig ab und Status`, () => {
            expect(p.wert).toBeDefined();
            expect(p.fundstelle.trim()).not.toBe("");
            expect(p.gueltigAb).toMatch(DATUM);
            expect(p.gueltigAb <= stand.gueltigAb).toBe(true);
            expect(STATUS).toContain(p.status);
            if (p.status === "geprueft") expect(p.geprueftAm).toMatch(DATUM);
          });
        }
      }
    });
  }

  it("KiZ-Rundung: kaufmännisch auf den Gesamtbetrag, geprüft (freigegeben von Nico am 28.10.2026)", () => {
    const { rundung } = rechtsstandZumStichtag("2026-07-01").kiz;
    expect(rundung).toMatchObject({ wert: "kaufmaennisch_euro_gesamt", status: "geprueft" });
    expect(rundung.fundstelle).toContain("§ 11 Abs. 2 BKGG");
    expect(rundung.fundstelle).toContain("DA-KiZ E.5 Abs. 2");
  });

  it("Wohnkostenanteile ab 3 Kindern: Paar 62/55/50 %, alleinerziehend 53/46/40 %, geprüft", () => {
    const { wohnkostenanteilEltern } = rechtsstandZumStichtag("2026-07-01").kiz;
    expect(wohnkostenanteilEltern.status).toBe("geprueft");
    expect(wohnkostenanteilEltern.wert.paar.slice(0, 5)).toEqual([83, 71, 62, 55, 50]);
    expect(wohnkostenanteilEltern.wert.alleinerziehend.slice(0, 5)).toEqual([77, 63, 53, 46, 40]);
  });

  it("Wohngeld 2027: geänderte Werte aus BT-Drs. 21/8284 mit Status geplant", () => {
    const stand2027 = rechtsstandZumStichtag("2027-01-01");
    // Höchstbeträge und Mindestwerte blieben nur mit dem Entwurf gleich (§ 43 Abs. 11 WoGG neu).
    for (const name of [
      "hoechstbetraege",
      "heizkostenentlastung",
      "formelwerte",
      "mindestwerte",
      "obergrenzeMiete",
      "werbungskostenMinijob",
      "mindestbetrag",
      "vermoegensgrenze",
    ] as const) {
      expect(stand2027.wohngeld[name].status).toBe("geplant");
      expect(stand2027.wohngeld[name].fundstelle).toContain("BT-Drs. 21/8284");
    }
    expect(stand2027.mietenstufen.status).toBe("geplant");
  });

  it("KiZ 2027: Höchstbetrag 272 € nach BT-Drs. 21/7860 Art. 7 mit Status geplant, wie das Wohngeld", () => {
    const { hoechstbetrag } = rechtsstandZumStichtag("2027-01-01").kiz;
    expect(hoechstbetrag).toMatchObject({ wert: 27200, status: "geplant", gueltigAb: "2027-01-01" });
    expect(hoechstbetrag.fundstelle).toContain("BT-Drs. 21/7860");
    expect(rechtsstandZumStichtag("2026-07-01").kiz.hoechstbetrag).toMatchObject({ wert: 29700, status: "geprueft" });
  });

  it("Geplante Wohngeld-Werte nennen die Empfehlung der Bundesrats-Ausschüsse", () => {
    const geplant = Object.values(rechtsstandZumStichtag("2027-01-01").wohngeld).filter((p) => p.status === "geplant");
    expect(geplant.length).toBeGreaterThan(0);
    for (const p of geplant) expect(p.hinweis).toContain("BR-Drs. 474/1/26");
    expect(rechtsstandZumStichtag("2027-01-01").mietenstufen.fundstelle).toContain("BR-Drs. 474/1/26");
  });

  it("Wohngeld 2026: kein Wert mit Status geplant", () => {
    const stand2026 = rechtsstandZumStichtag("2026-07-01");
    expect(Object.values(stand2026.wohngeld).filter((p) => p.status === "geplant")).toEqual([]);
    expect(stand2026.mietenstufen.status).toBe("aus_quelle");
  });

  it("Rundung nach § 41 Abs. 2 SGB II steht auf pruefen (Fachkonzept)", () => {
    const { rundung } = rechtsstandZumStichtag("2026-07-01").sgb2;
    expect(rundung.status).toBe("pruefen");
    expect(rundung.fundstelle).toContain("§ 41 Abs. 2 SGB II");
  });

  it.each(["2026-07-01", "2027-01-01"])(
    "Versicherungspauschale (Stand %s): 30 €, § 6 Abs. 1 Nr. 1 GrusiGV, geprüft am 26.10.2026",
    (stichtag) => {
      const { versicherungspauschale } = rechtsstandZumStichtag(stichtag).sgb2;
      expect(versicherungspauschale).toMatchObject({ wert: 3000, status: "geprueft", geprueftAm: "2026-10-26" });
      expect(versicherungspauschale.fundstelle).toContain("§ 6 Abs. 1 Nr. 1 GrusiGV");
    },
  );

  it("Stand 2027: Regelbedarfe und Kindergeld wie 2026, aber mit Status pruefen", () => {
    const stand2026 = rechtsstandZumStichtag("2026-07-01");
    const stand2027 = rechtsstandZumStichtag("2027-01-01");
    for (const name of ["regelbedarfStufe1", "regelbedarfStufe2", "regelbedarfKinder", "kindergeld"] as const) {
      expect(stand2027.sgb2[name].wert).toEqual(stand2026.sgb2[name].wert);
      expect(stand2027.sgb2[name].status).toBe("pruefen");
      expect(stand2027.sgb2[name].gueltigAb).toBe("2027-01-01");
    }
    expect(stand2027.sgb2.kindergeld.wert).toBe(25900);
  });

  it("Stand 2027 trägt den Hinweis auf die offenen Regelsätze, 2026 nicht", () => {
    expect(rechtsstandZumStichtag("2027-01-01").hinweise).toEqual(["regelsaetze_offen"]);
    expect(rechtsstandZumStichtag("2026-07-01").hinweise).toEqual([]);
  });
});
