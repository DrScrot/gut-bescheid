// Grundsicherung (SGB II): Bedarf, Einkommen nach Freibeträgen, Lücke A und Vermögensprüfung.
// Rechnet wie das Fachkonzept für den ganzen Haushalt (Entscheidungslogik, Schritte 1 und 2).
import { anteil, pruefeBetrag, type Cent } from "./geld";
import type { Haushalt, Kind } from "./haushalt";
import {
  parameterHinweis,
  rechtsstandZumStichtag,
  type Altersstufe,
  type ParameterHinweis,
  type Sgb2Parameter,
} from "./parameter";

export type Sgb2Anspruch = "ja" | "nein_einkommen" | "nein_vermoegen" | "unklar_vermoegen";

export type AusserhalbGrund = "kein_kind" | "kind_ab_18";

export type Sgb2Hinweis =
  | { code: "wohnkosten_angemessenheit" }
  | { code: "rechnung_vereinfacht"; grund: "kindeseinkommen_ueber_bedarf"; kind: number };

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
}

export type Sgb2Ergebnis =
  | { imUmfang: false; stichtag: string; rechtsstand: string; gruende: AusserhalbGrund[] }
  | {
      imUmfang: true;
      stichtag: string;
      rechtsstand: string;
      bedarf: { regelbedarfe: Cent; mehrbedarfAlleinerziehend: Cent; wohnkosten: Cent; summe: Cent };
      einkommen: {
        erwachsene: Sgb2EinkommenErwachsener[];
        freibetrag: Cent;
        kindergeld: Cent;
        kindeseinkommen: Cent;
        summe: Cent;
      };
      /** Bedarf minus Einkommen. 0 oder kleiner: kein Anspruch. */
      lueckeA: Cent;
      vermoegen: { freibetrag: Cent; ergebnis: "unter_freibetrag" | "ueber_freibetrag" | "unklar" };
      anspruch: Sgb2Anspruch;
      hinweise: Sgb2Hinweis[];
      /** Eingeflossene Parameter mit Status "pruefen" oder "geplant". */
      parameterHinweise: ParameterHinweis[];
    };

