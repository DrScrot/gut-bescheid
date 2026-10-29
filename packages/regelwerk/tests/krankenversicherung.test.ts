// Mindestbeitrag einer freiwilligen Kranken- und Pflegeversicherung ohne eigenes Einkommen (M4, Karte zur
// Krankenversicherung, Nico 28.10.2026). Von Hand gerechnet am 29.10.2026 mit den Werten von 2026:
// beitragspflichtig mindestens 3.955 € ÷ 90 je Tag × 30 Tage = 1.318,33 € (§ 240 Abs. 4 Satz 1, § 223 Abs. 2 SGB V).
// Kranken- und Pflegeversicherung je auf Cent gerundet; vom rechts-pruefer am 29.10.2026 nachgerechnet.
import { describe, expect, it } from "vitest";
import { mindestbeitragFreiwillig } from "../src/krankenversicherung";
import { rechtsstandZumStichtag } from "../src/parameter";

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
