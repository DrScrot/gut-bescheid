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
| `screens/` | **nicht im Repo** (seit 02.11.2026 in `.gitignore`), mit `werkzeuge/screens.mjs` erzeugen, siehe unten. 390 × 844, Faktor 2, hell und dunkel; `ganz/` volle Höhe; `vorher-r2/` R2 zum Vergleich. Der Stand vom 02.11.2026 vor der letzten Runde liegt in der Git-Historie (Commit 1f52006) |
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
  („ist nach den Regeln zuerst dran“ bei `weg_b_deckt`, „reicht nach den Regeln“ bei `nur_weg_a`). Sonst steht A links, B rechts. Die beiden Etiketten sind neuer Text,
  im Wortlaut nach rechts-pruefer und text-lektor (Punkt 46). Die Kopfzeile bei `nur_weg_a` lautet „Nach den Regeln reicht nur die Grundsicherung.“
- **Erweiterter Zugang (T03):** Kopfzeile → Beträge mit RDG-Satz → Einordnung → Karte „Reihenfolge der Anträge“ → Wahl.
  Die Reihenfolge-Karte steht vor der Wahl, weil sie vor der Wahl gelesen werden muss. Die Wahlknöpfe tragen keine Beträge mehr;
  die Beträge stehen nur auf der Karte mit dem RDG-Satz. Einordnung vor der Reihenfolge-Karte und Wahlknöpfe ohne Beträge: bestätigt von Nico am 02.11.2026.
- **Fuß auf niedrigen Bildschirmen:** Bis 700 px Höhe klebt der Fuß nicht, er scrollt mit.
- Startbildschirm K1 „Brief“ nicht übernommen.

## Regeln aus den Prüfungen, für M5 übernehmen

- Pflicht nie auf `--a-flaeche` setzen. Die beiden Flächen sind bei Deuteranopie kaum zu unterscheiden.
- Wahlknöpfe benennen den Weg eindeutig, mit Name und Wegfarbe: Wort („Weg A“ und „Grundsicherung“), dazu Punkt, Beschriftung und Fläche in der Wegfarbe.
  Name für den Screenreader: „Weg A Grundsicherung“, „Weg B Kinderzuschlag und Wohngeld“ (geprüft am 02.11.2026, hell und dunkel).
- Der RDG-Satz steht auf derselben Karte direkt unter den Beträgen, auf allen Ergebnisarten gleich. Ohne Scrollen sichtbar bei 390 × 844, 360 × 740 und 375 × 667;
  bei 320 × 568 nicht. Ob „auf derselben Karte direkt darunter“ genügt, ist offen: `docs/offene-rechtsfragen.md` Punkt 45.
- Wegkarten liegen auf einem gemeinsamen Raster (CSS subgrid) mit fester Spaltenbreite. Beträge dürfen vor „€“ umbrechen.
- Beträge und RDG-Satz stehen in einem benannten Bereich (`<section aria-label="Ergebnis">`), die Wegkarten als `<ul role="list">`.
  Kein `aria-describedby` (a11y-pruefer, 02.11.2026). Nichts mit `aria-hidden` verstecken, was sichtbar ist (z. B. die Etiketten).
- Fokus darf nie hinter dem klebenden Fuß liegen (`scroll-padding-bottom` = Fußhöhe + 16 px, nur solange der Fuß klebt).
- **Lange Erklärtexte** (z. B. „Vorläufiges Geld vom Jobcenter“, „Vorschuss beantragen“) zeigen die ersten zwei Sätze; der Rest ist aufklappbar
  (Entscheidung von Nico, 02.11.2026, für M5; im Prototyp noch nicht umgesetzt). Ausgenommen ist der RDG-Satz am Betrag: Er bleibt immer
  ganz sichtbar und ist nie einklappbar. Achtung beim Kürzen: Bei „Vorläufiges Geld vom Jobcenter“ stünde die Ausnahme
  („Liegt die lange Prüfung an Nachweisen …? Dann gibt es kein vorläufiges Geld.“) im aufklappbaren Teil. Ob die ersten zwei Sätze
  ohne Ausnahme stehen dürfen, vor M5 mit dem rechts-pruefer klären; sonst die Reihenfolge der Sätze anpassen.

## Zwei Arten von „Entwurf“

| Art | Zeichen | Wo |
|---|---|---|
| **Regelwerk oder Katalog trägt es noch nicht** | immer sichtbar: gestrichelte Marke „Entwurf“ | „Weiß ich nicht“ bei Beträgen (das Regelwerk rechnet es erst nach dem 30.11.2026); Station „Wenn es dauert“ auf „Warten“ (Weg A vorläufiges Geld, Weg B Vorschuss; rechtlich geprüft, aber noch keine Katalogkarte) |
| **Wortlaut noch nicht geprüft** | unsichtbar, sichtbar mit `?entwurf=1` | alle Texte, die im Export als „Entwurf“ markiert waren, und die zwei neuen Etiketten an den Wegkarten |

