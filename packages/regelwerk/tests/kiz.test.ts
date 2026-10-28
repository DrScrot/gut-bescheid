// Kinderzuschlag (§ 6a BKGG). Sollwerte K01–K06 aus dem Merkblatt Kinderzuschlag der BA, Stand Juli 2026
// (https://www.arbeitsagentur.de/datei/kiz2-merkblattkinderzuschlag_ba034485.pdf), Rechenbeispiele aus der
// DA-KiZ, Stand 20.02.2026. Getestet wird ab dem dort angegebenen bereinigten Einkommen: Das Netto ist so
// gewählt, dass Netto minus Freibetrag (§ 11b SGB II, aus dem Brutto) genau dieses Einkommen ergibt.
import { describe, expect, it } from "vitest";
import { aufEuro, berechneKiz } from "../src/index";
import type { Erwachsener, Haushalt, Kind } from "../src/index";

const STICHTAG = "2026-07-01";

function verdient(brutto: number, freibetrag: number, bereinigt: number): Erwachsener {
  return { alter: 35, brutto, netto: bereinigt + freibetrag, sonstigesEinkommen: 0 };
}

const OHNE_EINKOMMEN: Erwachsener = { alter: 35, brutto: 0, netto: 0, sonstigesEinkommen: 0 };

function kind(jahre: number, einkommen = 0): Kind {
  return { alter: { jahre, monate: 0 }, einkommen, ausbildungsverguetung: 0 };
}

// Wohnkosten als eine Summe (Miete mit Nebenkosten und Heizung), wie im Merkblatt.
function haushalt(erwachsene: Erwachsener[], kinder: Kind[], wohnkosten: number): Haushalt {
  return {
    gemeinde: { name: "Testort", kreis: null },
    erwachsene,
    kinder,
    kaltmiete: wohnkosten,
    nebenkosten: 0,
    heizkosten: 0,
    vermoegen: { von: 0, bis: 999999 },
  };
}

function rechne(h: Haushalt, wohngeld: number, stichtag = STICHTAG) {
  const e = berechneKiz(h, { stichtag, wohngeld });
  if (!e.imUmfang) throw new Error(`außerhalb des Umfangs: ${e.gruende.join(", ")}`);
  return e;
}

// Freibeträge nach § 11b Abs. 2 und 3 SGB II, mit minderjährigem Kind:
// Brutto ab 1.500 €: 100 + 84 + 144 + 50 = 378 €. Brutto 1.300 €: 358 €. Brutto 750 €: 100 + 84 + 69 = 253 €.
// K01 bis K03: Ehepaar, Kinder 11 und 16, Wohnkosten 900 €, Kindergeld 2 × 259 €.
const K01 = haushalt([verdient(270000, 37800, 160000), OHNE_EINKOMMEN], [kind(11), kind(16)], 90000);
const K02 = haushalt([verdient(130000, 35800, 70000), OHNE_EINKOMMEN], [kind(11), kind(16)], 90000);
const K03 = haushalt([verdient(180000, 37800, 103000), OHNE_EINKOMMEN], [kind(11), kind(16)], 90000);
// K04: Kinder 8, 10 und 12, Miete 900 €. Vater 2.500 € brutto, 1.585 € bereinigt; Mutter 750 €, 330 €.
const K04 = haushalt(
  [verdient(250000, 37800, 158500), verdient(75000, 25300, 33000)],
  [kind(8), kind(10), kind(12)],
  90000,
);
// K05: Kind 8, Miete 800 €. Vater 3.300 € brutto, 2.100 € bereinigt, Mutter ohne Einkommen.
const K05 = haushalt([verdient(330000, 37800, 210000), OHNE_EINKOMMEN], [kind(8)], 80000);
// K06: wie K01, das Kind von 16 bekommt 300 € Unterhalt.
const K06 = haushalt([verdient(270000, 37800, 160000), OHNE_EINKOMMEN], [kind(11), kind(16, 30000)], 90000);

