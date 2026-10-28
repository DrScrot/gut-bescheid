// Grundsicherung (SGB II): Bedarf, Einkommen nach Freibeträgen, Lücke A und Vermögensprüfung.
// Rechnet wie das Fachkonzept für den ganzen Haushalt (Entscheidungslogik, Schritte 1 und 2).
import { anteil, geteilt, pruefeBetrag, type Cent } from "./geld";
import type { Erwachsener, Haushalt, Kind, Spanne } from "./haushalt";
import {
  protokoll as parameterProtokoll,
  rechtsstandZumStichtag,
  type Altersstufe,
  type ParameterHinweis,
  type Rechtsstand,
  type RechtsstandHinweis,
  type Sgb2Parameter,
} from "./parameter";

export type Sgb2Anspruch = "ja" | "nein_einkommen" | "nein_vermoegen" | "unklar_vermoegen";

export type AusserhalbGrund =
  | "kein_kind"
  | "kind_ab_18"
  | "kind_ausbildungsverguetung"
  | "erwachsener_unter_18"
  | "erwachsener_ab_65";

// Texte für die Oberfläche (M5, i18n) stehen am jeweiligen Code.
export type Sgb2Hinweis =
  /** „Das Jobcenter prüft, ob eure Miete angemessen ist. Die Grenze legt jedes Jobcenter selbst fest.“ */
  | { code: "wohnkosten_angemessenheit" }
  /** Siehe RechtsstandHinweis in parameter.ts. jahr: das Jahr des Stichtags. */
  | { code: RechtsstandHinweis; jahr: number }
  /** „Bekommt ihr Elterngeld, kann ein Teil davon frei bleiben. Das rechnet Gut Bescheid noch nicht. Euer Ergebnis kann zu niedrig sein.“ */
  | { code: "elterngeld_nicht_beruecksichtigt" }
  /** „Je nachdem, wer von euch das Kindergeld bekommt, kann die Lücke bis zu 30 € größer sein.“ */
  | { code: "kindergeld_empfaenger_offen" }
  /** „Nach den Regeln wird Erspartes über dem Freibetrag zuerst eingesetzt. Danach kann ein Anspruch bestehen.“ */
  | { code: "erspartes_zuerst_einsetzen" }
  /** „Erspartes, das einem Kind gehört, das nicht mitgerechnet wird, zählt hier nicht mit. Zieht es von eurer Summe ab.“ */
  | { code: "erspartes_kind_ausserhalb" }
  /** „Wer in dem Monat, für den gerechnet wird, 30, 40 oder 50 wird, hat schon den höheren Freibetrag.“ */
  | { code: "freibetrag_geburtstagsmonat" };

export interface Sgb2EinkommenErwachsener {
  /** § 11b Abs. 2 SGB II */
  grundabsetzbetrag: Cent;
  /** § 11b Abs. 3 SGB II */
  erwerbstaetigenfreibetrag: Cent;
  /** Grundabsetzbetrag + Erwerbstätigenfreibetrag, wie in der Tabelle der Testhaushalte. Höchstens das Netto. */
  freibetrag: Cent;
  /** Netto minus Freibetrag. */
  bereinigtesErwerbseinkommen: Cent;
  sonstigesEinkommen: Cent;
  /** § 6 Abs. 1 Nr. 1 GrusiGV, nur ohne Erwerbseinkommen. */
  versicherungspauschale: Cent;
}

