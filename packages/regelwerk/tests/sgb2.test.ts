// Randfälle der SGB-II-Rechnung. Erwartete Werte sind aus den geprüften Parametern
// im Fachkonzept von Hand vorgerechnet.
import { describe, expect, it } from "vitest";
import { berechneSgb2 } from "../src/index";
import type { Erwachsener, Haushalt, Kind } from "../src/index";
import { testhaushalt } from "./testhaushalte";

const STICHTAG = "2026-07-01";

function erwachsener(teil: Partial<Erwachsener> = {}): Erwachsener {
  return { alter: 35, brutto: 0, netto: 0, sonstigesEinkommen: 0, ...teil };
}

function kind(jahre: number, einkommen = 0): Kind {
  return { alter: { jahre, monate: 0 }, einkommen };
}

// Alleinerziehend, ein Kind von 3 Jahren, Wohnkosten 700 €, kein Einkommen, kein Erspartes.
function haushalt(teil: Partial<Haushalt> = {}): Haushalt {
  return {
    gemeinde: "Testort",
    erwachsene: [erwachsener()],
    kinder: [kind(3)],
    kaltmiete: 50000,
    nebenkosten: 10000,
    heizkosten: 10000,
    vermoegen: { von: 0, bis: 0 },
    ...teil,
  };
}

function rechne(h: Haushalt, stichtag = STICHTAG) {
  const e = berechneSgb2(h, { stichtag });
  if (!e.imUmfang) throw new Error(`außerhalb des Umfangs: ${e.gruende.join(", ")}`);
  return e;
}

describe("Lücke A (von Hand vorgerechnet, von Nico bestätigt am 26.10.2026)", () => {
  const faelle: [string, number][] = [
    ["T01", 90900],
    ["T02", 152900],
    ["T03", 74168],
    ["T04", 173700],
    ["T05", 89700],
    ["T06", 76100],
    ["T08", 95800],
    ["T09", -28600],
    ["T10", 63600],
  ];
  it.each(faelle)("%s: %i Cent", (id, luecke) => {
    expect(rechne(testhaushalt(id).eingabe).lueckeA).toBe(luecke);
  });

  it("Bedarf T09 mit Kindern 14 und 16: 2.954 €", () => {
    expect(rechne(testhaushalt("T09").eingabe).bedarf.summe).toBe(295400);
  });
});

describe("Anspruch", () => {
  it("besteht, wenn Lücke A positiv ist und das Ersparte unter dem Freibetrag liegt", () => {
    expect(rechne(testhaushalt("T01").eingabe).anspruch).toBe("ja");
  });

  it("besteht nicht, wenn Lücke A genau 0 ist", () => {
    // Bedarf: 563 + 390 + 12 % von 563 (67,56) + 500 = 1.520,56 €
    const h = haushalt({
      erwachsene: [erwachsener({ sonstigesEinkommen: 126156 })],
      kinder: [kind(10)],
      kaltmiete: 50000,
      nebenkosten: 0,
      heizkosten: 0,
    });
    const e = rechne(h);
    expect(e.bedarf.summe).toBe(152056);
    expect(e.lueckeA).toBe(0);
    expect(e.anspruch).toBe("nein_einkommen");
  });
});

describe("Regelbedarfe", () => {
  it("Paar: zweimal Stufe 2", () => {
    const e = rechne(haushalt({ erwachsene: [erwachsener(), erwachsener()], kinder: [kind(5)] }));
    expect(e.bedarf.regelbedarfe).toBe(50600 + 50600 + 35700);
  });

  it("alleinerziehend: Stufe 1", () => {
    expect(rechne(haushalt({ kinder: [kind(5)] })).bedarf.regelbedarfe).toBe(56300 + 35700);
  });

  it.each([
    [0, 35700],
    [5, 35700],
    [6, 39000],
    [13, 39000],
    [14, 47100],
    [17, 47100],
  ])("Kind mit %i Jahren: %i Cent", (jahre, cent) => {
    expect(rechne(haushalt({ kinder: [kind(jahre)] })).bedarf.regelbedarfe).toBe(56300 + cent);
  });
});

describe("Mehrbedarf Alleinerziehende (§ 21 Abs. 3 SGB II)", () => {
  it.each([
    ["ein Kind unter 7", [3], 20268],
    ["ein Kind von 6", [6], 20268],
    ["ein Kind von 7: 12 %", [7], 6756],
    ["ein Kind von 10: 12 %", [10], 6756],
    ["zwei Kinder unter 16", [8, 10], 20268],
    ["zwei Kinder ab 16: 24 %", [16, 17], 13512],
    ["drei Kinder unter 16", [8, 10, 12], 20268],
    ["vier Kinder: 48 % statt 36 %", [2, 8, 10, 12], 27024],
    ["sechs Kinder: höchstens 60 %", [1, 3, 5, 7, 9, 11], 33780],
  ])("%s", (_, alter, cent) => {
    const e = rechne(haushalt({ kinder: alter.map((j) => kind(j)) }));
    expect(e.bedarf.mehrbedarfAlleinerziehend).toBe(cent);
  });

  it("gilt nicht für Paare", () => {
    const e = rechne(haushalt({ erwachsene: [erwachsener(), erwachsener()] }));
    expect(e.bedarf.mehrbedarfAlleinerziehend).toBe(0);
  });
});