describe("Merkblatt Kinderzuschlag, Stand Juli 2026", () => {
  it("K01: Bedarf 2.773 €, KiZ 594 €, Bedarf mit Wohngeld 450 € gedeckt", () => {
    const e = rechne(K01, 45000);
    expect(e.bedarfspruefung.bedarf).toBe(277300);
    expect(e.mindesteinkommen.erreicht).toBe(true);
    expect(e.einkommenEltern).toEqual({ erwerb: 160000, anderes: 0 });
    expect(e.betrag).toBe(59400);
    // 1.600 + 518 + 450 + 594 = 3.162 €
    expect(e.bedarfspruefung.fehlbetrag).toBe(277300 - 316200);
    expect(e.anspruch).toBe("ja");
    expect(e.auszahlung).toBe(59400);
  });

  it("K02: bereinigt 700 €, Wohngeld 800 €: es fehlen 161 €, kein KiZ", () => {
    const e = rechne(K02, 80000);
    expect(e.bedarfspruefung.fehlbetrag).toBe(16100);
    expect(e.anspruch).toBe("nein_bedarf_nicht_gedeckt");
    expect(e.auszahlung).toBe(0);
  });

  it("K03: bereinigt 1.030 €, Wohngeld 600 €: es fehlen 31 €, erweiterter Zugang mit 594 €", () => {
    const e = rechne(K03, 60000);
    expect(e.bedarfspruefung.fehlbetrag).toBe(3100);
    expect(e.bedarfspruefung.absetzbetraegeErwerb).toBe(37800);
    expect(e.anspruch).toBe("erweiterter_zugang");
    expect(e.auszahlung).toBe(59400);
  });

  it("K04: drei Kinder, Elternbedarf 1.570 € (62 % von 900 €), KiZ 736 €", () => {
    const e = rechne(K04, 50000);
    expect(e.elternbedarf).toEqual({
      regelbedarfe: 101200,
      mehrbedarf: 0,
      wohnkostenanteilProzent: 62,
      wohnkosten: 55800,
      summe: 157000,
    });
    expect(e.einkommenEltern.erwerb).toBe(191500);
    // 45 % von 345 € = 155,25 €; 891 − 155,25 = 735,75 €, kaufmännisch 736 €
    expect(e.minderungEltern).toEqual({ anderes: 0, erwerb: 15525 });
    expect(e.ungerundet).toBe(73575);
    expect(e.betrag).toBe(73600);
    expect(e.anspruch).toBe("ja");
  });

  it("K05: ein Kind, Elternbedarf 1.676 € (83 % von 800 €), KiZ 106 € (106,20 € kaufmännisch gerundet)", () => {
    const e = rechne(K05, 0);
    expect(e.elternbedarf.wohnkostenanteilProzent).toBe(83);
    expect(e.elternbedarf.summe).toBe(167600);
    expect(e.minderungEltern.erwerb).toBe(19080);
    expect(e.ungerundet).toBe(10620);
    expect(e.betrag).toBe(10600);
    expect(e.anspruch).toBe("ja");
  });

  it("K06: Kind mit 300 € Unterhalt: KiZ für dieses Kind höchstens 162 €", () => {
    const e = rechne(K06, 45000);
    expect(e.kinder[1]).toEqual({
      index: 1,
      inBedarfsgemeinschaft: true,
      hoechstbetrag: 29700,
      minderung: 13500,
      betrag: 16200,
    });
    // Einkommen eines Kindes mindert nur seinen eigenen KiZ.
    expect(e.kinder[0]?.betrag).toBe(29700);
    expect(e.betrag).toBe(45900);
  });
});