export type Sgb2Ergebnis =
  | { imUmfang: false; stichtag: string; rechtsstand: string; gruende: AusserhalbGrund[] }
  | {
      imUmfang: true;
      stichtag: string;
      rechtsstand: string;
      /**
       * Bedarf der Bedarfsgemeinschaft. Wohnkosten ohne den Kopfteil von Kindern außerhalb.
       * regelbedarfeErwachsene: der Teil der Regelbedarfe, der auf die Erwachsenen entfällt.
       */
      bedarf: {
        regelbedarfe: Cent;
        regelbedarfeErwachsene: Cent;
        mehrbedarfAlleinerziehend: Cent;
        wohnkosten: Cent;
        summe: Cent;
      };
      einkommen: {
        erwachsene: Sgb2EinkommenErwachsener[];
        freibetrag: Cent;
        /** Kindergeld der Kinder in der Bedarfsgemeinschaft. */
        kindergeld: Cent;
        /** Einkommen der Kinder in der Bedarfsgemeinschaft. */
        kindeseinkommen: Cent;
        /** Was Kinder außerhalb der Bedarfsgemeinschaft vom Kindergeld nicht brauchen. Zählt beim Elternteil. */
        kindergeldUeberhang: Cent;
        /** Versicherungspauschale auf den Überhang, soweit sie unabhängig davon gilt, wer das Kindergeld bekommt. */
        versicherungspauschaleAufUeberhang: Cent;
        summe: Cent;
      };
      /** Kinder (Index in haushalt.kinder), die ihren Bedarf selbst decken (§ 7 Abs. 3 Nr. 4 SGB II). */
      kinderAusserhalbBedarfsgemeinschaft: number[];
      /**
       * Je Kind wie in haushalt.kinder, für den KiZ: Regelbedarf, Kopfteil der Wohnkosten, Kindergeld, ob es zur
       * Bedarfsgemeinschaft gehört, und sein Kindergeld-Überhang, wenn nicht.
       */
      kinder: {
        regelbedarf: Cent;
        kopfteilWohnkosten: Cent;
        kindergeld: Cent;
        inBedarfsgemeinschaft: boolean;
        ueberhang: Cent;
      }[];
      /**
       * § 72 SGB II: 25 € je Kind, wenn ein Anspruch besteht, nur das Vermögen ihn offenlässt oder ausschließt
       * (dann: nach Einsatz des Ersparten) oder der Haushalt ihn nur wegen des angerechneten Kindergelds nicht hat.
       */
      sofortzuschlag: { kinder: number; betrag: Cent };
      /** Bedarf minus Einkommen. 0 oder kleiner: kein Anspruch. */
      lueckeA: Cent;
      vermoegen: {
        freibetrag: Cent;
        ergebnis: Vermoegensergebnis;
        /** Erspartes über dem Freibetrag, als Spanne wie die Eingabe. */
        ueberFreibetrag: Spanne;
      };
      anspruch: Sgb2Anspruch;
      hinweise: Sgb2Hinweis[];
      /** Eingeflossene Parameter mit Status "pruefen" oder "geplant". */
      parameterHinweise: ParameterHinweis[];
    };

type Vermoegensergebnis = "unter_freibetrag" | "ueber_freibetrag" | "unklar";

// Umfang von Version 0 (Entscheidung vom 26.10.2026). Vereinfacht: Die Regelaltersgrenze
// nach § 7a SGB II hängt vom Geburtsjahr ab.
const ERWACHSENE_AB_ALTER = 18;
const ERWACHSENE_UNTER_ALTER = 65;