Die Wortlaut-Entwürfe bleiben unsichtbar, damit sie den Fünf-Sekunden-Test („Wer hat das gemacht? Eine Behörde?“) nicht beeinflussen.

## Rechtsprüfung und Lektorat (02.11.2026)

rechts-pruefer (Gesetze im Original gelesen, Zitate von Claude nachgelesen) und danach text-lektor. Ergebnisse mit Fundstellen in `docs/offene-rechtsfragen.md`.

| Punkt | Ergebnis | Im Prototyp |
|---|---|---|
| 44 Vorschuss in der Wartezeit | Weg A falsch: dort entscheidet das Jobcenter von sich aus vorläufig (§ 41a SGB II geht § 42 SGB I vor). „Nach 4 Wochen“ ohne Grundlage. „später verrechnet“ unvollständig | Station „Wenn es dauert“ mit eigenem Text je Weg; Hinweis auf Weg A ergänzt; Knopf „In 4 Wochen erinnern“ |
| 45 RDG-Satz auf kleinen Bildschirmen | stimmt: Gestaltungsfrage, keine Norm verlangt „ohne Scrollen“ | keine Änderung |
| 46 Etiketten an den Wegkarten | stimmt mit Einschränkung | „ist nach den Regeln zuerst dran“, „reicht nach den Regeln“; Kopfzeile `nur_weg_a` angepasst |

**Noch offen:**
- Für eine Rechts- oder Sozialberatung: Wie rechnet man „nach Ablauf eines Kalendermonats nach Eingang“ (§ 42 Abs. 1 Satz 2 SGB I)? Der Prototyp sagt vorsichtig „spätestens im übernächsten Monat“. Dazu: Verhältnis von § 26a WoGG zu § 42 SGB I.
- Vorschlag des a11y-pruefer, noch nicht umgesetzt: Kopfzeile bei `nur_weg_a` „Nach den Regeln reicht nur ein Weg.“, damit man „reicht … Grundsicherung“
  nicht dreimal hört (Kopfzeile, Etikett, Einordnung). Kein WCAG-Verstoß, nur Hörbarkeit. Neuer Text: vorher text-lektor und rechts-pruefer.
- Nach dem Freeze, nur Vorschläge: Karten `a_vorlaeufig` und `b_vorschuss`; in `einordnung_weg_b_deckt` die 3-Monats-Bedingung; Antragstext Weg A um „Schick sie aber möglichst bald.“ ergänzen.

## Öffnen

In Edge und Chrome reicht ein Doppelklick auf `haltestelle/index.html` (geprüft am 01.11.2026).
Firefox lädt über `file://` keine Schriften aus dem Nachbarordner `schriften/`. Dort einen lokalen Server nutzen,
zum Beispiel im Ordner `design/prototyp-k2`: `python -m http.server 8765`, dann `http://127.0.0.1:8765/haltestelle/`.
Ohne Parameter startet der Prototyp beim Bildschirm für die Testleitung.

Parameter: `fall=T01|T03|T04|KEIN|AUS`, `screen=leitung|start|ort|wer|kinder|ausserhalb|geld|angaben|ergebnis|folgen|antrag|warten`,
`theme=hell|dunkel`, `wahl=A|B` (T03), `reiter=A|B`, `pflicht=<Karten-ID>`, `beleg=1`, `entwurf=1`.

## Screenshots und Prüfung neu erzeugen

Die Screenshots liegen nicht im Repo. So erzeugst du sie neu (Node 24, Microsoft Edge installiert):

```
# einmal: Playwright und axe außerhalb des Projekts installieren, z. B. in einem Arbeitsordner
mkdir k2-werkzeug && cd k2-werkzeug && npm init -y && npm i playwright @axe-core/playwright

# im Projekt, Ordner design/prototyp-k2
PLAYWRIGHT=<arbeitsordner>/node_modules/playwright/index.mjs node werkzeuge/screens.mjs              # beide Varianten
PLAYWRIGHT=<arbeitsordner>/node_modules/playwright/index.mjs node werkzeuge/screens.mjs haltestelle  # nur Haltestelle
PLAYWRIGHT=<arbeitsordner>/node_modules/playwright/index.mjs AXE=<arbeitsordner>/node_modules/@axe-core/playwright/dist/index.mjs node werkzeuge/pruefen.mjs > pruefung-automatisch.md
```

`screens.mjs` schreibt nach `screens/` (je Variante 7 Bildschirme, hell und dunkel) und nach `screens/ganz/`.
Die Seiten liefert das Skript selbst aus (`werkzeuge/lokal.mjs`), ein Server ist nicht nötig.
Browser ist der installierte Microsoft Edge; mit `BROWSER_KANAL=chrome` oder `chromium` lässt er sich wechseln
(für `chromium` vorher `npx playwright install chromium` im Arbeitsordner).
Die Vergleichsbilder in `screens/vorher-r2/` lassen sich nicht neu erzeugen, weil der Export der Design-Fläche gelöscht ist.
Sie liegen in der Git-Historie (Commit 1f52006).