describe("Rechenbeispiele der DA-KiZ (Stand 20.02.2026)", () => {
  it("C.3.2.1.3 Abs. 4: anderes Einkommen unter dem Bedarf, Überschreitung zählt als Erwerbseinkommen", () => {
    // Frau T., alleinerziehend, Kinder 8 und 11, Miete 400 €, Unterhalt 450 €, Erwerbseinkünfte 600 €.
    // Brutto 900 €: Freibetrag 100 + 84 + 114 = 298 €. Bedarf 563 + 202,68 + 63 % von 400 = 1.017,68 €.
    const mutter: Erwachsener = { alter: 35, brutto: 90000, netto: 89800, sonstigesEinkommen: 45000 };
    const e = rechne(haushalt([mutter], [kind(8), kind(11)], 40000), 0);
    expect(e.elternbedarf.summe).toBe(101768);
    // 45 % von 32,32 € = 14,544 €, auf Cent 14,54 € wie in der DA
    expect(e.minderungEltern).toEqual({ anderes: 0, erwerb: 1454 });
    expect(e.betrag).toBe(57900);
  });

  it("C.3.2.1.3 Abs. 5: anderes Einkommen allein über dem Bedarf, erst voll, dann Erwerb zu 45 %", () => {
    // Ehepaar, Kinder 12, 14 und 16. Rente 1.450 € (1.480 € minus 30 € Versicherungspauschale),
    // Erwerbseinkünfte 300 € (Brutto 500 €, Freibetrag 180 €). Bedarf 1.012 + 62 % von 645,16 = 1.412 €.
    const rentner: Erwachsener = { alter: 60, brutto: 0, netto: 0, sonstigesEinkommen: 148000 };
    const partnerin = verdient(50000, 18000, 30000);
    const e = rechne(haushalt([rentner, partnerin], [kind(12), kind(14), kind(16)], 64516), 0);
    expect(e.elternbedarf.summe).toBe(141200);
    expect(e.einkommenEltern).toEqual({ erwerb: 30000, anderes: 145000 });
    expect(e.minderungEltern).toEqual({ anderes: 3800, erwerb: 13500 });
    expect(e.betrag).toBe(71800);
  });
});