export function berechneSgb2(haushalt: Haushalt, optionen: { stichtag: string }): Sgb2Ergebnis {
  pruefeEingabe(haushalt);
  const stand = rechtsstandZumStichtag(optionen.stichtag);
  const kopf = { stichtag: optionen.stichtag, rechtsstand: stand.gueltigAb };

  const gruende = ausserhalbDesUmfangs(haushalt, stand.sgb2);
  if (gruende.length > 0) return { imUmfang: false, ...kopf, gruende };

  const p = protokoll(stand.sgb2);
  const { erwachsene, kinder } = haushalt;
  const kindergeldJeKind = p.nimm("kindergeld");
  p.nimm("wohnkosten"); // tatsächliche Kosten, Angemessenheit prüft das Jobcenter
  const wohnkostenHaushalt = haushalt.kaltmiete + haushalt.nebenkosten + haushalt.heizkosten;

  // Kinder, die ihren Bedarf (Regelbedarf + Kopfteil der Wohnkosten) aus Kindergeld und eigenem
  // Einkommen decken, gehören nicht zur Bedarfsgemeinschaft (§ 7 Abs. 3 Nr. 4 SGB II).
  const personen = erwachsene.length + kinder.length;
  const kinderRechnung = kinder.map((k, index) => {
    const regelbedarf = nachAlter(p.nimm("regelbedarfKinder"), k.alter.jahre);
    const eigenes = kindergeldJeKind + k.einkommen;
    // Kopfteil auf Cent gerundet, geprüft wird mit dem gerundeten Wert (§ 41 Abs. 2 SGB II). Die Rundung
    // gilt als eingeflossen, wenn sie die Entscheidung oder die Beträge berührt.
    const kopfteil = geteilt(wohnkostenHaushalt, personen);
    const decktBedarf = eigenes >= regelbedarf + kopfteil.cent;
    const decktUngerundet = eigenes * personen >= regelbedarf * personen + wohnkostenHaushalt;
    if (kopfteil.gerundet && (decktBedarf || decktUngerundet)) p.merkeRundung();
    const kopfteilWohnkosten = kopfteil.cent;
    if (!decktBedarf) return { index, kind: k, inBg: true, regelbedarf, kopfteilWohnkosten, kopfteil: 0, ueberhang: 0 };
    // Kindergeld zählt beim Kind nur, soweit es gebraucht wird (§ 11 Abs. 1 Satz 5 SGB II). Der Rest, höchstens
    // das Kindergeld, zählt beim kindergeldberechtigten Elternteil (BSG, B 11b AS 1/06 R; § 64 Abs. 1 EStG).
    const ueberhang = Math.min(eigenes - regelbedarf - kopfteil.cent, kindergeldJeKind);
    return { index, kind: k, inBg: false, regelbedarf, kopfteilWohnkosten, kopfteil: kopfteil.cent, ueberhang };
  });
  const kinderInBg = kinderRechnung.filter((k) => k.inBg);
  const kinderAusserhalb = kinderRechnung.filter((k) => !k.inBg);

  // Schritt 1: Bedarf
  const alleinerziehend = erwachsene.length === 1;
  const regelbedarfeErwachsene = alleinerziehend ? p.nimm("regelbedarfStufe1") : 2 * p.nimm("regelbedarfStufe2");
  const regelbedarfe = regelbedarfeErwachsene + summe(kinderInBg.map((k) => k.regelbedarf));
  // Der Mehrbedarf hängt an den Kindern im Haushalt, auch wenn sie außerhalb der Bedarfsgemeinschaft sind.
  const mehrbedarfAlleinerziehend = alleinerziehend ? mehrbedarf(kinder, p) : 0;
  const wohnkosten = wohnkostenHaushalt - summe(kinderAusserhalb.map((k) => k.kopfteil));
  const bedarfSumme = regelbedarfe + mehrbedarfAlleinerziehend + wohnkosten;

  // Schritt 2: Einkommen
  const einkommenErwachsene = erwachsene.map((e): Sgb2EinkommenErwachsener => {
    const erwerbstaetig = e.brutto > 0;
    // Abzüge höchstens bis zum Netto. Ein Rest geht nicht auf anderes Einkommen über (FW §§ 11–11b Rz. 11.155).
    const grundabsetzbetrag = erwerbstaetig ? Math.min(p.nimm("grundabsetzbetrag"), e.netto) : 0;
    const erwerbstaetigenfreibetrag = erwerbstaetig
      ? Math.min(freibetragNachStufen(e.brutto, kinder, p), e.netto - grundabsetzbetrag)
      : 0;
    const freibetrag = grundabsetzbetrag + erwerbstaetigenfreibetrag;
    // Wer Erwerbseinkommen hat, hat die Versicherungspauschale schon im Grundabsetzbetrag (§ 11b Abs. 2 SGB II).
    // Im Umfang sind alle Erwachsenen volljährig.
    const versicherungspauschale =
      !erwerbstaetig && e.sonstigesEinkommen > 0
        ? Math.min(p.nimm("versicherungspauschale"), e.sonstigesEinkommen)
        : 0;
    return {
      grundabsetzbetrag,
      erwerbstaetigenfreibetrag,
      freibetrag,
      bereinigtesErwerbseinkommen: e.netto - freibetrag,
      sonstigesEinkommen: e.sonstigesEinkommen,
      versicherungspauschale,
    };
  });
  // Kindergeld zählt als Einkommen des Kindes.
  const kindergeld = kindergeldJeKind * kinderInBg.length;
  const kindeseinkommen = summe(kinderInBg.map((k) => k.kind.einkommen));
  const kindergeldUeberhang = summe(kinderAusserhalb.map((k) => k.ueberhang));
  const { abzug: versicherungspauschaleAufUeberhang, haengtAmKindergeld: pauschaleHaengtAmKindergeld } =
    kindergeldUeberhang === 0
      ? { abzug: 0, haengtAmKindergeld: false }
      : pauschaleAufUeberhang(
          erwachsene,
          einkommenErwachsene.map((e) => e.versicherungspauschale),
          kindergeldUeberhang,
          p.nimm("versicherungspauschale"),
        );
  const einkommenSumme =
    summe(
      einkommenErwachsene.map((e) => e.bereinigtesErwerbseinkommen + e.sonstigesEinkommen - e.versicherungspauschale),
    ) +
    kindergeld +
    kindeseinkommen +
    kindergeldUeberhang -
    versicherungspauschaleAufUeberhang;

  const lueckeA = bedarfSumme - einkommenSumme;

  // Vermögen: Freibeträge aller Personen der Bedarfsgemeinschaft, untereinander übertragbar.
  const freibetragTabelle = p.nimm("vermoegensfreibetrag");
  const alterInBg = [...erwachsene.map((e) => e.alter), ...kinderInBg.map((k) => k.kind.alter.jahre)];
  const vermoegensfreibetrag = summe(alterInBg.map((alter) => nachAlter(freibetragTabelle, alter)));
  const vermoegensergebnis = vergleicheVermoegen(haushalt.vermoegen, vermoegensfreibetrag);
  // Monatsregel (§ 12 Abs. 2 Satz 2 SGB II): Der höhere Freibetrag gilt ab dem Monat, in dem die Altersgrenze
  // erreicht wird. Wir kennen nur volle Jahre und nehmen an, alle hätten im Monat des Stichtags Geburtstag.
  const freibetragImGeburtstagsmonat = summe(alterInBg.map((alter) => nachAlter(freibetragTabelle, alter + 1)));

  const anspruch = anspruchAus(lueckeA, vermoegensergebnis);

  // § 72 SGB II: 25 € je Kind mit Anspruch, auch für Kinder, die ihren Bedarf nur mit dem Kindergeld decken
  // (Abs. 1 Satz 2 Nr. 2). Ebenso, wenn der ganze Haushalt nur wegen des angerechneten Kindergelds keinen Anspruch
  // hat: Lücke A ohne Kindergeld wäre positiv. Ohne Kindergeld entfällt auch der Überhang samt der Pauschale, die
  // nur seinetwegen abging, und Kinder außerhalb mit Einkommen unter ihrem Bedarf kämen in die Bedarfsgemeinschaft
  // zurück. Gerechnet wird mit dem ganzen Kindergeld des Haushalts, nicht je Kind. Entscheidung von Nico am
  // 28.10.2026, Status pruefen. Kinder mit nur einem Anspruch auf Bildung und Teilhabe (Nr. 1) rechnet Version 0
  // nicht. Bei nein_vermoegen gilt der Sofortzuschlag für den Fall, dass nach Einsatz des Ersparten ein Anspruch
  // besteht (vergleich.ts).
  const zurueckOhneKindergeld = summe(
    kinderAusserhalb.map((k) => Math.max(k.regelbedarf + k.kopfteil - k.kind.einkommen, 0)),
  );
  const lueckeOhneKindergeld =
    lueckeA + kindergeld + kindergeldUeberhang - versicherungspauschaleAufUeberhang + zurueckOhneKindergeld;
  const nurWegenKindergeld =
    anspruch === "nein_einkommen" && vermoegensergebnis !== "ueber_freibetrag" && lueckeOhneKindergeld > 0;
  if (nurWegenKindergeld) p.merke("sofortzuschlagOhneAnspruch");
  const kinderMitSofortzuschlag =
    anspruch !== "nein_einkommen" || nurWegenKindergeld
      ? kinderRechnung.filter((k) => k.inBg || k.kind.einkommen < k.regelbedarf + k.kopfteilWohnkosten).length
      : 0;
  const sofortzuschlag = kinderMitSofortzuschlag === 0 ? 0 : kinderMitSofortzuschlag * p.nimm("sofortzuschlagKind");
  const geburtstagsmonatAendertErgebnis =
    anspruchAus(lueckeA, vergleicheVermoegen(haushalt.vermoegen, freibetragImGeburtstagsmonat)) !== anspruch;

  const jahr = Number(optionen.stichtag.slice(0, 4));
  const hinweise: Sgb2Hinweis[] = [
    { code: "wohnkosten_angemessenheit" },
    ...stand.hinweise.map((code) => ({ code, jahr })),
  ];
  if (erwachsene.some((e) => e.sonstigesEinkommen > 0)) hinweise.push({ code: "elterngeld_nicht_beruecksichtigt" });
  if (pauschaleHaengtAmKindergeld) hinweise.push({ code: "kindergeld_empfaenger_offen" });
  // „Danach kann ein Anspruch bestehen“ stimmt nur, wenn Lücke A positiv ist oder der Sofortzuschlag ohne Anspruch
  // in Frage kommt.
  if ((lueckeA > 0 || nurWegenKindergeld) && vermoegensergebnis !== "unter_freibetrag") {
    hinweise.push({ code: "erspartes_zuerst_einsetzen" });
  }
  // Erspartes eines Kindes außerhalb der Bedarfsgemeinschaft zählt nicht für die Eltern, steckt aber in der
  // Haushaltssumme. Der Hinweis kommt nur, wenn das Vermögen über das Ergebnis entscheidet oder es offen lässt.
  if (kinderAusserhalb.length > 0 && (anspruch === "nein_vermoegen" || anspruch === "unklar_vermoegen")) {
    hinweise.push({ code: "erspartes_kind_ausserhalb" });
  }
  if (geburtstagsmonatAendertErgebnis) hinweise.push({ code: "freibetrag_geburtstagsmonat" });

  const { von, bis } = haushalt.vermoegen;
  return {
    imUmfang: true,
    ...kopf,
    bedarf: { regelbedarfe, regelbedarfeErwachsene, mehrbedarfAlleinerziehend, wohnkosten, summe: bedarfSumme },
    einkommen: {
      erwachsene: einkommenErwachsene,
      freibetrag: summe(einkommenErwachsene.map((e) => e.freibetrag)),
      kindergeld,
      kindeseinkommen,
      kindergeldUeberhang,
      versicherungspauschaleAufUeberhang,
      summe: einkommenSumme,
    },
    kinderAusserhalbBedarfsgemeinschaft: kinderAusserhalb.map((k) => k.index),
    kinder: kinderRechnung.map((k) => ({
      regelbedarf: k.regelbedarf,
      kopfteilWohnkosten: k.kopfteilWohnkosten,
      kindergeld: kindergeldJeKind,
      inBedarfsgemeinschaft: k.inBg,
      ueberhang: k.ueberhang,
    })),
    sofortzuschlag: { kinder: kinderMitSofortzuschlag, betrag: sofortzuschlag },
    lueckeA,
    vermoegen: {
      freibetrag: vermoegensfreibetrag,
      ergebnis: vermoegensergebnis,
      ueberFreibetrag: {
        von: Math.max(0, von - vermoegensfreibetrag),
        bis: bis === null ? null : Math.max(0, bis - vermoegensfreibetrag),
      },
    },
    anspruch,
    hinweise,
    parameterHinweise: p.hinweise(),
  };
}

