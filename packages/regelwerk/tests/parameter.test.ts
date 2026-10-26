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
      for (const [name, p] of Object.entries(stand.sgb2)) {
        it(`sgb2.${name} hat Wert, Fundstelle, gültig ab und Status`, () => {
          expect(p.wert).toBeDefined();
          expect(p.fundstelle.trim()).not.toBe("");
          expect(p.gueltigAb).toMatch(DATUM);
          expect(p.gueltigAb <= stand.gueltigAb).toBe(true);
          expect(STATUS).toContain(p.status);
          if (p.status === "geprueft") expect(p.geprueftAm).toMatch(DATUM);
        });
      }
    });
  }

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
