import { describe, expect, it } from "vitest";
import { RECHTSSTAENDE, rechtsstandZumStichtag } from "../src/parameter";

const STATUS = ["geprueft", "aus_quelle", "pruefen", "geplant"];
const DATUM = /^\d{4}-\d{2}-\d{2}$/;

describe("Rechtsstand per Stichtag", () => {
  it("nimmt den Stand ab 1.7.2026 für Stichtage ab diesem Tag", () => {
    expect(rechtsstandZumStichtag("2026-07-01").gueltigAb).toBe("2026-07-01");
    expect(rechtsstandZumStichtag("2026-10-26").gueltigAb).toBe("2026-07-01");
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
});