/**
 * Versicherungspauschale auf einen Kindergeld-Überhang beim Elternteil. Ohne Erwerbseinkommen gilt sie einmal für
 * das gesamte Einkommen der Person, also auch für den Überhang (BSG, B 4 AS 49/13 R). Wer das Kindergeld bekommt,
 * fragt Version 0 nicht (Entscheidung vom 26.10.2026). Deshalb nur der Abzug, der für jeden der Erwachsenen gälte.
 * haengtAmKindergeld: Der Abzug wäre bei einem der Erwachsenen höher.
 */
export function pauschaleAufUeberhang(
  erwachsene: Erwachsener[],
  schonAbgezogen: Cent[],
  ueberhang: Cent,
  pauschale: Cent,
): { abzug: Cent; haengtAmKindergeld: boolean } {
  const jePerson = erwachsene.map((e, i) =>
    e.brutto > 0 ? 0 : Math.min(pauschale, e.sonstigesEinkommen + ueberhang) - (schonAbgezogen[i] ?? 0),
  );
  const abzug = Math.min(...jePerson);
  return { abzug, haengtAmKindergeld: Math.max(...jePerson) > abzug };
}

/** Merkt sich, welche Parameter eingeflossen sind. Die Rundung gilt nur dann als eingeflossen, wenn sie etwas ändert. */
function protokoll(parameter: Sgb2Parameter) {
  const p = parameterProtokoll("sgb2", parameter);
  return {
    ...p,
    merkeRundung(): void {
      p.merke("rundung");
    },
    anteil(betrag: Cent, prozent: number): Cent {
      const ergebnis = anteil(betrag, prozent);
      if (ergebnis.gerundet) p.merke("rundung");
      return ergebnis.cent;
    },
  };
}

