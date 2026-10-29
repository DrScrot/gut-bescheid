// Lesbarkeit nach Amstad (deutsche Flesch-Formel): 180 − Satzlänge − 58,5 × Silben je Wort.
// Fachkonzept, Texte: mindestens 70 je Text, Sätze unter 15 Wörtern.
//
// Zählregeln (Näherung, keine Silbentrennung nach Duden):
// - Sätze enden an . ! oder ?. Abkürzungen wie „z. B.“ sind in den Texten verboten (siehe katalog.test.ts).
//   Ordnungszahlen („28. Oktober“, „im 1. Jahr“) beenden keinen Satz: Nach einer ein- oder zweistelligen Zahl mit
//   Punkt wird nicht getrennt. Ein Satz darf deshalb nicht auf eine solche Zahl enden.
// - Wörter sind Zeichenfolgen mit Buchstaben oder Ziffern. „€“ und „%“ zählen als eigenes Wort („Euro“, „Prozent“).
// - Silben: jede Gruppe aufeinanderfolgender Vokale (a, e, i, o, u, y, ä, ö, ü) ist eine Silbe. Doppellaute wie
//   „ei“ oder „au“ zählen damit richtig als eine Silbe; „Familie“ zählt 3 statt 4 Silben.
// - Zahlen zählen so viele Silben, wie sie gesprochen haben („14“ = vierzehn = 2, „1,5“ = eins Komma fünf = 4).

const ZEICHEN_ALS_WORT: Record<string, number> = { "€": 2, "%": 2 };

export interface Lesbarkeit {
  saetze: number;
  woerter: number;
  silben: number;
  /** Wörter je Satz, längster Satz zuerst. */
  satzlaengen: number[];
  amstad: number;
}

export function saetze(text: string): string[] {
  return text
    .split(/(?<=[.!?])(?<!(?:^|\s)\d{1,2}\.)\s+/)
    .map((s) => s.trim())
    .filter((s) => s !== "");
}

export function woerter(satz: string): string[] {
  return satz
    .replace(/([€%])/g, " $1 ")
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}€%]+|[^\p{L}\p{N}€%]+$/gu, ""))
    .filter((w) => w !== "");
}

export function silben(wort: string): number {
  const zeichen = ZEICHEN_ALS_WORT[wort];
  if (zeichen !== undefined) return zeichen;
  if (/^[\d.,]+$/.test(wort)) return zahlSilben(wort);
  // Wörter mit Bindestrich („Kinder-Zuschlag“, „1,5-Fache“) zählen Teil für Teil.
  if (wort.includes("-")) return wort.split("-").filter((t) => t !== "").reduce((n, t) => n + silben(t), 0);
  const gruppen = wort.toLowerCase().match(/[aeiouyäöü]+/g);
  return Math.max(1, gruppen?.length ?? 0);
}

const EINER = [1, 1, 1, 1, 1, 1, 1, 2, 1, 1]; // null, eins … neun
const BIS_ZWOELF = [...EINER, 1, 1, 1]; // zehn, elf, zwölf

function ganzzahlSilben(n: number): number {
  if (n < 13) return BIS_ZWOELF[n] ?? 1;
  if (n < 20) return 2; // dreizehn … neunzehn (sieb-zehn)
  if (n < 100) {
    const einer = n % 10;
    return einer === 0 ? 2 : (EINER[einer] ?? 1) + 1 + 2; // ein-und-zwan-zig
  }
  if (n < 1000) {
    const hunderter = Math.floor(n / 100);
    const rest = n % 100;
    return (hunderter === 1 ? 0 : ganzzahlSilben(hunderter)) + 2 + (rest === 0 ? 0 : ganzzahlSilben(rest));
  }
  const tausender = Math.floor(n / 1000);
  const rest = n % 1000;
  return (tausender === 1 ? 0 : ganzzahlSilben(tausender)) + 2 + (rest === 0 ? 0 : ganzzahlSilben(rest));
}

function zahlSilben(wort: string): number {
  const [ganz = "", komma] = wort.split(",");
  const n = Number(ganz.replaceAll(".", ""));
  if (!Number.isSafeInteger(n)) throw new Error(`Keine Zahl: ${wort}`);
  const nachkomma = komma === undefined ? 0 : 2 + [...komma].reduce((s, z) => s + (EINER[Number(z)] ?? 1), 0);
  return ganzzahlSilben(n) + nachkomma;
}

export function lesbarkeit(text: string): Lesbarkeit {
  const liste = saetze(text).map(woerter).filter((w) => w.length > 0);
  const anzahlWoerter = liste.reduce((n, s) => n + s.length, 0);
  const anzahlSilben = liste.flat().reduce((n, w) => n + silben(w), 0);
  if (liste.length === 0 || anzahlWoerter === 0) throw new Error("Leerer Text");
  const asl = anzahlWoerter / liste.length;
  const asw = anzahlSilben / anzahlWoerter;
  return {
    saetze: liste.length,
    woerter: anzahlWoerter,
    silben: anzahlSilben,
    satzlaengen: liste.map((s) => s.length).sort((a, b) => b - a),
    amstad: Math.round((180 - asl - 58.5 * asw) * 10) / 10,
  };
}
