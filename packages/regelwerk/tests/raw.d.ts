// Vite lädt Dateien mit „?raw“ als Text (für den Vergleich der Lesefassung in lesefassung.test.ts).
declare module "*?raw" {
  const inhalt: string;
  export default inhalt;
}
