# K2 „Fahrplan“ – Gestaltung „Haltestelle“

**„Haltestelle“ ist die Grundlage für M5** (Entscheidung von Nico am 02.11.2026). Die Oberfläche in `apps/web` baut auf
Aufbau, Farben, Schrift und Bausteinen von `haltestelle/` auf. Das Design-System im Repo (`design/tokens.json`, `design/tokens.css`)
wird erst nach den Tests mit Familien angepasst. Bis dahin gelten die Tokens oben in `haltestelle/haltestelle.css`.

Klickbare HTML-Prototypen, entstanden am 01. und 02.11.2026 als Gegenentwurf zu R2 „Liniennetz“.
Kritik an R2, Begründungen, Risiken und Prüfungen: `BERICHT.md`.

| Ordner | Was |
|---|---|
| `haltestelle/` | **gewählt.** Abendlicht an der Haltestelle; euer Haushalt steht als Figuren auf der Linie |
| `skizze/` | nicht gewählt, bleibt zum Vergleich. Der Weg, von Hand aufgezeichnet. Wird nicht weiter gepflegt |
| `gemeinsam/` | Ablauf, Texte und Fälle für beide (`daten.js`, `k2.js`) |
| `schriften/` | woff2 mit OFL-1.1-Lizenz. Haltestelle: Vollkorn (normal, kursiv), Alegreya Sans (400, 700). Skizze: Shantell Sans, Atkinson Hyperlegible Next |
| `screens/` | 390 × 844, Faktor 2, hell und dunkel; `ganz/` volle Höhe; `vorher-r2/` derselbe Ablauf in R2 (Stand 01.11.) |
| `werkzeuge/` | `screens.mjs` (Screenshots), `pruefen.mjs` (Kontrast, Farbsehschwäche, axe, Fokus hinter dem Fuß, RDG-Satz ohne Scrollen), `lokal.mjs` (liefert den Ordner in Playwright aus) |
| `pruefung-automatisch.md` | Ergebnis von `pruefen.mjs` |

## Herkunft