describe("Wohnkosten", () => {
  it("zählen in voller Höhe: Kaltmiete + Nebenkosten + Heizung", () => {
    const e = rechne(haushalt({ kaltmiete: 55000, nebenkosten: 12000, heizkosten: 8000 }));
    expect(e.bedarf.wohnkosten).toBe(75000);
  });

  it("tragen immer den Hinweis auf die Angemessenheit", () => {
    const e = rechne(testhaushalt("T01").eingabe);
    expect(e.hinweise).toContainEqual({ code: "wohnkosten_angemessenheit" });
  });
});

describe("Freibetrag bei Erwerbstätigkeit (§ 11b Abs. 2 und 3 SGB II)", () => {
  it.each([
    [0, 0],
    [5000, 5000],
    [10000, 10000],
    [52000, 18400],
    [100000, 32800],
    [120000, 34800],
    [150000, 37800],
    [200000, 37800],
  ])("Brutto %i Cent: Freibetrag %i Cent", (brutto, freibetrag) => {
    const e = rechne(haushalt({ erwachsene: [erwachsener({ brutto, netto: brutto })] }));
    expect(e.einkommen.freibetrag).toBe(freibetrag);
    expect(e.parameterHinweise).toEqual([]);
  });

  it("teilt sich in Grundabsetzbetrag und Erwerbstätigenfreibetrag", () => {
    const e = rechne(haushalt({ erwachsene: [erwachsener({ brutto: 240000, netto: 175000 })] }));
    expect(e.einkommen.erwachsene[0]).toMatchObject({
      grundabsetzbetrag: 10000,
      erwerbstaetigenfreibetrag: 27800,
      freibetrag: 37800,
      bereinigtesErwerbseinkommen: 137200,
    });
  });

  it("rundet Bruchteile von Cent und meldet die Rundung (Status pruefen)", () => {
    // 20 % von 420 € + 30 % von 480 € + 10 % von 234,56 € = 84 + 144 + 23,456 → 251,46 €
    const e = rechne(haushalt({ erwachsene: [erwachsener({ brutto: 123456, netto: 100000 })] }));
    expect(e.einkommen.freibetrag).toBe(10000 + 25146);
    expect(e.parameterHinweise).toEqual([
      { name: "sgb2.rundung", status: "pruefen", fundstelle: expect.stringContaining("§ 41 Abs. 2 SGB II") },
    ]);
  });

  it("rundet unter einem halben Cent ab", () => {
    const e = rechne(haushalt({ erwachsene: [erwachsener({ brutto: 123454, netto: 100000 })] }));
    expect(e.einkommen.freibetrag).toBe(10000 + 25145);
  });

  it("gilt je erwerbstätiger Person", () => {
    const e = rechne(
      haushalt({
        erwachsene: [
          erwachsener({ brutto: 240000, netto: 175000 }),
          erwachsener({ brutto: 52000, netto: 52000 }),
        ],
      }),
    );
    expect(e.einkommen.freibetrag).toBe(37800 + 18400);
  });

  it("zieht höchstens das Netto ab, der Rest geht nicht auf anderes Einkommen über", () => {
    const e = rechne(
      haushalt({ erwachsene: [erwachsener({ brutto: 5000, netto: 5000, sonstigesEinkommen: 20000 })] }),
    );
    expect(e.einkommen.erwachsene[0]).toMatchObject({ grundabsetzbetrag: 5000, bereinigtesErwerbseinkommen: 0 });
    expect(e.einkommen.summe).toBe(20000 + 25900);
  });
});

describe("Einkommen", () => {
  it("zählt Kindergeld mit 259 € je Kind", () => {
    expect(rechne(testhaushalt("T05").eingabe).einkommen.kindergeld).toBe(77700);
  });

  it("zählt Einkommen des Kindes voll", () => {
    const e = rechne(testhaushalt("T03").eingabe);
    expect(e.einkommen.kindeseinkommen).toBe(23000);
    expect(e.einkommen.summe).toBe(113100);
  });

  it("zählt sonstiges Einkommen voll (offener Punkt: Abzüge)", () => {
    const t02 = testhaushalt("T02").eingabe;
    const mitElterngeld: Haushalt = {
      ...t02,
      erwachsene: [t02.erwachsene[0]!, erwachsener({ sonstigesEinkommen: 30000 })],
    };
    expect(rechne(mitElterngeld).lueckeA).toBe(152900 - 30000);
  });
});

