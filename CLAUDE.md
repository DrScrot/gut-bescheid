# Gut Bescheid – Arbeitsregeln für Claude Code

## Projekt
Folgen-Check "Was passiert, wenn ich beantrage?": anonym, local-first, vergleicht für Familien in Bayern
Weg A (Grundsicherung, SGB II) mit Weg B (Kinderzuschlag + Wohngeld + Bildung und Teilhabe)
nach Betrag UND Folgen (Pflichten, Prüfungen, Fristen). Open Source, Lizenz EUPL-1.2 (entschieden 26.10.2026).

## Quelle der Wahrheit
- Fachlich: docs/fachkonzept-v0.md. Bei Widerspruch oder Lücke: nachfragen, nicht raten.
- Jeder Parameter: { wert, fundstelle, gueltigAb, status } mit status "geprueft" | "aus_quelle" | "pruefen" | "geplant".

## Harte Regeln
- Erfinde nie Gesetzeswerte. Fehlt ein Wert: Parameter mit status "pruefen" und TODO mit Fundstelle anlegen,
  Test rot lassen und am Ende der Sitzung melden.
- Erst Tests aus packages/regelwerk/tests/haushalte schreiben, dann implementieren.
- Ein Meilenstein pro Sitzung (M1–M6, siehe Fachkonzept). Am Ende: was fertig ist, was offen ist, was geprüft werden muss.
- Geld intern in ganzen Cent. Wohngeld-Formel (§ 19 WoGG, Anlage 3) mit Festkomma, 10 Nachkommastellen.
- Regelwerk (packages/regelwerk) ohne UI- und Netzwerk-Abhängigkeiten. Rechtsstand per Stichtag wählbar.
- Keine personenbezogenen Daten verlassen das Gerät. Keine Analytics, keine Tracker.
- Texte: einfache Sprache, Du-Form, Sätze unter 15 Wörtern, keine Amtssprache ohne Erklärung.
- Formulierungen sind allgemeine Information über Regeln, keine Einzelfallprognose (RDG):
  "Nach den Regeln für 2026 ergibt sich für Haushalte mit euren Angaben etwa X €. Verbindlich entscheidet die Behörde."

## Stack
Node-LTS, pnpm-Workspaces, TypeScript strict, Vite + React (PWA), Vitest, Playwright, Dexie (IndexedDB), GitHub Pages.

## Struktur
packages/regelwerk/{parameter,daten,folgen,src,tests}
apps/web/src/{screens,speicher,sprache,i18n}

## Werkzeuge im Projekt
- Skills: `.claude/skills/regel-pflegen` (jede Rechtszahl), `texte-schreiben` (jeder sichtbare Text), `meilenstein` (Ablauf M1–M6).
- Subagenten zur unabhängigen Prüfung: `rechts-pruefer`, `text-lektor`, `a11y-pruefer`. Nach jedem Meilenstein den passenden aufrufen.
- Design: Farben, Schrift und Abstände kommen ausschließlich aus den Design-Tokens (Quelle: `design/tokens.json` und `design/tokens.css` aus dem Designsystem-Artefakt; in M5 nach apps/web/src/design/ übernehmen). Keine Ad-hoc-Farben, keine Standard-Komponentenbibliothek im Default-Look.
- Hook: Nach Edit/Write in packages/regelwerk laufen die Regelwerk-Tests automatisch (`.claude/hooks/regelwerk-tests.mjs`, eingetragen in `.claude/settings.json`).