Texte, Beträge, Fälle (T01, T03, T04, kein_anspruch, außerhalb) und Ablauf stammen 1:1 aus dem Export der Design-Fläche
„Gut Bescheid – Gegenkonzepte und Gestaltung“, Seite „3b K2 klickbar“ (https://claude.ai/artifact/D7RJcFMWf3Qz6BU8s8u63m),
Stand 01.11.2026. Der Export-Ordner `k2-prototyp-quelle/` ist danach gelöscht worden, nicht committet.

Abweichungen vom Export, alle auf Entscheidung vom 02.11.2026:
- **Reihenfolge im Ergebnis:** Kopfzeile, dann Beträge mit RDG-Satz, dann Einordnung. Der Export zeigte die Einordnung zuerst.
  Damit steht der RDG-Satz bei 390 × 844 ohne Scrollen sichtbar unter den Beträgen, wie im Fachkonzept („erst Wie viel?“).
- **Reihenfolge der Wegkarten und Reiter:** Der Weg, den das Regelwerk zuerst verlangt, steht links und trägt den Grund
  („zuerst beantragen“ bei `weg_b_deckt`, „deckt euren Bedarf“ bei `nur_weg_a`). Sonst steht A links, B rechts. Die beiden Etiketten sind neuer Text.
- Startbildschirm K1 „Brief“ nicht übernommen.

## Regeln aus den Prüfungen, für M5 übernehmen

- Pflicht nie auf `--a-flaeche` setzen. Die beiden Flächen sind bei Deuteranopie kaum zu unterscheiden.
- Der RDG-Satz steht auf derselben Karte direkt unter den Beträgen. Ohne Scrollen sichtbar bei 390 × 844 und 360 × 740; bei 375 × 667 und 320 × 568 noch nicht (offen, siehe `BERICHT.md` Abschnitt 8).
- Wegkarten liegen auf einem gemeinsamen Raster (CSS subgrid) mit fester Spaltenbreite. Beträge dürfen vor „€“ umbrechen.
- Fokus darf nie hinter dem klebenden Fuß liegen (`scroll-padding-bottom` = Fußhöhe + 16 px).

## Zwei Arten von „Entwurf“

| Art | Zeichen | Wo |
|---|---|---|
| **Regelwerk oder Rechtsprüfung trägt es noch nicht** | immer sichtbar: gestrichelte Marke „Entwurf“ | „Weiß ich nicht“ bei Beträgen (das Regelwerk rechnet es erst nach dem 30.11.2026); „Nach 4 Wochen ohne Bescheid: Vorschuss beantragen“ |
| **Wortlaut noch nicht geprüft** | unsichtbar, sichtbar mit `?entwurf=1` | alle Texte, die im Export als „Entwurf“ markiert waren, und die zwei neuen Etiketten an den Wegkarten |

Die Wortlaut-Entwürfe bleiben unsichtbar, damit sie den Fünf-Sekunden-Test („Wer hat das gemacht? Eine Behörde?“) nicht beeinflussen.

## Vorgemerkt für den rechts-pruefer

**Vorschuss in der Wartezeit** („Nach 4 Wochen ohne Bescheid: Vorschuss beantragen. Das ist Geld vorab, das später verrechnet wird.“):
- Die Station steht auf beiden Wegen, also auch nach einem Antrag auf Grundsicherung (Warten bei T04).
  `docs/offene-rechtsfragen.md` Punkt 36 deckt den Vorschuss nach § 42 SGB I nur für Kinderzuschlag und Wohngeld ab.
  Frage: Gilt das für Weg A ebenso, oder geht dort eine eigene Regel vor (etwa die vorläufige Entscheidung nach § 41a SGB II)?
- „Nach 4 Wochen“: § 42 Abs. 1 Satz 2 SGB I spricht von „spätestens nach Ablauf eines Kalendermonats nach Eingang des Antrags“.
  Passt „4 Wochen ohne Bescheid“ dazu, und muss man überhaupt warten, bevor man den Vorschuss beantragt?
- „das später verrechnet wird“: stimmt das für alle Fälle (§ 42 Abs. 2 SGB I)?

**Etiketten an den Wegkarten:** „zuerst beantragen“ und „deckt euren Bedarf“ sind kurze Fassungen von Sätzen aus der Einordnung.
Bitte auf RDG prüfen (allgemeine Regel, keine Empfehlung im Einzelfall). Danach `text-lektor`.

## Öffnen

In Edge und Chrome reicht ein Doppelklick auf `haltestelle/index.html` (geprüft am 01.11.2026).
Firefox lädt über `file://` keine Schriften aus dem Nachbarordner `schriften/`. Dort einen lokalen Server nutzen,
zum Beispiel im Ordner `design/prototyp-k2`: `python -m http.server 8765`, dann `http://127.0.0.1:8765/haltestelle/`.
Ohne Parameter startet der Prototyp beim Bildschirm für die Testleitung.

Parameter: `fall=T01|T03|T04|KEIN|AUS`, `screen=leitung|start|ort|wer|kinder|ausserhalb|geld|angaben|ergebnis|folgen|antrag|warten`,
`theme=hell|dunkel`, `wahl=A|B` (T03), `reiter=A|B`, `pflicht=<Karten-ID>`, `beleg=1`, `entwurf=1`.

## Screenshots und Prüfung neu erzeugen

Playwright ist nicht im Projekt installiert. Mit einer eigenen Installation:

```
PLAYWRIGHT=<pfad>/node_modules/playwright/index.mjs node werkzeuge/screens.mjs [haltestelle|skizze]
PLAYWRIGHT=<…>/playwright/index.mjs AXE=<…>/@axe-core/playwright/dist/index.mjs node werkzeuge/pruefen.mjs > pruefung-automatisch.md
```

Browser ist der installierte Microsoft Edge (`BROWSER_KANAL=chrome` oder `chromium` zum Wechseln).