describe("Vermögen (§ 12 SGB II)", () => {
  it.each([
    [29, 500000],
    [30, 1000000],
    [39, 1000000],
    [40, 1250000],
    [49, 1250000],
    [50, 2000000],
  ])("Erwachsener mit %i Jahren: %i Cent, dazu 5.000 € für das Kind", (alter, cent) => {
    const e = rechne(haushalt({ erwachsene: [erwachsener({ alter })] }));
    expect(e.vermoegen.freibetrag).toBe(cent + 500000);
  });

  it.each([
    ["unter dem Freibetrag", { von: 0, bis: 999999 }, "unter_freibetrag", "ja"],
    ["genau auf dem Freibetrag", { von: 1500000, bis: 1500000 }, "unter_freibetrag", "ja"],
    ["einen Cent darüber", { von: 1500001, bis: 1500001 }, "ueber_freibetrag", "nein_vermoegen"],
    ["Spanne über den Freibetrag hinweg", { von: 1000000, bis: 3999999 }, "unklar", "unklar_vermoegen"],
    ["nach oben offen, ab 70.000 €", { von: 7000000, bis: null }, "ueber_freibetrag", "nein_vermoegen"],
    ["nach oben offen, ab 0 €", { von: 0, bis: null }, "unklar", "unklar_vermoegen"],
  ] as const)("%s", (_, vermoegen, ergebnis, anspruch) => {
    // Freibetrag: 10.000 € (35 Jahre) + 5.000 € (Kind) = 15.000 €
    const e = rechne(haushalt({ vermoegen }));
    expect(e.vermoegen.freibetrag).toBe(1500000);
    expect(e.vermoegen.ergebnis).toBe(ergebnis);
    expect(e.anspruch).toBe(anspruch);
  });

  it("lehnt eine Spanne ab, deren Ende vor dem Anfang liegt", () => {
    expect(() => rechne(haushalt({ vermoegen: { von: 100, bis: 50 } }))).toThrow(/vermoegen/);
  });
});

describe("Umfang", () => {
  it("Kind ab 18: außerhalb des Umfangs", () => {
    const e = berechneSgb2(haushalt({ kinder: [kind(4), kind(18)] }), { stichtag: STICHTAG });
    expect(e).toMatchObject({ imUmfang: false, gruende: ["kind_ab_18"] });
  });

  it("ohne Kind: außerhalb des Umfangs", () => {
    const e = berechneSgb2(haushalt({ kinder: [] }), { stichtag: STICHTAG });
    expect(e).toMatchObject({ imUmfang: false, gruende: ["kein_kind"] });
  });
});

describe("Kindeseinkommen über dem Bedarf des Kindes", () => {
  it("gibt den Hinweis „Rechnung vereinfacht“", () => {
    // Kind 15: Bedarf 471 € + Kopfteil Wohnkosten 300 € = 771 €. Einkommen 259 € + 600 € = 859 €.
    const e = rechne(haushalt({ kinder: [kind(15, 60000)], kaltmiete: 40000 }));
    expect(e.hinweise).toContainEqual({
      code: "rechnung_vereinfacht",
      grund: "kindeseinkommen_ueber_bedarf",
      kind: 0,
    });
  });

  it("gibt ihn nicht, wenn das Einkommen den Bedarf nicht übersteigt (T03)", () => {
    const e = rechne(testhaushalt("T03").eingabe);
    expect(e.hinweise.map((h) => h.code)).not.toContain("rechnung_vereinfacht");
  });
});

describe("Eingaben und Stichtag", () => {
  it("nennt Stichtag und Rechtsstand im Ergebnis", () => {
    const e = rechne(testhaushalt("T01").eingabe, "2026-10-26");
    expect(e.stichtag).toBe("2026-10-26");
    expect(e.rechtsstand).toBe("2026-07-01");
  });

  it("lehnt Stichtage vor dem 1.7.2026 ab", () => {
    expect(() => rechne(testhaushalt("T01").eingabe, "2026-06-30")).toThrow(/Kein Rechtsstand/);
  });

  it("lehnt negative oder krumme Beträge ab", () => {
    expect(() => rechne(haushalt({ erwachsene: [erwachsener({ brutto: -1 })] }))).toThrow(/brutto/);
    expect(() => rechne(haushalt({ kaltmiete: 500.5 }))).toThrow(/kaltmiete/);
  });

  it("verlangt einen oder zwei Erwachsene", () => {
    expect(() => rechne(haushalt({ erwachsene: [] }))).toThrow(/Erwachsene/);
    expect(() => rechne(haushalt({ erwachsene: [erwachsener(), erwachsener(), erwachsener()] }))).toThrow(
      /Erwachsene/,
    );
  });

  it("lehnt ungültiges Alter ab", () => {
    expect(() => rechne(haushalt({ kinder: [kind(-1)] }))).toThrow(/alter/);
    expect(() => rechne(haushalt({ kinder: [{ alter: { jahre: 3, monate: 12 }, einkommen: 0 }] }))).toThrow(
      /alter/,
    );
    expect(() => rechne(haushalt({ erwachsene: [erwachsener({ alter: 35.5 })] }))).toThrow(/alter/);
  });
});