describe("Kinder mit eigenem Einkommen: 45-%-Regel (DA-KiZ B.3 Abs. 2, C.3.2.1.1 Abs. 3)", () => {
  // Mutter mit Erwerbseinkommen, also ohne Versicherungspauschale: Brutto 1.500 €, Freibetrag 378 €, bereinigt 822 €.
  const mutter = verdient(150000, 37800, 82200);

  it("B.3 Beispiel 1: Kind 5, Unterhalt 400 €, Bedarf 507 €: 180 + 259 = 439 €, bleibt beim KiZ", () => {
    // Zwei Personen, Wohnkosten 300 €: Kopfteil 150 €.
    const e = rechne(haushalt([mutter], [kind(5, 40000)], 30000), 0);
    expect(e.kinder[0]).toEqual({
      index: 0,
      inBedarfsgemeinschaft: true,
      hoechstbetrag: 29700,
      minderung: 18000,
      betrag: 11700,
    });
    // Nach SGB II deckt das Kind seinen Bedarf (400 + 259 = 659 €). Der SGB-II-Überhang zählt beim KiZ nicht.
    expect(e.einkommenEltern.anderes).toBe(0);
    expect(e.elternbedarf).toMatchObject({ wohnkostenanteilProzent: 77, wohnkosten: 23100 });
  });

  it("C.3.2.1.1 Beispiel 1: Unterhalt 600 €: 270 + 259 = 529 € ≥ 507 €, kein KiZ, 22 € Kindergeld bei den Eltern", () => {
    // Mutter, Kind 5 mit 600 € Unterhalt, Kind 8 ohne Einkommen. Wohnkosten 450 €: Kopfteil 150 €.
    const e = rechne(haushalt([mutter], [kind(5, 60000), kind(8)], 45000), 0);
    expect(e.kinder[0]).toMatchObject({ inBedarfsgemeinschaft: false, betrag: 0 });
    expect(e.kinder[1]).toMatchObject({ inBedarfsgemeinschaft: true, betrag: 29700 });
    expect(e.einkommenEltern).toEqual({ erwerb: 82200, anderes: 2200 });
    // Kopfteil des Kindes geht ab, Anteil wie mit einem Kind: 77 % von 300 € (DA-KiZ C.3.1.2 Abs. 2).
    expect(e.elternbedarf).toMatchObject({ wohnkostenanteilProzent: 77, wohnkosten: 23100 });
    expect(e.betrag).toBe(29700);
  });

  it("Kind außerhalb der SGB-II-BG, aber in der KiZ-BG: in der Bedarfsprüfung zählt nur, was das Kindergeld frei macht", () => {
    // Mutter Brutto 700 €, Netto 650 €, Freibetrag 238 €; Kind 10 mit 550 € Unterhalt; Wohnkosten 334 €.
    // Bedarf des Kindes 390 + 167 = 557 €. KiZ: 247,50 + 259 = 506,50 € < 557 €, KiZ 49,50 €, gerundet 50 €.
    // SGB II: 550 + 259 = 809 € ≥ 557 €, Kind außerhalb, Überhang 252 €. Mehr als 259 − 252 = 7 € nützt der KiZ
    // dem Haushalt nicht (§ 11 Abs. 1 Satz 4 und 5 SGB II).
    const e = rechne(haushalt([verdient(70000, 23800, 41200)], [kind(10, 55000)], 33400), 0);
    expect(e.kinder[0]).toMatchObject({ inBedarfsgemeinschaft: true, betrag: 4950 });
    expect(e.betrag).toBe(5000);
    expect(e.bedarfspruefung.kinderzuschlagWirksam).toBe(700);
    // Lücke A 133,56 € minus 7 €
    expect(e.bedarfspruefung.fehlbetrag).toBe(12656);
    expect(e.anspruch).toBe("nein_bedarf_nicht_gedeckt");
  });

  it("C.3.2.1.1 Beispiel 2: Wohnkosten 300 € Kopfteil: Bedarf 657 €, Kind bleibt, KiZ 27 €", () => {
    const e = rechne(haushalt([mutter], [kind(5, 60000)], 60000), 0);
    expect(e.kinder[0]).toMatchObject({ inBedarfsgemeinschaft: true, minderung: 27000, betrag: 2700 });
    expect(e.einkommenEltern.anderes).toBe(0);
  });
});