type Protokoll = ReturnType<typeof protokoll>;

/** § 21 Abs. 3 SGB II: der höhere Wert aus Grundsatz und Satz je Kind, höchstens der Höchstsatz. */
function mehrbedarf(kinder: Kind[], p: Protokoll): Cent {
  const m = p.nimm("mehrbedarfAlleinerziehend");
  const unter = (alter: number) => kinder.filter((k) => k.alter.jahre < alter).length;
  const mehrere = unter(m.mehrereKinderUnterAlter);
  const grund =
    unter(m.einKindUnterAlter) >= 1 || (mehrere >= m.mehrereKinderAnzahlVon && mehrere <= m.mehrereKinderAnzahlBis)
      ? m.prozentGrund
      : 0;
  const prozent = Math.min(Math.max(grund, m.prozentJeKind * kinder.length), m.prozentHoechstens);
  return p.anteil(p.nimm("regelbedarfStufe1"), prozent);
}

/** § 11b Abs. 3 SGB II: Prozent je Stufe vom Brutto. Mit minderjährigem Kind endet die letzte Stufe später. */
function freibetragNachStufen(brutto: Cent, kinder: Kind[], p: Protokoll): Cent {
  const { stufen, obergrenzeMitMinderjaehrigemKindCent } = p.nimm("erwerbstaetigenfreibetrag");
  // Im Umfang sind alle Kinder minderjährig (ab 18: außerhalb des Umfangs). Annahme: Beide Erwachsenen sind
  // Eltern der Kinder. Ein Stiefelternteil, dessen einziges Stiefkind außerhalb der Bedarfsgemeinschaft steht,
  // hätte nur 1.200 € (§ 11b Abs. 3 Satz 3 SGB II). Version 0 fragt die Elternschaft nicht ab.
  const mitMinderjaehrigemKind = kinder.length > 0;
  return summe(
    stufen.map((stufe, i) => {
      const bisCent =
        i === stufen.length - 1 && mitMinderjaehrigemKind ? obergrenzeMitMinderjaehrigemKindCent : stufe.bisCent;
      const teil = Math.min(Math.max(brutto - stufe.uebersteigtCent, 0), bisCent - stufe.uebersteigtCent);
      return p.anteil(teil, stufe.prozent);
    }),
  );
}

