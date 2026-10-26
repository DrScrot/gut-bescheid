---
name: regel-pflegen
description: Use when adding or changing any legal parameter, threshold, formula or Folgen-Karte in packages/regelwerk (SGB II, Kinderzuschlag, Wohngeld, BuT) or when a law changes.
---

# Regel pflegen

Ziel: Jede Zahl im Regelwerk ist nachvollziehbar, datiert und getestet. Ein falscher Wert kostet echte Menschen echtes Geld.

## Ablauf

1. **Fundstelle zuerst.** Ohne Fundstelle (Gesetz + Paragraf/Anlage, oder amtliche Weisung mit Stand) wird kein Wert eingetragen.
   Sekundärquellen (Ratgeber-Websites) nur zur Orientierung, dann status "pruefen".
2. **Parameter-Objekt anlegen** in `packages/regelwerk/parameter/<gueltigAb>/<leistung>.json`:
   ```json
   { "wert": 29700, "einheit": "cent", "fundstelle": "§ 6a Abs. 2 BKGG", "gueltigAb": "2025-01-01", "status": "geprueft", "geprueftAm": "2026-10-26" }
   ```
   status: "geprueft" (Primärquelle gelesen) | "aus_quelle" (Tabelle 1:1 übernommen, Quelle im Feld) | "pruefen" | "geplant" (Entwurf, nicht beschlossen).
3. **Nie überschreiben, immer neu datieren.** Eine Rechtsänderung bekommt einen neuen Ordner `parameter/<neues gueltigAb>/`. Alte Werte bleiben für alte Stichtage.
4. **Test zuerst.** Mindestens ein Testhaushalt in `tests/haushalte/`, dessen Ergebnis sich durch die Änderung ändert. Sollwert mit Quelle und Datum ("KiZ-Lotse, 2026-10-28").
5. **Folgen-Katalog mitdenken.** Ändert sich eine Pflicht, Frist oder Prüfung, auch `folgen/katalog.json` anpassen (Fundstelle + Status).
6. **Melden.** Am Ende auflisten: welche Werte neu/geändert, welcher Status, welche Tests, was noch "pruefen" ist.

## Verboten
- Werte aus dem Gedächtnis oder "plausibel geschätzt".
- Einen offiziellen Rechner stillschweigend nachbauen, wenn er vom Gesetz abweicht. Abweichung dokumentieren.
- Rundung "nach Gefühl": Rundungsregeln stehen im Gesetz (z. B. Anlage 3 WoGG) oder in der Weisung.