describe("Bedarfsprüfung mit Vermögen (§ 6a Abs. 1 Nr. 3 BKGG, § 9 SGB II, DA-KiZ C.4.1 Abs. 2)", () => {
  // Wie T01, Brutto 1.200 €, Netto 960 €: mit KiZ 594 € und Wohngeld 940 € fehlen 135 €.
  const knapp = haushalt(
    [{ alter: 35, brutto: 120000, netto: 96000, sonstigesEinkommen: 0 }, OHNE_EINKOMMEN],
    [kind(4), kind(8)],
    104000,
  );

  it("ohne Erspartes: es fehlen 135 €, kein KiZ", () => {
    expect(rechne(knapp, 94000).anspruch).toBe("nein_bedarf_nicht_gedeckt");
  });

  it("Erspartes über dem SGB-II-Freibetrag (50.000 € > 30.000 €), unter der KiZ-Grenze: keine Hilfebedürftigkeit, KiZ", () => {
    const e = rechne({ ...knapp, vermoegen: { von: 5000000, bis: 5000000 } }, 94000);
    expect(e.bedarfspruefung.fehlbetrag).toBe(13500);
    expect(e.bedarfspruefung.erspartesDecktFehlbetrag).toBe(true);
    expect(e.anspruch).toBe("ja");
    expect(e.hinweise).toContainEqual({ code: "erspartes_ueber_freibetrag" });
  });

  it("Teil über dem Freibetrag kleiner als der Fehlbetrag (50 € < 135 €): Hilfebedürftigkeit bleibt, kein KiZ", () => {
    const e = rechne({ ...knapp, vermoegen: { von: 3005000, bis: 3005000 } }, 94000);
    expect(e.bedarfspruefung.erspartesDecktFehlbetrag).toBe(false);
    expect(e.anspruch).toBe("nein_bedarf_nicht_gedeckt");
  });

  it("kein Hinweis „trotzdem möglich“, wenn der KiZ ohnehin 0 € ist", () => {
    // Mutter mit 600 € Arbeitslosengeld; Kind 5 mit 600 € Unterhalt deckt seinen Bedarf (270 + 259 ≥ 507 €),
    // also kein KiZ. Nach SGB II fehlen trotzdem 86,68 €, Erspartes 5.000–20.000 € um den Freibetrag von 10.000 €.
    const mutter: Erwachsener = { alter: 35, brutto: 0, netto: 0, sonstigesEinkommen: 60000 };
    const h = { ...haushalt([mutter], [kind(5, 60000)], 30000), vermoegen: { von: 500000, bis: 2000000 } };
    const e = rechne(h, 0);
    expect(e.anspruch).toBe("nein_kein_betrag");
    expect(e.bedarfspruefung.fehlbetrag).toBeGreaterThan(0);
    expect(e.hinweise).not.toContainEqual(expect.objectContaining({ code: "erspartes_freibetrag_unklar" }));
  });

  it("Erspartes rund um den SGB-II-Freibetrag: Anspruch nach Einkommen, mit Hinweis", () => {
    const e = rechne({ ...knapp, vermoegen: { von: 2000000, bis: 4000000 } }, 94000);
    expect(e.anspruch).toBe("nein_bedarf_nicht_gedeckt");
    // Ab 30.000 € Freibetrag plus 135 € Fehlbetrag wäre KiZ möglich.
    expect(e.hinweise).toContainEqual({ code: "erspartes_freibetrag_unklar", ab: 3013500 });
  });
});

describe("Mindesteinkommen (§ 6a Abs. 1 Nr. 2 BKGG)", () => {
  it("Paar unter 900 € brutto: kein KiZ", () => {
    const h = haushalt([verdient(89999, 0, 70000), OHNE_EINKOMMEN], [kind(8)], 60000);
    const e = rechne(h, 0);
    expect(e.mindesteinkommen).toEqual({ einkommen: 89999, grenze: 90000, erreicht: false });
    expect(e.anspruch).toBe("nein_mindesteinkommen");
    expect(e.auszahlung).toBe(0);
  });

  it("Alleinerziehend: 600 € reichen, sonstiges Einkommen zählt mit", () => {
    const mutter: Erwachsener = { alter: 30, brutto: 40000, netto: 40000, sonstigesEinkommen: 20000 };
    const e = rechne(haushalt([mutter], [kind(3)], 50000), 0);
    expect(e.mindesteinkommen).toEqual({ einkommen: 60000, grenze: 60000, erreicht: true });
  });
});

describe("Rundung (§ 11 Abs. 2 BKGG, DA-KiZ E.5 Abs. 2)", () => {
  it("kaufmännisch auf volle Euro", () => {
    expect(aufEuro(73575)).toBe(73600);
    expect(aufEuro(10620)).toBe(10600);
    expect(aufEuro(10650)).toBe(10700);
    expect(aufEuro(10649)).toBe(10600);
  });

  it("0,01 bis 0,49 € ergibt 0 €, also keinen Kinderzuschlag", () => {
    expect(aufEuro(1)).toBe(0);
    expect(aufEuro(49)).toBe(0);
    expect(aufEuro(50)).toBe(100);
  });

  it("Kinderzuschlag, der auf 0 € fällt, ist kein Anspruch", () => {
    // Bereinigt 3.000 €, Elternbedarf 1.012 + 83 % von 800 = 1.676 €: 45 % von 1.324 € = 595,80 € > 297 €.
    const e = rechne(haushalt([verdient(450000, 37800, 300000), OHNE_EINKOMMEN], [kind(8)], 80000), 0);
    expect(e.betrag).toBe(0);
    expect(e.anspruch).toBe("nein_kein_betrag");
  });
});

