// Kinderzuschlag (§ 6a BKGG): Mindesteinkommen, Höhe nach Kindes- und Elterneinkommen, Vermögen und die
// Prüfung, ob mit KiZ und Wohngeld der Bedarf nach SGB II gedeckt ist. Rechnet auf den Ergebnissen der
// SGB-II-Rechnung auf (Einkommen nach §§ 11–11b SGB II, § 6a Abs. 8 BKGG).
import { anteil, aufEuro, type Cent } from "./geld";
import type { Haushalt, Spanne } from "./haushalt";
import { protokoll, rechtsstandZumStichtag, vereinige, type ParameterHinweis } from "./parameter";
import { berechneSgb2, pauschaleAufUeberhang, type AusserhalbGrund } from "./sgb2";

export type KizAnspruch =
  | "ja"
  /** Es fehlen höchstens 100 €, Absetzbeträge wegen Erwerbstätigkeit mindestens 100 € (§ 6a Abs. 1a BKGG). */
  | "erweiterter_zugang"
  | "nein_mindesteinkommen"
  /** Nach allen Minderungen bleibt weniger als 0,50 € (DA-KiZ E.5 Abs. 2). */
  | "nein_kein_betrag"
  | "nein_vermoegen"
  /** Mit KiZ und Wohngeld fehlen mehr als 100 € oder der erweiterte Zugang greift nicht (§ 6a Abs. 1 Nr. 3 BKGG). */
  | "nein_bedarf_nicht_gedeckt";

export type Vermoegensergebnis = "unter_grenze" | "ueber_grenze" | "unklar";

// Texte für die Oberfläche (M5, i18n) stehen am jeweiligen Code.
export type KizHinweis =
  /** „Liegt euer Erspartes über {grenze} €, wird der Teil darüber im ersten Monat abgezogen. Ist er höher als ein Monat Kinderzuschlag, gibt es keinen.“ */
  | { code: "vermoegen_unklar"; grenze: Cent }
  /** „Euer Erspartes liegt über dem Freibetrag der Grundsicherung. Nach den Regeln ist Kinderzuschlag dann möglich, auch wenn noch Geld fehlt.“ */
  | { code: "erspartes_ueber_freibetrag" }
  /** „Habt ihr mindestens {ab} € Erspartes, ist Kinderzuschlag nach den Regeln trotzdem möglich.“ */
  | { code: "erspartes_freibetrag_unklar"; ab: Cent }
  /** „Nach den Regeln zählt euer Erspartes über dem Freibetrag der Grundsicherung mit. Erst dadurch ist Kinderzuschlag möglich. Ist das Ersparte aufgebraucht, kann wieder Geld fehlen.“ */
  | { code: "erweiterter_zugang_mit_erspartem" };

