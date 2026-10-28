---
name: meilenstein
description: Use when the user says to start or continue a milestone (M1–M6) from docs/fachkonzept-v0.md.
---

# Meilenstein umsetzen

1. **Lesen:** CLAUDE.md, den Abschnitt des Meilensteins in docs/fachkonzept-v0.md, betroffene Dateien.
2. **Fragen stellen**, bevor Code entsteht: Was ist unklar, was widerspricht sich, welche Werte fehlen? Höchstens 5 Fragen.
3. **Plan zeigen:** Dateien, Tests, Reihenfolge. Auf Freigabe warten.
4. **Tests zuerst** (Vitest), dann Implementierung, bis alles grün ist. Rote Tests wegen fehlender Rechtswerte bleiben rot und werden gemeldet.
5. **Prüfen lassen:** für Regelwerk den Subagenten `rechts-pruefer`, für Oberfläche `a11y-pruefer` und `text-lektor`.
6. **Offene Rechtsfragen ergänzen:** Jede neue Annahme, die eine menschliche Rechtsprüfung braucht, kommt nach `docs/offene-rechtsfragen.md` (Frage, unsere Annahme, Fundstellen, betroffene Tests). Geklärte Punkte dort als geklärt markieren.
7. **Abschluss-Bericht** (kurz): fertig / offen / zu prüfen, Befehl zum Selbst-Ansehen (`pnpm test`, `pnpm dev`), Vorschlag für die Commit-Nachricht.
8. Kein Commit ohne ausdrückliche Freigabe.