describe("Erweiterter Zugang (§ 6a Abs. 1a BKGG)", () => {
  it("genau 100 € fehlen: erweiterter Zugang", () => {
    const e = rechne(K03, 60000 - 6900);
    expect(e.bedarfspruefung.fehlbetrag).toBe(10000);
    expect(e.anspruch).toBe("erweiterter_zugang");
  });

  it("100,01 € fehlen: kein KiZ", () => {
    const e = rechne(K03, 60000 - 6901);
    expect(e.anspruch).toBe("nein_bedarf_nicht_gedeckt");
  });

  it("Absetzbeträge wegen Erwerbstätigkeit unter 100 €: kein erweiterter Zugang (Abs. 1a Nr. 2)", () => {
    // Alleinerziehend, Brutto 150 € (Freibetrag 100 + 10 = 110 €) und 700 € Arbeitslosengeld.
    // Freibetrag aber nur bis zum Netto: Netto 90 € ergibt 90 € Absetzbeträge.
    const mutter: Erwachsener = { alter: 30, brutto: 15000, netto: 9000, sonstigesEinkommen: 70000 };
    const h = haushalt([mutter], [kind(3)], 50000);
    const ohneWohngeld = rechne(h, 0);
    expect(ohneWohngeld.bedarfspruefung.absetzbetraegeErwerb).toBe(9000);
    // Wohngeld so, dass genau 50 € fehlen.
    const e = rechne(h, ohneWohngeld.bedarfspruefung.fehlbetrag - 5000);
    expect(e.bedarfspruefung.fehlbetrag).toBe(5000);
    expect(e.anspruch).toBe("nein_bedarf_nicht_gedeckt");
  });
});

describe("Vermögen (§ 6a Abs. 3 Satz 5 bis 7 BKGG, DA-KiZ C.3.2.2)", () => {
  it("Grenze 40.000 € plus 15.000 € je weitere Person", () => {
    expect(rechne(K01, 45000).vermoegen).toEqual({ grenze: 8500000, ergebnis: "unter_grenze" });
  });

  it("Erspartes über der Grenze, mehr als ein Monat KiZ: kein Anspruch", () => {
    const e = rechne({ ...K01, vermoegen: { von: 8600000, bis: 9000000 } }, 45000);
    expect(e.vermoegen.ergebnis).toBe("ueber_grenze");
    expect(e.anspruch).toBe("nein_vermoegen");
  });

  it("Spanne über die Grenze hinweg: unklar, mit Hinweis", () => {
    const e = rechne({ ...K01, vermoegen: { von: 7000000, bis: null } }, 45000);
    expect(e.vermoegen.ergebnis).toBe("unklar");
    expect(e.anspruch).toBe("ja");
    expect(e.hinweise).toContainEqual({ code: "vermoegen_unklar", grenze: 8500000 });
  });
});

describe("Parameter", () => {
  it("Stand 2026: kein ungeprüfter Wert fließt ein", () => {
    expect(rechne(K04, 50000).parameterHinweise).toEqual([]);
  });

  it("Stand 2027: Höchstbetrag 272 € ohne Sofortzuschlag, Status geplant (BT-Drs. 21/7860)", () => {
    const e = rechne(K04, 50000, "2027-01-01");
    // 3 × 272 € = 816 €; minus 155,25 € = 660,75 €, gerundet 661 €
    expect(e.kinder[0]?.hoechstbetrag).toBe(27200);
    expect(e.betrag).toBe(66100);
    expect(e.parameterHinweise).toContainEqual(expect.objectContaining({ name: "kiz.hoechstbetrag", status: "geplant" }));
  });
});