export type KizErgebnis =
  | { imUmfang: false; stichtag: string; rechtsstand: string; gruende: AusserhalbGrund[] }
  | {
      imUmfang: true;
      stichtag: string;
      rechtsstand: string;
      /** § 6a Abs. 1 Nr. 2 BKGG: Brutto und weiteres Einkommen der Eltern. */
      mindesteinkommen: { einkommen: Cent; grenze: Cent; erreicht: boolean };
      /** Gesamtbedarf der Eltern (§ 6a Abs. 5 BKGG). wohnkosten: Anteil der Eltern. */
      elternbedarf: {
        regelbedarfe: Cent;
        mehrbedarf: Cent;
        wohnkostenanteilProzent: number;
        wohnkosten: Cent;
        summe: Cent;
      };
      /** Einkommen der Eltern nach §§ 11–11b SGB II, ohne Wohngeld und KiZ. anderes: mit Kindergeld-Überhang. */
      einkommenEltern: { erwerb: Cent; anderes: Cent };
      /**
       * Je Kind (Index in haushalt.kinder). inBedarfsgemeinschaft: Das Kind deckt seinen Bedarf nicht schon mit
       * 45 % seines Einkommens und dem Kindergeld (DA-KiZ B.3 Abs. 2). Sonst gibt es für das Kind keinen KiZ.
       */
      kinder: { index: number; inBedarfsgemeinschaft: boolean; hoechstbetrag: Cent; minderung: Cent; betrag: Cent }[];
      /** Minderung des Gesamtkinderzuschlags durch Elterneinkommen (§ 6a Abs. 6 BKGG). */
      minderungEltern: { anderes: Cent; erwerb: Cent };
      /** Gesamtkinderzuschlag nach Minderung, vor der Rundung. */
      ungerundet: Cent;
      /** Auf volle Euro gerundet (§ 11 Abs. 2 BKGG). Rechnerisch, auch wenn kein Anspruch besteht. */
      betrag: Cent;
      vermoegen: { grenze: Cent; ergebnis: Vermoegensergebnis };
      /**
       * § 6a Abs. 1 Nr. 3 und Abs. 1a BKGG. fehlbetrag = Bedarf − Einkommen − wirksamer KiZ − Wohngeld.
       * kinderzuschlagWirksam: der Teil des KiZ, der nach SGB II beim Haushalt ankommt (siehe unten).
       * erspartesDecktFehlbetrag: Der Teil des Ersparten über dem SGB-II-Freibetrag deckt den Fehlbetrag,
       * Hilfebedürftigkeit besteht nicht. fehlbetragNachErspartem: was nach diesem Teil noch fehlt, für den
       * erweiterten Zugang (DA-KiZ C.4.2 Abs. 2).
       */
      bedarfspruefung: {
        bedarf: Cent;
        einkommen: Cent;
        kinderzuschlag: Cent;
        kinderzuschlagWirksam: Cent;
        wohngeld: Cent;
        fehlbetrag: Cent;
        fehlbetragNachErspartem: Cent;
        absetzbetraegeErwerb: Cent;
        erspartesDecktFehlbetrag: boolean;
      };
      anspruch: KizAnspruch;
      /** Was ausgezahlt würde: betrag bei Anspruch oder erweitertem Zugang, sonst 0. */
      auszahlung: Cent;
      hinweise: KizHinweis[];
      parameterHinweise: ParameterHinweis[];
    };

/**
 * wohngeld: das Wohngeld, mit dem die Bedarfsprüfung rechnet, bewilligt oder voraussichtlich (§ 6a Abs. 1 Nr. 3
 * Satz 2 und 3 BKGG). Im Vergleich kommt es aus berechneWohngeld.
 */