function anspruchAus(lueckeA: Cent, vermoegen: Vermoegensergebnis): Sgb2Anspruch {
  if (lueckeA <= 0) return "nein_einkommen";
  if (vermoegen === "ueber_freibetrag") return "nein_vermoegen";
  if (vermoegen === "unklar") return "unklar_vermoegen";
  return "ja";
}

function vergleicheVermoegen(vermoegen: Spanne, freibetrag: Cent): Vermoegensergebnis {
  if (vermoegen.von > freibetrag) return "ueber_freibetrag";
  if (vermoegen.bis !== null && vermoegen.bis <= freibetrag) return "unter_freibetrag";
  return "unklar";
}

/** Prüft die Eingabe (wirft bei kaputten Werten) und nennt die Gründe, aus denen der Haushalt außerhalb des Umfangs liegt. */
export function pruefeHaushalt(haushalt: Haushalt, stand: Rechtsstand): AusserhalbGrund[] {
  pruefeEingabe(haushalt);
  return ausserhalbDesUmfangs(haushalt, stand.sgb2);
}

function ausserhalbDesUmfangs(haushalt: Haushalt, p: Sgb2Parameter): AusserhalbGrund[] {
  const gruende: AusserhalbGrund[] = [];
  if (haushalt.erwachsene.some((e) => e.alter < ERWACHSENE_AB_ALTER)) gruende.push("erwachsener_unter_18");
  if (haushalt.erwachsene.some((e) => e.alter >= ERWACHSENE_UNTER_ALTER)) gruende.push("erwachsener_ab_65");
  if (haushalt.kinder.length === 0) gruende.push("kein_kind");
  // Regelbedarfe gibt es im Fachkonzept nur bis 17 Jahre (Stufe 3 fehlt).
  if (haushalt.kinder.some((k) => stufeNachAlter(p.regelbedarfKinder.wert, k.alter.jahre) === undefined)) {
    gruende.push("kind_ab_18");
  }
  if (haushalt.kinder.some((k) => k.ausbildungsverguetung > 0)) gruende.push("kind_ausbildungsverguetung");
  return gruende;
}

