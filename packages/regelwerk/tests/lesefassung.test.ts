// Die Lesefassung docs/folgen-katalog.md entsteht aus folgen/*.json (Nico, 28.10.2026: „damit sie nie vom Katalog
// abweicht“). Weicht sie ab: `pnpm katalog` ausführen.
import { describe, expect, it } from "vitest";
import gespeichert from "../../../docs/folgen-katalog.md?raw";
import { FAKT_NAMEN, PLATZHALTER_NAMEN, lesefassung } from "../scripts/lesefassung";
import { FAKTEN, FOLGEN, PLATZHALTER } from "../src/folgen";

describe("Lesefassung des Folgen-Katalogs", () => {
  it("docs/folgen-katalog.md ist auf dem Stand des Katalogs (sonst: pnpm katalog)", () => {
    expect(gespeichert.replaceAll("\r\n", "\n")).toBe(lesefassung());
  });

  it("jeder Fakt hat einen lesbaren Namen, jeder Platzhalter eine Erklärung", () => {
    expect(Object.keys(FAKT_NAMEN).sort()).toEqual(Object.keys(FAKTEN).sort());
    expect(Object.keys(PLATZHALTER_NAMEN).sort()).toEqual(Object.keys(PLATZHALTER).sort());
  });

  it("enthält jede Karte, jede Einordnung, jeden Schritt und jede Unterlage", () => {
    const text = lesefassung();
    for (const e of [...FOLGEN.karten, ...FOLGEN.einordnung, ...FOLGEN.schritte, ...FOLGEN.unterlagen]) {
      expect(text).toContain(`\`${e.id}\``);
    }
  });

  it("die hervorgehobene Karte ist markiert", () => {
    expect(lesefassung()).toMatch(/`beide_reihenfolge` · \*\*hervorgehoben\*\*/);
  });
});