export function berechneKiz(haushalt: Haushalt, optionen: { stichtag: string; wohngeld: Cent }): KizErgebnis {
  const sgb2 = berechneSgb2(haushalt, { stichtag: optionen.stichtag });
  if (!sgb2.imUmfang) return sgb2;
  const stand = rechtsstandZumStichtag(optionen.stichtag);
  const p = protokoll("kiz", stand.kiz);
  const pSgb2 = protokoll("sgb2", stand.sgb2);
  const { erwachsene, kinder } = haushalt;
  const alleinerziehend = erwachsene.length === 1;

  // Mindesteinkommen: alles Einkommen der Eltern ohne Absetzbeträge (DA-KiZ C.1).
  const mindest = p.nimm("mindesteinkommen");
  const mindesteinkommenGrenze = alleinerziehend ? mindest.alleinerziehendCent : mindest.paarCent;
  const mindesteinkommen = erwachsene.reduce((s, e) => s + e.brutto + e.sonstigesEinkommen, 0);

  // Je Kind: Deckt es seinen Bedarf (Regelbedarf und Kopfteil der Wohnkosten) mit 45 % seines Einkommens und dem
  // Kindergeld, gehört es nicht zur Bedarfsgemeinschaft des KiZ (DA-KiZ B.3 Abs. 2 Satz 5–10). Sonst mindert 45 %
  // seines Einkommens nur seinen eigenen KiZ (§ 6a Abs. 3 BKGG). Für die Bedarfsprüfung gilt das SGB II (Satz 13).
  const hoechstbetrag = p.nimm("hoechstbetrag");
  const kindProzent = p.nimm("anrechnungKindeseinkommen");
  const kinderKiz = kinder.map((k, index) => {
    const sk = sgb2.kinder[index];
    if (sk === undefined) throw new Error(`SGB-II-Ergebnis fehlt für Kind ${index}.`);
    const minderung = anteil(k.einkommen, kindProzent).cent;
    const bedarf = sk.regelbedarf + sk.kopfteilWohnkosten;
    const inBedarfsgemeinschaft = minderung + sk.kindergeld < bedarf;
    // Das Kindergeld, das das Kind nicht braucht, zählt bei den Eltern (DA-KiZ C.3.2.1.1 Abs. 3 Satz 3–5).
    const ueberhang = inBedarfsgemeinschaft ? 0 : Math.min(sk.kindergeld, minderung + sk.kindergeld - bedarf);
    return {
      index,
      inBedarfsgemeinschaft,
      hoechstbetrag,
      minderung,
      betrag: inBedarfsgemeinschaft ? Math.max(hoechstbetrag - minderung, 0) : 0,
      kopfteilWohnkosten: sk.kopfteilWohnkosten,
      ueberhang,
    };
  });
  const kinderInBg = kinderKiz.filter((k) => k.inBedarfsgemeinschaft);
  const kinderAusserhalb = kinderKiz.filter((k) => !k.inBedarfsgemeinschaft);
  const gesamt = kinderInBg.reduce((s, k) => s + k.betrag, 0);

  // Gesamtbedarf der Eltern: Regel- und Mehrbedarfe plus Anteil an den Wohnkosten nach dem 12. Existenzminimumbericht.
  // Der Kopfteil von Kindern außerhalb geht vorher ab, der Anteil richtet sich nach den Kindern in der
  // Bedarfsgemeinschaft (DA-KiZ C.3.1.2 Abs. 2). Ohne solche Kinder gibt es keinen KiZ; die Eltern tragen dann
  // rechnerisch die ganzen Wohnkosten.
  const anteile = p.nimm("wohnkostenanteilEltern");
  const tabelle = alleinerziehend ? anteile.alleinerziehend : anteile.paar;
  if (kinderInBg.length > tabelle.length) throw new RangeError(`Wohnkostenanteil für ${kinderInBg.length} Kinder fehlt.`);
  const wohnkostenanteilProzent = kinderInBg.length === 0 ? 100 : (tabelle[kinderInBg.length - 1] as number);
  const wohnkostenHaushalt = haushalt.kaltmiete + haushalt.nebenkosten + haushalt.heizkosten;
  const wohnkostenOhneKinderAusserhalb = wohnkostenHaushalt - kinderAusserhalb.reduce((s, k) => s + k.kopfteilWohnkosten, 0);
  // Auf Cent gerundet wie in den Beispielen der DA-KiZ (C.3.1.2 Abs. 2: 71 % von 484 € = 343,64 €).
  const elternWohnkosten = anteil(wohnkostenOhneKinderAusserhalb, wohnkostenanteilProzent).cent;
  const elternbedarf = {
    regelbedarfe: sgb2.bedarf.regelbedarfeErwachsene,
    mehrbedarf: sgb2.bedarf.mehrbedarfAlleinerziehend,
    wohnkostenanteilProzent,
    wohnkosten: elternWohnkosten,
    summe: sgb2.bedarf.regelbedarfeErwachsene + sgb2.bedarf.mehrbedarfAlleinerziehend + elternWohnkosten,
  };

  // Einkommen der Eltern nach SGB II (§ 6a Abs. 5 Satz 2 BKGG: alle außer den Kindern). Erwerb: Netto minus
  // Freibeträge. Anderes: weiteres Einkommen nach Versicherungspauschale und der Kindergeld-Überhang nach der
  // 45-%-Regel, nicht der Überhang des SGB II.
  const erwerb = sgb2.einkommen.erwachsene.reduce((s, e) => s + e.bereinigtesErwerbseinkommen, 0);
  const ueberhang = kinderAusserhalb.reduce((s, k) => s + k.ueberhang, 0);
  const pauschale =
    ueberhang === 0
      ? 0
      : pauschaleAufUeberhang(
          erwachsene,
          sgb2.einkommen.erwachsene.map((e) => e.versicherungspauschale),
          ueberhang,
          pSgb2.nimm("versicherungspauschale"),
        ).abzug;
  const anderes =
    sgb2.einkommen.erwachsene.reduce((s, e) => s + e.sonstigesEinkommen - e.versicherungspauschale, 0) +
    ueberhang -
    pauschale;

  // § 6a Abs. 6 BKGG, DA-KiZ C.3.2.1.3: Übersteigt das andere Einkommen allein den Bedarf, mindert dieser Teil
  // voll und das Erwerbseinkommen zu 45 %. Sonst gilt die ganze Überschreitung als Erwerbseinkommen.
  // Zwischenergebnisse auf Cent wie in der DA (45 % von 32,32 € = 14,54 €).
  const { erwerbProzent, anderesProzent } = p.nimm("anrechnungElterneinkommen");
  const minderungEltern =
    anderes > elternbedarf.summe
      ? {
          anderes: anteil(anderes - elternbedarf.summe, anderesProzent).cent,
          erwerb: anteil(erwerb, erwerbProzent).cent,
        }
      : { anderes: 0, erwerb: anteil(Math.max(erwerb + anderes - elternbedarf.summe, 0), erwerbProzent).cent };
  const ungerundet = Math.max(gesamt - minderungEltern.anderes - minderungEltern.erwerb, 0);

  // § 11 Abs. 2 BKGG, DA-KiZ E.5 Abs. 2: der Gesamtbetrag einmal kaufmännisch auf volle Euro.
  p.merke("rundung");
  const betrag = aufEuro(ungerundet);

  // Vermögen über der Grenze mindert den KiZ des ersten Monats. Ist es mehr als ein Monat KiZ, entfällt er
  // (§ 6a Abs. 3 Satz 5 bis 7 BKGG).
  const grenzen = p.nimm("vermoegensgrenze");
  const personen = erwachsene.length + kinderInBg.length;
  const vermoegensgrenze = grenzen.berechtigtCent + (personen - 1) * grenzen.jeWeiterePersonCent;
  const vermoegen = vergleicheVermoegen(haushalt.vermoegen, vermoegensgrenze, betrag);

  // Bedarfsprüfung mit dem gerundeten KiZ (Entscheidung vom 28.10.2026), für den ganzen Haushalt: Dass ein Kind
  // erst mit KiZ und Wohngeld aus der Bedarfsgemeinschaft fällt, bildet Version 0 nicht ab (Fachkonzept, Umfang).
  // Der KiZ ist Einkommen des Kindes (§ 11 Abs. 1 Satz 4 SGB II). Dem Haushalt nützt er höchstens so viel, wie dem
  // Kind ohne Kindergeld zu seinem Bedarf fehlt (Regelbedarf + Kopfteil − eigenes Einkommen): Was darüber liegt,
  // bleibt beim Kind, weil beim Elternteil höchstens das Kindergeld ankommt (§ 11 Abs. 1 Satz 5). Bei Kindern, die
  // nach SGB II schon außerhalb der Bedarfsgemeinschaft stehen, ist das Kindergeld minus Überhang; bei Kindern in
  // der Bedarfsgemeinschaft ist es immer mehr als der KiZ. Sein Anteil am KiZ zählt nach dem Verhältnis vor der
  // Minderung durch Elterneinkommen, auf Cent gerundet (Analogie zu DA-KiZ C.3.2.1.3 Abs. 6, die je Kind auf Euro
  // rundet; Abweichung unter 1 €). Eine Versicherungspauschale auf den zusätzlichen Überhang fällt nicht an,
  // solange das Mindesteinkommen erreicht ist: Dann hat ein Erwachsener Erwerbseinkommen oder die Pauschale ist
  // verbraucht. Entscheidung von Nico am 28.10.2026.
  const unwirksam = kinderInBg.reduce((s, k) => {
    const sk = sgb2.kinder[k.index];
    if (sk === undefined || gesamt === 0) return s;
    const anteilKind = Math.floor((2 * betrag * k.betrag + gesamt) / (2 * gesamt));
    const raum = Math.max(sk.regelbedarf + sk.kopfteilWohnkosten - (kinder[k.index]?.einkommen ?? 0), 0);
    return s + Math.max(anteilKind - raum, 0);
  }, 0);
  const kinderzuschlagWirksam = betrag - unwirksam;
  // Das Wohngeld zählt für den ganzen Haushalt. Dass ein Teil davon bei Kindern außerhalb der Bedarfsgemeinschaft
  // hängen bleiben kann, bildet Version 0 nicht ab (Vereinfachung, Entscheidung von Nico am 28.10.2026).
  const fehlbetrag = sgb2.lueckeA - kinderzuschlagWirksam - optionen.wohngeld;
  // Erspartes über dem SGB-II-Freibetrag schließt Hilfebedürftigkeit aus, soweit es den Fehlbetrag deckt
  // (§ 9 Abs. 1 SGB II, DA-KiZ C.4.1 Abs. 2 und 7). Bei einer Spanne zählt die untere Grenze. Beim erweiterten
  // Zugang zählt es ebenfalls mit (DA-KiZ C.4.2 Abs. 2 Satz 2, über den Wortlaut von § 6a Abs. 1a Nr. 1 BKGG hinaus;
  // Gut Bescheid folgt der DA, Entscheidung von Nico am 28.10.2026).
  const ueberFreibetrag = sgb2.vermoegen.ueberFreibetrag;
  const erspartesDecktFehlbetrag = fehlbetrag > 0 && ueberFreibetrag.von >= fehlbetrag;
  const fehlbetragNachErspartem = Math.max(fehlbetrag - ueberFreibetrag.von, 0);
  const absetzbetraegeErwerb = sgb2.einkommen.freibetrag;
  const zugang = p.nimm("erweiterterZugang");
  const absetzbetraegeReichen = absetzbetraegeErwerb >= zugang.mindestensAbsetzbetraegeErwerbCent;

  let anspruch: KizAnspruch;
  if (mindesteinkommen < mindesteinkommenGrenze) anspruch = "nein_mindesteinkommen";
  else if (betrag === 0) anspruch = "nein_kein_betrag";
  else if (vermoegen === "ueber_grenze") anspruch = "nein_vermoegen";
  else if (fehlbetrag <= 0 || erspartesDecktFehlbetrag) anspruch = "ja";
  else if (fehlbetragNachErspartem <= zugang.hoechstensFehlbetragCent && absetzbetraegeReichen) {
    anspruch = "erweiterter_zugang";
  } else anspruch = "nein_bedarf_nicht_gedeckt";

  const zahlt = anspruch === "ja" || anspruch === "erweiterter_zugang";
  const hinweise: KizHinweis[] = [];
  if (zahlt && vermoegen === "unklar") hinweise.push({ code: "vermoegen_unklar", grenze: vermoegensgrenze });
  if (anspruch === "ja" && fehlbetrag > 0) hinweise.push({ code: "erspartes_ueber_freibetrag" });
  if (anspruch === "erweiterter_zugang" && fehlbetrag > zugang.hoechstensFehlbetragCent) {
    hinweise.push({ code: "erweiterter_zugang_mit_erspartem" });
  }
  // Nur wenn allein das Ersparte über den KiZ entscheidet: Mit der oberen Grenze der Spanne fehlte nichts mehr
  // oder, bei genug Absetzbeträgen, höchstens 100 € (erweiterter Zugang).
  const noetigUeberFreibetrag = absetzbetraegeReichen ? fehlbetrag - zugang.hoechstensFehlbetragCent : fehlbetrag;
  if (
    anspruch === "nein_bedarf_nicht_gedeckt" &&
    (ueberFreibetrag.bis === null || ueberFreibetrag.bis >= noetigUeberFreibetrag)
  ) {
    hinweise.push({ code: "erspartes_freibetrag_unklar", ab: sgb2.vermoegen.freibetrag + noetigUeberFreibetrag });
  }

  return {
    imUmfang: true,
    stichtag: optionen.stichtag,
    rechtsstand: stand.gueltigAb,
    mindesteinkommen: {
      einkommen: mindesteinkommen,
      grenze: mindesteinkommenGrenze,
      erreicht: mindesteinkommen >= mindesteinkommenGrenze,
    },
    elternbedarf,
    einkommenEltern: { erwerb, anderes },
    kinder: kinderKiz.map(({ index, inBedarfsgemeinschaft, minderung, betrag: b }) => ({
      index,
      inBedarfsgemeinschaft,
      hoechstbetrag,
      minderung,
      betrag: b,
    })),
    minderungEltern,
    ungerundet,
    betrag,
    vermoegen: { grenze: vermoegensgrenze, ergebnis: vermoegen },
    bedarfspruefung: {
      bedarf: sgb2.bedarf.summe,
      einkommen: sgb2.einkommen.summe,
      kinderzuschlag: betrag,
      kinderzuschlagWirksam,
      wohngeld: optionen.wohngeld,
      fehlbetrag,
      fehlbetragNachErspartem,
      absetzbetraegeErwerb,
      erspartesDecktFehlbetrag,
    },
    anspruch,
    auszahlung: zahlt ? betrag : 0,
    hinweise,
    parameterHinweise: vereinige(sgb2.parameterHinweise, p.hinweise(), pSgb2.hinweise()),
  };
}

// ueber_grenze: Was über der Grenze liegt, ist mehr als ein Monat KiZ (DA-KiZ C.3.2.2.3 Abs. 2).
function vergleicheVermoegen(vermoegen: Spanne, grenze: Cent, kiz: Cent): Vermoegensergebnis {
  if (vermoegen.von - grenze > kiz) return "ueber_grenze";
  if (vermoegen.bis !== null && vermoegen.bis <= grenze) return "unter_grenze";
  return "unklar";
}
