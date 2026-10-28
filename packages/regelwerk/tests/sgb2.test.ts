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

function kind(jahre: number, einkommen = 0, ausbildungsverguetung = 0): Kind {
  return { alter: { jahre, monate: 0 }, einkommen, ausbildungsverguetung };
}

// Alleinerziehend (35), ein Kind von 3 Jahren, Wohnkosten 700 €, kein Einkommen, kein Erspartes.
function haushalt(teil: Partial<Haushalt> = {}): Haushalt {
  return {
    gemeinde: { name: "Testort", kreis: null },
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
    ["T03", 74468], // Unterhaltsvorschuss 227 €: 1.872,68 − (1.000 − 358 + 259 + 227)
    ["T04", 173700],
    ["T05", 89700],
    ["T06", 76100],
    ["T07", 159900], // 2.799 − (1.040 − 358 + 518), festgelegt von Nico am 28.10.2026
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
    // Einkommen: 1.291,56 € − 30 € Versicherungspauschale + 259 € Kindergeld = 1.520,56 €
    const h = haushalt({
      erwachsene: [erwachsener({ sonstigesEinkommen: 129156 })],
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

  it("zählt Einkommen des Kindes voll (T03: Unterhaltsvorschuss 227 €)", () => {
    const e = rechne(testhaushalt("T03").eingabe);
    expect(e.einkommen.kindeseinkommen).toBe(22700);
    expect(e.einkommen.summe).toBe(112800);
  });
});

describe("Versicherungspauschale (§ 6 Abs. 1 Nr. 1 GrusiGV)", () => {
  it("zieht 30 € vom sonstigen Einkommen ab, wenn die Person kein Erwerbseinkommen hat", () => {
    const t02 = testhaushalt("T02").eingabe;
    const mitElterngeld: Haushalt = {
      ...t02,
      erwachsene: [t02.erwachsene[0]!, erwachsener({ sonstigesEinkommen: 30000 })],
    };
    const e = rechne(mitElterngeld);
    expect(e.einkommen.erwachsene[1]?.versicherungspauschale).toBe(3000);
    expect(e.lueckeA).toBe(152900 - 30000 + 3000);
  });

  it("zieht nichts zusätzlich ab, wenn die Person Erwerbseinkommen hat (steckt im Grundabsetzbetrag)", () => {
    const e = rechne(
      haushalt({ erwachsene: [erwachsener({ brutto: 52000, netto: 52000, sonstigesEinkommen: 20000 })] }),
    );
    expect(e.einkommen.erwachsene[0]?.versicherungspauschale).toBe(0);
    expect(e.einkommen.summe).toBe(52000 - 18400 + 20000 + 25900);
  });

  it("zieht höchstens das sonstige Einkommen ab", () => {
    const e = rechne(haushalt({ erwachsene: [erwachsener({ sonstigesEinkommen: 2000 })] }));
    expect(e.einkommen.erwachsene[0]?.versicherungspauschale).toBe(2000);
    expect(e.einkommen.summe).toBe(25900);
  });

  it("zieht ohne sonstiges Einkommen nichts ab", () => {
    const e = rechne(testhaushalt("T01").eingabe);
    expect(e.einkommen.erwachsene.map((x) => x.versicherungspauschale)).toEqual([0, 0]);
  });
});

describe("Hinweis Elterngeld", () => {
  it("erscheint, wenn jemand sonstiges Einkommen hat", () => {
    const e = rechne(haushalt({ erwachsene: [erwachsener({ sonstigesEinkommen: 30000 })] }));
    expect(e.hinweise).toContainEqual({ code: "elterngeld_nicht_beruecksichtigt" });
  });

  it("erscheint nicht ohne sonstiges Einkommen", () => {
    const e = rechne(testhaushalt("T01").eingabe);
    expect(e.hinweise).not.toContainEqual({ code: "elterngeld_nicht_beruecksichtigt" });
  });
});

describe("Sofortzuschlag für Kinder (§ 72 SGB II)", () => {
  // Alleinerziehend ohne Einkommen, Kind 15, Wohnkosten 600 €: Bedarf des Kindes 471 + 300 = 771 €.
  const mitUnterhalt = (cent: number) => haushalt({ kinder: [kind(15, cent)], kaltmiete: 40000 });

  it("25 € je Kind, wenn ein Anspruch besteht (T01: zwei Kinder)", () => {
    expect(rechne(testhaushalt("T01").eingabe).sofortzuschlag).toEqual({ kinder: 2, betrag: 5000 });
  });

  it("ohne Anspruch kein Sofortzuschlag (T09)", () => {
    expect(rechne(testhaushalt("T09").eingabe).sofortzuschlag).toEqual({ kinder: 0, betrag: 0 });
  });

  it("auch für ein Kind, das nur mit dem Kindergeld seinen Bedarf deckt (Abs. 1 Satz 2 Nr. 2)", () => {
    // 600 € Unterhalt < 771 €, mit Kindergeld 859 €
    expect(rechne(mitUnterhalt(60000)).sofortzuschlag).toEqual({ kinder: 1, betrag: 2500 });
  });

  it("nicht für ein Kind, das seinen Bedarf schon ohne Kindergeld deckt", () => {
    expect(rechne(mitUnterhalt(80000)).sofortzuschlag).toEqual({ kinder: 0, betrag: 0 });
  });
});

describe("Kindergeld-Überhang (§ 7 Abs. 3 Nr. 4, § 11 Abs. 1 Satz 5 SGB II)", () => {
  // Alleinerziehend (35), Kind 15 mit 600 € Unterhalt, Wohnkosten 600 €.
  // Kind: Bedarf 471 € + Kopfteil 300 € = 771 €. Eigenes Einkommen 259 € + 600 € = 859 €. Überschuss 88 €.
  const mitUnterhalt = (cent: number) => haushalt({ kinder: [kind(15, cent)], kaltmiete: 40000 });

  it("nimmt das Kind aus der Bedarfsgemeinschaft", () => {
    const e = rechne(mitUnterhalt(60000));
    expect(e.kinderAusserhalbBedarfsgemeinschaft).toEqual([0]);
    // Mehrbedarf zählt weiter alle Kinder im Haushalt: 12 % für ein Kind von 15.
    expect(e.bedarf).toEqual({
      regelbedarfe: 56300,
      regelbedarfeErwachsene: 56300,
      mehrbedarfAlleinerziehend: 6756,
      wohnkosten: 30000,
      summe: 93056,
    });
  });

  it("zählt den Überschuss beim Elternteil, abzüglich 30 € Versicherungspauschale ohne Erwerbseinkommen", () => {
    const e = rechne(mitUnterhalt(60000));
    expect(e.einkommen).toMatchObject({
      kindergeld: 0,
      kindeseinkommen: 0,
      kindergeldUeberhang: 8800,
      versicherungspauschaleAufUeberhang: 3000,
      summe: 5800,
    });
    expect(e.lueckeA).toBe(93056 - 5800);
  });

  it("zieht die Pauschale je Person nur einmal ab, auch mit sonstigem Einkommen", () => {
    // 20 € sonstiges Einkommen: davon 20 € Pauschale. Auf den Überhang nur noch die restlichen 10 €.
    const e = rechne(
      haushalt({ erwachsene: [erwachsener({ sonstigesEinkommen: 2000 })], kinder: [kind(15, 60000)], kaltmiete: 40000 }),
    );
    expect(e.einkommen.erwachsene[0]?.versicherungspauschale).toBe(2000);
    expect(e.einkommen.versicherungspauschaleAufUeberhang).toBe(1000);
    expect(e.einkommen.summe).toBe(2000 - 2000 + 8800 - 1000);
  });

  it("zieht keine Pauschale vom Überhang ab, wenn die Alleinerziehende Erwerbseinkommen hat", () => {
    const e = rechne(
      haushalt({
        erwachsene: [erwachsener({ brutto: 52000, netto: 52000 })],
        kinder: [kind(15, 60000)],
        kaltmiete: 40000,
      }),
    );
    expect(e.einkommen.versicherungspauschaleAufUeberhang).toBe(0);
  });

  it("Paar mit genau einem Erwerbstätigen: nur der sichere Abzug, also keiner, und ein Hinweis", () => {
    // Wer das Kindergeld bekommt, fragt Version 0 nicht (Entscheidung vom 26.10.2026). Beim Erwerbstätigen
    // gäbe es keine Pauschale.
    const e = rechne(
      haushalt({
        erwachsene: [erwachsener({ brutto: 240000, netto: 175000 }), erwachsener()],
        kinder: [kind(15, 100000)],
        kaltmiete: 80000,
      }),
    );
    expect(e.einkommen.kindergeldUeberhang).toBe(25900);
    expect(e.einkommen.versicherungspauschaleAufUeberhang).toBe(0);
    expect(e.hinweise).toContainEqual({ code: "kindergeld_empfaenger_offen" });
  });

  it("Hinweis auch, wenn beide ohne Erwerbseinkommen sind, aber nur einer die Pauschale schon ausschöpft", () => {
    const e = rechne(
      haushalt({
        erwachsene: [erwachsener({ sonstigesEinkommen: 5000 }), erwachsener()],
        kinder: [kind(15, 100000)],
        kaltmiete: 80000,
      }),
    );
    expect(e.einkommen.versicherungspauschaleAufUeberhang).toBe(0);
    expect(e.hinweise).toContainEqual({ code: "kindergeld_empfaenger_offen" });
  });

  it.each([
    [
      "die nicht erwerbstätige Person die Pauschale schon ausschöpft",
      [erwachsener({ brutto: 240000, netto: 175000 }), erwachsener({ sonstigesEinkommen: 5000 })],
      [kind(15, 100000)],
    ],
    ["es keinen Überhang gibt", [erwachsener({ brutto: 240000, netto: 175000 }), erwachsener()], [kind(3)]],
    ["die Person alleinerziehend ist", [erwachsener()], [kind(15, 100000)]],
  ])("kein Hinweis zum Kindergeld, wenn %s", (_, erwachsene, kinder) => {
    const e = rechne(haushalt({ erwachsene, kinder, kaltmiete: 80000 }));
    expect(e.hinweise).not.toContainEqual({ code: "kindergeld_empfaenger_offen" });
  });

  it("streicht den Vermögensfreibetrag des Kindes", () => {
    expect(rechne(mitUnterhalt(60000)).vermoegen.freibetrag).toBe(1000000);
  });

  it("deckt das Einkommen den Bedarf genau, fällt das Kind heraus, Überhang 0", () => {
    // 512 € Unterhalt + 259 € Kindergeld = 771 €
    const e = rechne(mitUnterhalt(51200));
    expect(e.kinderAusserhalbBedarfsgemeinschaft).toEqual([0]);
    expect(e.einkommen.kindergeldUeberhang).toBe(0);
  });

  it("begrenzt den Überhang auf das Kindergeld und rundet den Kopfteil", () => {
    // Paar, Kind 15 mit 1.000 € Unterhalt, Wohnkosten 1.000 €: Kopfteil 333,33 €.
    const e = rechne(
      haushalt({ erwachsene: [erwachsener(), erwachsener()], kinder: [kind(15, 100000)], kaltmiete: 80000 }),
    );
    expect(e.bedarf.wohnkosten).toBe(100000 - 33333);
    expect(e.einkommen.kindergeldUeberhang).toBe(25900);
    // Beide Erwachsenen ohne Einkommen: Die Pauschale greift, egal wer das Kindergeld bekommt.
    expect(e.einkommen.versicherungspauschaleAufUeberhang).toBe(3000);
    expect(e.hinweise).not.toContainEqual({ code: "kindergeld_empfaenger_offen" });
    expect(e.lueckeA).toBe(101200 + 66667 - 25900 + 3000);
    expect(e.parameterHinweise.map((h) => h.name)).toContain("sgb2.rundung");
  });

  it("prüft mit dem gerundeten Kopfteil (§ 41 Abs. 2 SGB II)", () => {
    // Kopfteil 1.000 € / 3 = 333,33 €. Einkommen genau 471 € + 333,33 € = 804,33 € deckt den Bedarf.
    const e = rechne(
      haushalt({ erwachsene: [erwachsener(), erwachsener()], kinder: [kind(15, 54533)], kaltmiete: 80000 }),
    );
    expect(e.kinderAusserhalbBedarfsgemeinschaft).toEqual([0]);
    expect(e.einkommen.kindergeldUeberhang).toBe(0);
    expect(e.parameterHinweise.map((h) => h.name)).toContain("sgb2.rundung");
  });

  it("meldet die Rundung nicht, wenn sie nichts berührt (T06: Kopfteil 296,67 €, Kind klar in der BG)", () => {
    expect(rechne(testhaushalt("T06").eingabe).parameterHinweise).toEqual([]);
  });

  it("lässt ein Kind in der Bedarfsgemeinschaft, dessen Einkommen den Bedarf nicht deckt (T03)", () => {
    // Kind 3: 357 € + Kopfteil 375 € = 732 €. Eigenes Einkommen 259 € + 227 € = 486 €.
    const e = rechne(testhaushalt("T03").eingabe);
    expect(e.kinderAusserhalbBedarfsgemeinschaft).toEqual([]);
    expect(e.einkommen.kindergeldUeberhang).toBe(0);
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

  it.each([
    ["einen Cent darüber", { von: 1500001, bis: 1500001 }, { von: 1, bis: 1 }],
    ["Spanne über den Freibetrag hinweg", { von: 1000000, bis: 3999999 }, { von: 0, bis: 2499999 }],
    ["nach oben offen", { von: 7000000, bis: null }, { von: 5500000, bis: null }],
  ] as const)("gibt den Betrag über dem Freibetrag aus: %s", (_, vermoegen, ueber) => {
    const e = rechne(haushalt({ vermoegen }));
    expect(e.vermoegen.ueberFreibetrag).toEqual(ueber);
    expect(e.hinweise).toContainEqual({ code: "erspartes_zuerst_einsetzen" });
  });

  it("unter dem Freibetrag: kein Betrag darüber, kein Hinweis", () => {
    const e = rechne(haushalt({ vermoegen: { von: 0, bis: 999999 } }));
    expect(e.vermoegen.ueberFreibetrag).toEqual({ von: 0, bis: 0 });
    expect(e.hinweise).not.toContainEqual({ code: "erspartes_zuerst_einsetzen" });
  });

  it("kein Hinweis „danach kann ein Anspruch bestehen“, wenn Lücke A 0 oder kleiner ist", () => {
    const t09 = testhaushalt("T09").eingabe;
    const e = rechne({ ...t09, vermoegen: { von: 6000000, bis: 6000000 } });
    expect(e.vermoegen.ergebnis).toBe("ueber_freibetrag");
    expect(e.anspruch).toBe("nein_einkommen");
    expect(e.hinweise).not.toContainEqual({ code: "erspartes_zuerst_einsetzen" });
  });

  it("T06: 35.000 € über dem Freibetrag", () => {
    const e = rechne(testhaushalt("T06").eingabe);
    expect(e.vermoegen.ueberFreibetrag).toEqual({ von: 3500000, bis: 3500000 });
  });

  describe("Erspartes eines Kindes außerhalb der Bedarfsgemeinschaft", () => {
    // Alleinerziehend (35), Kind 15 mit 600 € Unterhalt deckt seinen Bedarf. Freibetrag nur noch 10.000 €.
    const mitKindAusserhalb = (vermoegen: Haushalt["vermoegen"], teil: Partial<Erwachsener> = {}) =>
      haushalt({ erwachsene: [erwachsener(teil)], kinder: [kind(15, 60000)], kaltmiete: 40000, vermoegen });

    it.each([
      ["über dem Freibetrag liegt", { von: 1200000, bis: 1200000 }],
      ["als Spanne über den Freibetrag hinweg reicht", { von: 500000, bis: 1500000 }],
    ] as const)("Hinweis, wenn das Erspartes %s", (_, vermoegen) => {
      const e = rechne(mitKindAusserhalb(vermoegen));
      expect(e.kinderAusserhalbBedarfsgemeinschaft).toEqual([0]);
      expect(e.hinweise).toContainEqual({ code: "erspartes_kind_ausserhalb" });
    });

    it("kein Hinweis unter dem Freibetrag", () => {
      const e = rechne(mitKindAusserhalb({ von: 0, bis: 999999 }));
      expect(e.hinweise).not.toContainEqual({ code: "erspartes_kind_ausserhalb" });
    });

    it("kein Hinweis, wenn alle Kinder in der Bedarfsgemeinschaft sind", () => {
      const e = rechne(haushalt({ vermoegen: { von: 1600000, bis: 1600000 } }));
      expect(e.anspruch).toBe("nein_vermoegen");
      expect(e.hinweise).not.toContainEqual({ code: "erspartes_kind_ausserhalb" });
    });

    it("kein Hinweis, wenn Lücke A 0 oder kleiner ist (Ergebnis bleibt „kein Anspruch“)", () => {
      const e = rechne(mitKindAusserhalb({ von: 1200000, bis: 1200000 }, { brutto: 400000, netto: 300000 }));
      expect(e.anspruch).toBe("nein_einkommen");
      expect(e.hinweise).not.toContainEqual({ code: "erspartes_kind_ausserhalb" });
    });
  });

  it("lehnt eine Spanne ab, deren Ende vor dem Anfang liegt", () => {
    expect(() => rechne(haushalt({ vermoegen: { von: 100, bis: 50 } }))).toThrow(/vermoegen/);
  });
});

describe("Monatsregel § 12 Abs. 2 Satz 2 SGB II (Geburtstagsmonat)", () => {
  it("gibt den Hinweis, wenn der höhere Freibetrag das Ergebnis ändern würde", () => {
    // 29 Jahre: 5.000 € + 5.000 € (Kind) = 10.000 €. Im Monat des 30. Geburtstags: 15.000 €.
    const e = rechne(haushalt({ erwachsene: [erwachsener({ alter: 29 })], vermoegen: { von: 1200000, bis: 1200000 } }));
    expect(e.vermoegen.ergebnis).toBe("ueber_freibetrag");
    expect(e.hinweise).toContainEqual({ code: "freibetrag_geburtstagsmonat" });
  });

  it("gibt ihn nicht, wenn sich nichts ändert", () => {
    const e = rechne(haushalt({ erwachsene: [erwachsener({ alter: 29 })], vermoegen: { von: 0, bis: 999999 } }));
    expect(e.hinweise).not.toContainEqual({ code: "freibetrag_geburtstagsmonat" });
  });

  it("gibt ihn nicht, wenn Lücke A 0 oder kleiner ist (Ergebnis bleibt „kein Anspruch“)", () => {
    const e = rechne(
      haushalt({
        erwachsene: [erwachsener({ alter: 29, brutto: 400000, netto: 300000 })],
        vermoegen: { von: 1200000, bis: 1200000 },
      }),
    );
    expect(e.anspruch).toBe("nein_einkommen");
    expect(e.hinweise).not.toContainEqual({ code: "freibetrag_geburtstagsmonat" });
  });

  it("gibt ihn nicht, wenn niemand vor einer Altersgrenze steht", () => {
    const e = rechne(haushalt({ vermoegen: { von: 1600000, bis: 1600000 } }));
    expect(e.vermoegen.ergebnis).toBe("ueber_freibetrag");
    expect(e.hinweise).not.toContainEqual({ code: "freibetrag_geburtstagsmonat" });
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

  it("Kind mit Ausbildungsvergütung: außerhalb des Umfangs", () => {
    const e = berechneSgb2(haushalt({ kinder: [kind(16, 0, 80000)] }), { stichtag: STICHTAG });
    expect(e).toMatchObject({ imUmfang: false, gruende: ["kind_ausbildungsverguetung"] });
  });

  it.each([
    [17, "erwachsener_unter_18"],
    [65, "erwachsener_ab_65"],
  ])("Erwachsener mit %i Jahren: %s", (alter, grund) => {
    const e = berechneSgb2(haushalt({ erwachsene: [erwachsener({ alter })] }), { stichtag: STICHTAG });
    expect(e).toMatchObject({ imUmfang: false, gruende: [grund] });
  });

  it("Erwachsene mit 18 und 64 Jahren sind im Umfang", () => {
    const e = berechneSgb2(haushalt({ erwachsene: [erwachsener({ alter: 18 }), erwachsener({ alter: 64 })] }), {
      stichtag: STICHTAG,
    });
    expect(e.imUmfang).toBe(true);
  });
});

describe("Stichtag ab 1.1.2027", () => {
  it("rechnet mit den Werten von 2026 und meldet sie als pruefen", () => {
    const e = rechne(testhaushalt("T01").eingabe, "2027-03-01");
    expect(e.rechtsstand).toBe("2027-01-01");
    expect(e.bedarf.summe).toBe(279900);
    expect(e.einkommen.freibetrag).toBe(37800);
    expect(e.parameterHinweise.map((h) => h.name).sort()).toEqual([
      "sgb2.kindergeld",
      "sgb2.regelbedarfKinder",
      "sgb2.regelbedarfStufe2",
      "sgb2.sofortzuschlagKind",
    ]);
    expect(e.parameterHinweise.every((h) => h.status === "pruefen")).toBe(true);
    expect(e.hinweise).toContainEqual({ code: "regelsaetze_offen", jahr: 2027 });
  });

  it("nennt im Hinweis das Jahr des Stichtags, auch nach 2027", () => {
    const e = rechne(testhaushalt("T01").eingabe, "2028-02-01");
    expect(e.rechtsstand).toBe("2027-01-01");
    expect(e.hinweise).toContainEqual({ code: "regelsaetze_offen", jahr: 2028 });
  });

  it("meldet bei Alleinerziehenden auch Stufe 1", () => {
    const e = rechne(testhaushalt("T03").eingabe, "2027-01-01");
    expect(e.parameterHinweise.map((h) => h.name)).toContain("sgb2.regelbedarfStufe1");
  });

  it("gibt den Hinweis vor 2027 nicht", () => {
    const e = rechne(testhaushalt("T01").eingabe, "2026-12-31");
    expect(e.hinweise.map((h) => h.code)).not.toContain("regelsaetze_offen");
    expect(e.parameterHinweise).toEqual([]);
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
    expect(() => rechne(haushalt({ kinder: [kind(16, 0, -1)] }))).toThrow(/ausbildungsverguetung/);
  });

  it("verlangt einen oder zwei Erwachsene", () => {
    expect(() => rechne(haushalt({ erwachsene: [] }))).toThrow(/Erwachsene/);
    expect(() => rechne(haushalt({ erwachsene: [erwachsener(), erwachsener(), erwachsener()] }))).toThrow(
      /Erwachsene/,
    );
  });

  it("lehnt ungültiges Alter ab", () => {
    expect(() => rechne(haushalt({ kinder: [kind(-1)] }))).toThrow(/alter/);
    expect(() =>
      rechne(haushalt({ kinder: [{ alter: { jahre: 3, monate: 12 }, einkommen: 0, ausbildungsverguetung: 0 }] })),
    ).toThrow(/alter/);
    expect(() => rechne(haushalt({ erwachsene: [erwachsener({ alter: 35.5 })] }))).toThrow(/alter/);
  });
});