export function berechneSgb2(haushalt: Haushalt, optionen: { stichtag: string }): Sgb2Ergebnis {
  pruefeEingabe(haushalt);
  const stand = rechtsstandZumStichtag(optionen.stichtag);
  const kopf = { stichtag: optionen.stichtag, rechtsstand: stand.gueltigAb };

  const gruende = ausserhalbDesUmfangs(haushalt, stand.sgb2);
  if (gruende.length > 0) return { imUmfang: false, ...kopf, gruende };

  const p = protokoll(stand.sgb2);
  const { erwachsene, kinder } = haushalt;

  // Schritt 1: Bedarf
  const alleinerziehend = erwachsene.length === 1;
  const regelbedarfJeKind = kinder.map((k) => nachAlter(p.nimm("regelbedarfKinder"), k.alter.jahre));
  const regelbedarfe =
    (alleinerziehend ? p.nimm("regelbedarfStufe1") : 2 * p.nimm("regelbedarfStufe2")) + summe(regelbedarfJeKind);
  const mehrbedarfAlleinerziehend = alleinerziehend ? mehrbedarf(kinder, p) : 0;
  p.nimm("wohnkosten"); // tatsächliche Kosten, Angemessenheit prüft das Jobcenter
  const wohnkosten = haushalt.kaltmiete + haushalt.nebenkosten + haushalt.heizkosten;
  const bedarfSumme = regelbedarfe + mehrbedarfAlleinerziehend + wohnkosten;

  // Schritt 2: Einkommen. Kindergeld zählt als Einkommen des Kindes.
  const einkommenErwachsene = erwachsene.map((e): Sgb2EinkommenErwachsener => {
    const erwerbstaetig = e.brutto > 0;
    // Abzüge höchstens bis zum Netto. Ein Rest geht nicht auf anderes Einkommen über (FW §§ 11–11b Rz. 11.155).
    const grundabsetzbetrag = erwerbstaetig ? Math.min(p.nimm("grundabsetzbetrag"), e.netto) : 0;
    const erwerbstaetigenfreibetrag = erwerbstaetig
      ? Math.min(freibetragNachStufen(e.brutto, kinder, p), e.netto - grundabsetzbetrag)
      : 0;
    const freibetrag = grundabsetzbetrag + erwerbstaetigenfreibetrag;
    return {
      grundabsetzbetrag,
      erwerbstaetigenfreibetrag,
      freibetrag,
      bereinigtesErwerbseinkommen: e.netto - freibetrag,
      sonstigesEinkommen: e.sonstigesEinkommen,
    };
  });
  const kindergeldJeKind = p.nimm("kindergeld");
  const kindergeld = kindergeldJeKind * kinder.length;
  const kindeseinkommen = summe(kinder.map((k) => k.einkommen));
  const einkommenSumme =
    summe(einkommenErwachsene.map((e) => e.bereinigtesErwerbseinkommen + e.sonstigesEinkommen)) +
    kindergeld +
    kindeseinkommen;

  const lueckeA = bedarfSumme - einkommenSumme;

  // Vermögen: Freibeträge aller Personen, innerhalb der Bedarfsgemeinschaft übertragbar.
  const freibetragTabelle = p.nimm("vermoegensfreibetrag");
  const vermoegensfreibetrag = summe(
    [...erwachsene.map((e) => e.alter), ...kinder.map((k) => k.alter.jahre)].map((alter) =>
      nachAlter(freibetragTabelle, alter),
    ),
  );
  const { von, bis } = haushalt.vermoegen;
  const vermoegensergebnis =
    von > vermoegensfreibetrag
      ? "ueber_freibetrag"
      : bis !== null && bis <= vermoegensfreibetrag
        ? "unter_freibetrag"
        : "unklar";

  const anspruch: Sgb2Anspruch =
    lueckeA <= 0
      ? "nein_einkommen"
      : vermoegensergebnis === "ueber_freibetrag"
        ? "nein_vermoegen"
        : vermoegensergebnis === "unklar"
          ? "unklar_vermoegen"
          : "ja";

  const hinweise: Sgb2Hinweis[] = [{ code: "wohnkosten_angemessenheit" }];
  // Hat ein Kind mehr eigenes Einkommen als Bedarf (Regelbedarf + Kopfteil der Wohnkosten),
  // ist die Rechnung für den ganzen Haushalt nur eine Näherung (Kindergeld-Überhang, § 11 Abs. 1 SGB II).
  const personen = erwachsene.length + kinder.length;
  kinder.forEach((k, i) => {
    const eigenes = kindergeldJeKind + k.einkommen;
    if (eigenes * personen > (regelbedarfJeKind[i] ?? 0) * personen + wohnkosten) {
      hinweise.push({ code: "rechnung_vereinfacht", grund: "kindeseinkommen_ueber_bedarf", kind: i });
    }
  });

  return {
    imUmfang: true,
    ...kopf,
    bedarf: { regelbedarfe, mehrbedarfAlleinerziehend, wohnkosten, summe: bedarfSumme },
    einkommen: {
      erwachsene: einkommenErwachsene,
      freibetrag: summe(einkommenErwachsene.map((e) => e.freibetrag)),
      kindergeld,
      kindeseinkommen,
      summe: einkommenSumme,
    },
    lueckeA,
    vermoegen: { freibetrag: vermoegensfreibetrag, ergebnis: vermoegensergebnis },
    anspruch,
    hinweise,
    parameterHinweise: p.hinweise(),
  };
}

/** Merkt sich, welche Parameter eingeflossen sind, damit das Ergebnis ungeprüfte Werte melden kann. */
function protokoll(parameter: Sgb2Parameter) {
  const genutzt = new Set<keyof Sgb2Parameter>();
  return {
    nimm<K extends keyof Sgb2Parameter>(name: K): Sgb2Parameter[K]["wert"] {
      genutzt.add(name);
      return parameter[name].wert;
    },
    /** Anteil mit Rundung auf Cent. Die Rundung gilt nur dann als eingeflossen, wenn sie etwas ändert. */
    anteil(betrag: Cent, prozent: number): Cent {
      const ergebnis = anteil(betrag, prozent);
      if (ergebnis.gerundet) genutzt.add("rundung");
      return ergebnis.cent;
    },
    hinweise(): ParameterHinweis[] {
      return [...genutzt].flatMap((name) => parameterHinweis(`sgb2.${name}`, parameter[name]) ?? []);
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
  // Im Umfang sind alle Kinder minderjährig (ab 18: außerhalb des Umfangs).
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

function ausserhalbDesUmfangs(haushalt: Haushalt, p: Sgb2Parameter): AusserhalbGrund[] {
  const gruende: AusserhalbGrund[] = [];
  if (haushalt.kinder.length === 0) gruende.push("kein_kind");
  // Regelbedarfe gibt es im Fachkonzept nur bis 17 Jahre (Stufe 3 fehlt).
  if (haushalt.kinder.some((k) => stufeNachAlter(p.regelbedarfKinder.wert, k.alter.jahre) === undefined)) {
    gruende.push("kind_ab_18");
  }
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
