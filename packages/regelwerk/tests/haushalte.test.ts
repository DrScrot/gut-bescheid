// Testhaushalte T01–T10 aus dem Fachkonzept. M2: SGB-II-Bedarf und Freibetrag auf den Cent.
// M3: Wohngeld auf ± 1 € zum amtlichen Rechner, KiZ-Anspruch wie der KiZ-Lotse, Vergleich der Wege.
import { describe, expect, it } from "vitest";
import { berechne, berechneSgb2, schaetzeAbzuege, rechtsstandZumStichtag } from "../src/index";
import { testhaushalte } from "./testhaushalte";

// Erfolgskriterium im Fachkonzept: höchstens 1 € Abweichung pro Monat.
const TOLERANZ_CENT = 100;

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

      const pruefen = soll.pruefen ?? [];
      it(pruefen.length === 0 ? "kein Parameter mit Status pruefen oder geplant eingeflossen" : `ungeprüft nur: ${pruefen.join(", ")}`, () => {
        expect(ergebnis().parameterHinweise.map((h) => h.name)).toEqual(pruefen);
      });
    });
  }
});

describe("Testhaushalte Weg B und Vergleich", () => {
  for (const t of testhaushalte) {
    const { eingabe } = t;
    const { wohngeld, kiz, vergleich } = t.soll;
    if (eingabe === null || wohngeld === null || kiz === null || vergleich === null) {
      it.todo(`${t.id}: Sollwerte für M3 fehlen`);
      continue;
    }

    describe(`${t.id}: ${t.haushalt}`, () => {
      const ergebnis = () => {
        const e = berechne(eingabe, { stichtag: t.stichtag });
        if (!e.imUmfang) throw new Error(`${t.id} liegt außerhalb des Umfangs: ${e.gruende.join(", ")}`);
        return e;
      };

      it(`Wohngeld ${wohngeld.betrag / 100} € (amtlich), höchstens 1 € Abweichung`, () => {
        expect(Math.abs(ergebnis().wohngeld.betrag - wohngeld.betrag)).toBeLessThanOrEqual(TOLERANZ_CENT);
      });

      it(`Abzüge nach § 16 WoGG wie im Rechner: ${wohngeld.abzuegeImRechner.join(", ")}`, () => {
        const p = rechtsstandZumStichtag(t.stichtag).wohngeld;
        const gefunden = eingabe.erwachsene
          .filter((e) => e.brutto > 0)
          .map((e) => schaetzeAbzuege(e.brutto, e.netto, p));
        for (const abzuege of gefunden) {
          const arten = (["steuer", "kvpv", "rv"] as const).filter((art) => abzuege[art]);
          expect(arten).toEqual(wohngeld.abzuegeImRechner);
        }
      });

      it(`KiZ: ${kiz.anspruch}`, () => {
        expect(ergebnis().kiz.anspruch).toBe(kiz.anspruch);
      });

      if (kiz.betrag !== null) {
        const betrag = kiz.betrag;
        it(`KiZ rechnerisch ${betrag / 100} € (berechnet)`, () => {
          expect(ergebnis().kiz.betrag).toBe(betrag);
        });
      }

      if (kiz.fehlbetrag !== undefined) {
        const fehlbetrag = kiz.fehlbetrag;
        it(`mit KiZ und Wohngeld fehlen ${fehlbetrag / 100} €`, () => {
          expect(ergebnis().kiz.bedarfspruefung.fehlbetrag).toBe(fehlbetrag);
        });
      }

      // T08 ist die dokumentierte Ausnahme: Der Lotse sagt „ja“, das Regelwerk „nein“ (siehe T08.json).
      if (kiz.anspruchLotse !== null) {
        const lotse = kiz.anspruchLotse;
        const ausnahme = t.id === "T08";
        it(ausnahme ? "KiZ-Anspruch weicht vom Lotsen ab (dokumentiert)" : `KiZ-Anspruch wie Lotse: ${lotse ? "ja" : "nein"}`, () => {
          const regelwerk = ["ja", "erweiterter_zugang"].includes(ergebnis().kiz.anspruch);
          expect(regelwerk).toBe(ausnahme ? !lotse : lotse);
          if (ausnahme) expect(t.abweichungen?.length).toBeGreaterThan(0);
        });
      }

      it(`Vergleich: ${vergleich.ergebnis}`, () => {
        expect(ergebnis().ergebnis).toBe(vergleich.ergebnis);
      });

      if (vergleich.fehlbetrag !== null) {
        const fehlbetrag = vergleich.fehlbetrag;
        it(`Fehlbetrag Weg B: ${fehlbetrag / 100} €`, () => {
          expect(ergebnis().wegB.fehlbetrag).toBe(fehlbetrag);
        });
      }

      it("ungeprüfte Werte: Vermögensgrenze Wohngeld, Abzüge-Schätzung, Zuständigkeit Weg A und was T*.json nennt", () => {
        expect(ergebnis().parameterHinweise.map((h) => h.name).sort()).toEqual(
          ["but.zustaendigWegA", "wohngeld.abzuegeSchaetzung", "wohngeld.vermoegensgrenze", ...(t.soll.sgb2?.pruefen ?? [])].sort(),
        );
      });
    });
  }
});
