// Testhaushalte T01–T10 aus dem Fachkonzept. M2 prüft SGB-II-Bedarf und Freibetrag auf den Cent.
import { describe, expect, it } from "vitest";
import { berechneSgb2 } from "../src/index";
import { testhaushalte } from "./testhaushalte";

describe("Testhaushalte SGB II", () => {
  it("es gibt genau T01 bis T10", () => {
    expect(testhaushalte.map((t) => t.id)).toEqual([
      "T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09", "T10",
    ]);
  });

  for (const t of testhaushalte) {
    const { eingabe } = t;
    const soll = t.soll.sgb2;
    if (eingabe === null || soll === null) {
      it.todo(`${t.id}: ${t.offen ?? "Eingaben fehlen"}`);
      continue;
    }

    describe(`${t.id}: ${t.haushalt}`, () => {
      const ergebnis = () => {
        const e = berechneSgb2(eingabe, { stichtag: t.stichtag });
        if (!e.imUmfang) throw new Error(`${t.id} liegt außerhalb des Umfangs: ${e.gruende.join(", ")}`);
        return e;
      };

      if (soll.bedarf !== null) {
        const bedarf = soll.bedarf;
        it(`Bedarf ${bedarf} Cent`, () => {
          expect(ergebnis().bedarf.summe).toBe(bedarf);
        });
      }

      it(`Freibetrag ${soll.freibetrag} Cent`, () => {
        expect(ergebnis().einkommen.freibetrag).toBe(soll.freibetrag);
      });

      if (soll.vermoegensfreibetrag !== undefined) {
        const freibetrag = soll.vermoegensfreibetrag;
        it(`Vermögensfreibetrag ${freibetrag} Cent`, () => {
          expect(ergebnis().vermoegen.freibetrag).toBe(freibetrag);
        });
      }

      if (soll.anspruch !== undefined) {
        const anspruch = soll.anspruch;
        it(`Anspruch: ${anspruch}`, () => {
          expect(ergebnis().anspruch).toBe(anspruch);
        });
      }

      it("kein Parameter mit Status pruefen oder geplant eingeflossen", () => {
        expect(ergebnis().parameterHinweise).toEqual([]);
      });
    });
  }
});