function stufeNachAlter(tabelle: Altersstufe[], alter: number): Altersstufe | undefined {
  return tabelle.find((s) => alter >= s.vonAlter && (s.bisAlter === null || alter <= s.bisAlter));
}

function nachAlter(tabelle: Altersstufe[], alter: number): Cent {
  const stufe = stufeNachAlter(tabelle, alter);
  if (stufe === undefined) throw new RangeError(`Kein Wert für Alter ${alter}.`);
  return stufe.cent;
}

function summe(betraege: Cent[]): Cent {
  return betraege.reduce((a, b) => a + b, 0);
}

function pruefeAlter(wert: unknown, feld: string, hoechstens = Number.MAX_SAFE_INTEGER): void {
  if (typeof wert !== "number" || !Number.isSafeInteger(wert) || wert < 0 || wert > hoechstens) {
    throw new RangeError(`${feld} muss eine ganze Zahl von 0 bis ${hoechstens} sein, nicht ${String(wert)}.`);
  }
}

function pruefeEingabe(h: Haushalt): void {
  if (typeof h.gemeinde?.name !== "string" || (h.gemeinde.kreis !== null && typeof h.gemeinde.kreis !== "string")) {
    throw new TypeError("gemeinde braucht einen Namen (Text) und einen Kreis (Text oder null).");
  }
  if (!Array.isArray(h.erwachsene) || h.erwachsene.length < 1 || h.erwachsene.length > 2) {
    throw new RangeError(`Erwachsene: einer oder zwei, nicht ${h.erwachsene?.length}.`);
  }
  h.erwachsene.forEach((e, i) => {
    pruefeAlter(e.alter, `erwachsene[${i}].alter`, 150);
    pruefeBetrag(e.brutto, `erwachsene[${i}].brutto`);
    pruefeBetrag(e.netto, `erwachsene[${i}].netto`);
    pruefeBetrag(e.sonstigesEinkommen, `erwachsene[${i}].sonstigesEinkommen`);
  });
  if (!Array.isArray(h.kinder)) throw new TypeError("kinder muss eine Liste sein.");
  h.kinder.forEach((k, i) => {
    pruefeAlter(k.alter?.jahre, `kinder[${i}].alter.jahre`, 150);
    pruefeAlter(k.alter?.monate, `kinder[${i}].alter.monate`, 11);
    pruefeBetrag(k.einkommen, `kinder[${i}].einkommen`);
    pruefeBetrag(k.ausbildungsverguetung, `kinder[${i}].ausbildungsverguetung`);
  });
  pruefeBetrag(h.kaltmiete, "kaltmiete");
  pruefeBetrag(h.nebenkosten, "nebenkosten");
  pruefeBetrag(h.heizkosten, "heizkosten");
  pruefeBetrag(h.vermoegen?.von, "vermoegen.von");
  if (h.vermoegen.bis !== null) {
    pruefeBetrag(h.vermoegen.bis, "vermoegen.bis");
    if (h.vermoegen.bis < h.vermoegen.von) throw new RangeError("vermoegen: bis liegt vor von.");
  }
}
