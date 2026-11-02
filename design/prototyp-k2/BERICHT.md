# K2 neu gestaltet: Kritik an R2, zwei Varianten, Empfehlung

Stand 01.11.2026, Nachtrag 02.11.2026 (Abschnitt 8). Grundlage: Export der Design-Fläche vom 01.11.2026 (Ordner `k2-prototyp-quelle/`, inzwischen gelöscht), `docs/forschung/verhaltensdiagnose.md`,
`docs/forschung/verhaltensdiagnose-pruefung.md`, `docs/fachkonzept-v0.md`. Alle Aussagen über die Zielgruppe sind dort
überwiegend als **angenommen** markiert. Gestaltung kann sie nicht belegen, nur im Test prüfbar machen.

## 0. Werkzeuge

Benutzt: `design-skills:design-critique` (Kritik), `frontend-design` (Richtung, Schrift, Signatur, Selbstkritik an Screenshots),
`design-skills:design-elevation` nur als Prüffragen. Dessen Vorgaben (Tailwind, Inter) widersprechen den festen Regeln und blieben draußen.
Barrierefreiheit: eigenes Prüfskript mit axe-core und Farbsehschwäche-Simulation, danach der Projekt-Subagent `a11y-pruefer`.
Nicht benutzt: `ux-writing` und `design:ux-copy`, weil kein neuer Text entstehen durfte. `interaction-design` nicht geladen. Ablauf und
Interaktion sind aus der Quelle übernommen. `accessibility-audit` nicht geladen, weil `a11y-pruefer` und axe denselben Zweck erfüllen.

## 1. Kritik an R2 „Liniennetz“

Geprüft am nachgebauten Original (gleiches Markup, gleiche CSS). Bilder in `screens/vorher-r2/`.

### Was „Amt“ erzeugt

| Befund | Beleg in R2 | Hypothese aus dem Chat | Ergebnis |
|---|---|---|---|
| **Die Linie spricht die Sprache eines Verkehrsbetriebs.** Fast schwarze 6-px-Linien, Ringhaltestellen, Endhaltestelle als Quadrat, dazu Fira Sans. Das ist Gestaltung, die eine Institution für die Öffentlichkeit macht. | Fünf Linien-Bausteine: Leiste, Strecke, Weiche, Wegstrich, Monatsbalken (dazu der Rand bei „Stellen“) | „Linienplan wirkt institutionell“ | bestätigt, präzisiert: Nicht die Metapher ist das Problem, sondern ihre Ausführung im Code des ÖPNV-Aushangs und ihre Wiederholung |
| **Farbe ist nur Signal.** Etwa 95 % der Fläche sind `#FBFBF8` und `#161616`. Die Tokens sagen es selbst: Linie „trägt keine Bedeutung“, Grund „kein Creme und kein Amtsgrau“. Grauweiß und Schwarz ist die Farbigkeit eines Bescheids. | `tokens.json`, `grund`, `linie`, `tief` | „Farbe nur als Signal, nie als Stimmung“ | bestätigt |
| **Formular-Grammatik.** Auf dem Ergebnis T04 sind im ersten Bildschirm 5 gerahmte Kästen und 3 Trennlinien zu sehen (Kopf, Leiste, Fuß). „Pflicht“ ist ein 2-px-Rahmen auf Graphit, wirkt also wie ein Stempel. „Wird geprüft“ hat einen gestrichelten Rahmen wie ein Formularfeld. Sieben Textarten stehen in Fett 700. | `gb-karte`, `gb-weg`, `.entwurf`, `.gb-label.pflicht` | „Kästen, Rahmen, Schildchen, kleiner Text“ | bestätigt. Dazu: Die Hälfte der Kästen ist Testgerüst (gestrichelte „Entwurf“-Rahmen). Sie verstärken den Formular-Eindruck genau in dem Test, der „Eine Behörde?“ fragt. |
| **Kleiner Text.** Fließtext 15 px, Zeitangaben, RDG-Satz und Wegname 14 px. Für eine Zielgruppe mit teils wenig Lesesicherheit wirkt das wie Kleingedrucktes. | `.t`, `.gb-rdg`, `.gb-wann`, `.gb-wegname` | „kleiner Text“ | bestätigt |
| **Kein Gegenüber.** Niemand spricht. Die warmen Sätze der Quelle („Das liegt nicht an euch.“) stehen in derselben grauen 15-px-Schrift wie Rechtstext, dazu im gestrichelten Entwurfs-Kasten. Die Stimme ist im Text da, in der Gestaltung nicht. | Warten, Haltestelle „Jetzt“ | „kein Mensch, keine Bildsprache“ | bestätigt, aber anders benannt: Es fehlt weniger ein Bild von Menschen als jemand, der spricht, und ein Moment, in dem man sich wiedererkennt |
| **Flache Hierarchie, gleiche Lautstärke.** Titel 26–30 px halbfett, Haltestellen 17 px fett, Beträge 25 px fett, alles in einer Familie. Nichts ist leise, nichts ist Atmosphäre. | `.titel`, `.gb-was`, `.gb-betrag` | – | neu |
| **Rahmen eines Formular-Assistenten.** Kopfzeile mit Linie, Schrittleiste mit Linie, Fuß mit Linie. | `.bar`, `.leiste`, `.foot` | – | neu |
| **Weg A in Beere.** `#AD185F` liegt im LCh-Farbton bei 359°, zwischen Rot (etwa 40°) und Magenta (etwa 330°). Neben einer Liste von Pflichten kann er als Rotton gelesen werden. | `weg-a` | – | Einschätzung, messbar ist der Ton näher an Magenta. Im Test prüfen. |
| **„Unabhängig, kein Amt“** muss oben stehen, weil die Gestaltung es nicht selbst sagt. | Kopfzeile Start | – | Folge, nicht Ursache |

### Was am Konzept liegt und was an der Gestaltung

- **Konzept (K2), bleibt:** Der Fahrplan beantwortet die Frage „Wann kommt Geld?“ und macht das Warten sichtbar (Wartezeit ist belegt, H3). Das ist menschlich und soll bleiben.
- **Konzept, lässt sich nur abmildern:** Der Fahrplan *ist* ein Verwaltungsablauf (Antrag, Bescheid, Warten). Er steht auf jedem Bildschirm. Bei `nur_weg_a` wird der Weg zur Folge von Pflicht-Haltestellen. Das ist ehrlich, wirkt aber schwer. Gestaltung kann den Ton ändern, nicht den Inhalt.
- **Inhalt, nicht Gestaltung:** Bei T04 stehen 6 bis 8 Zeilen Einordnung vor den Beträgen, also landen die Beträge am unteren Rand. Der Name enthält „Bescheid“, ein Amtswort. Die Gestaltung sollte zu „Bescheid wissen“ kippen, nicht zum Brief vom Amt.
- **Gestaltung, frei änderbar:** Linien-Code, Farbklima, Schrift, Kästen und Stempel, Textgrößen, Rahmen-Chrome, fehlende Stimme.

### Widersprüche, die ich gefunden und nicht angeglichen habe

1. **Reihenfolge im Ergebnis.** Das Fachkonzept sagt: erst „Wie viel?“, dann „Was heißt das?“. Die Quelle zeigt erst die Einordnung, dann die Beträge. Beide Varianten folgen der Quelle.
2. **Gleiches Gewicht.** Die feste Regel lautet „Weg A und B gleich stark“. Die Prüfung der Verhaltensdiagnose (D1) sagt dagegen: Kein gleiches Gewicht für einen Weg, den das Regelwerk ausschließt. Das betrifft `weg_b_deckt` und `nur_weg_a`. Beide Varianten folgen der festen Regel. Die Entscheidung liegt bei dir.

## 2. Zwei Varianten

Beide Varianten nutzen dasselbe Markup und dieselben Texte (`gemeinsam/k2.js`). Unterschiede entstehen nur durch Gestaltung.
Gemeinsam: Fließtext 17–19 px statt 15 px, Knöpfe 56–58 px hoch, keine Rahmen-Linien um Kopf und Leiste,
Entwurfs-Markierung nur auf Wunsch (`?entwurf=1`), Pflicht als Wort und Zeichen ohne Farbe, Wege gleich stark (Kontrast ±0,05 : 1).

### Variante 1 „Skizze“: Der Mensch als Gegenüber

*Jemand, der sich auskennt, zeichnet euch den Weg auf.*

- **Linie von Hand.** Strecke, Haltestellen und Leiste sind gezogene Pfade. Schleifen schließen nicht ganz, Kanten stehen leicht schief. Das löst den Verkehrsbetriebs-Code auf, behält aber Haltestelle, Linie und Ziel.
- **Stimme in Handschrift.** Nur die Sätze, die das Gegenüber „sagt“, stehen in Shantell Sans und dunkler Tinte: „Hier startest du“, „Hier bist du“, „Wie lange, sagt euch vorher niemand. Das liegt nicht an euch.“ Die aktuelle Haltestelle ist in der Leiste von Hand eingekreist, die gewählte Antwort auch. Grund: Warten ist der belegte Tiefpunkt (H3). Dort steht der wärmste Moment.
- **Farbe als Buntstift.** Himmelblaue Schraffur hinter dem Startsatz, Pflaume und Ocker als Schraffur der beiden Wege. Farbe wird Atmosphäre, bleibt aber leicht.
- **Schrift.** Shantell Sans (OFL) für Titel, Fragen und Notizen, ruhig eingestellt (Achse „informell“ 0, kein Hüpfen; Notizen höchstens 1° schräg). Atkinson Hyperlegible Next (OFL) für alles, was man genau lesen muss: Text, Beträge, Knöpfe. Sie wurde für Menschen mit eingeschränktem Sehen entwickelt. Beispiele: 0 und O, l und I sind verschieden.
- **Kästen weg.** Trennung durch gezogene Linien. Nur das Ergebnis hat einen Rahmen von Hand, weil der RDG-Satz auf derselben Karte stehen muss.
- **Pflicht** ist ein leeres, von Hand gezogenes Kästchen (eine Aufgabe) mit dem Wort „Pflicht“, ohne Farbe.

### Variante 2 „Haltestelle“: Der Mensch als Spiegel

*Abendlicht an der Haltestelle. Ihr steht als Figuren auf eurer Linie.*

- **Farbe als Stimmung.** Oben ein tiefes Pflaume wie Abendhimmel. Honiglicht am Haltestellenschild, bei „Hier bist du“ und im Ziel (ein erleuchtetes Fenster). Darunter helle Flächen ohne Rahmen, Ecken 20–26 px, runde Knöpfe.
- **Signatur: euer Haushalt auf der Linie.** Einfache Holzfiguren ohne Gesicht und ohne Geschlecht, in Farben der Palette statt Hautfarben. Sie entstehen aus den Angaben: Nach der Frage zu den Erwachsenen stehen die Erwachsenen da, nach der Frage zu den Kindern die Kinder, in der Größe nach Alter. Sie stehen an der Haltestelle, an der ihr gerade seid. Beim Warten sitzen sie auf der Bank unter dem Licht. Auf dem Start steht nur eine leere Bank, weil wir euch noch nicht kennen. Bezug: „Gilt das für mich?“ (A1) und Scham (A8, H9). Das Bild zeigt eine Familie an einer Haltestelle, also Alltag und keinen „Fall fürs Amt“.
- **Ergebnisse gleich gestaltet.** Das Bild ist bei allen Ergebnisarten dasselbe: Figuren an der Haltestelle „Ergebnis“. Kein froheres Bild für Weg B, kein traurigeres bei `kein_anspruch`.
- **Schrift.** Vollkorn (OFL, Friedrich Althausen) für Titel, Fragen und Beträge. Sie ist warm, kräftig und für langes Lesen gemacht. Alegreya Sans (OFL) für den Text, 18–20 px. Der Trost-Satz beim Warten steht kursiv in Vollkorn auf einer weichen Fläche.
- **Wege** in Blau und Ocker auf getönten Flächen, beide weit weg von Rot und Grün. Die Handlung ist ein runder Knopf in Pflaume.
- **Pflicht** ist eine Haltestelle als abgerundetes Quadrat und eine Plakette „Pflicht“ mit Kästchen-Zeichen, ohne Rot.

## 3. Risiken

| | Variante 1 „Skizze“ | Variante 2 „Haltestelle“ |
|---|---|---|
| Ton | Handschrift kann bei Geldthemen verspielt oder wenig ernst wirken. „Schulheft“ statt „jemand, der sich auskennt“. | Figuren können kindlich wirken („Bilderbuch“). Das gefährdet die Würde von Erwachsenen mit Geldsorgen. |
| Recht (RDG) | Handschrift wirkt persönlich, wie eine Beratung im Einzelfall. Gut Bescheid ist aber allgemeine Information. Das sollte der `rechts-pruefer` ansehen, vor allem bei Notizen nahe am Betrag. | Gering. Die Figuren zeigen nur die eingegebenen Angaben. |
| Lesbarkeit | Titel und Fragen in Handschrift lesen sich langsamer. Die Fragen sind zugleich Beschriftung der Eingabefelder. Das ist ein Risiko bei wenig Lesesicherheit (laut a11y-pruefer das größte dieser Variante). Schraffur ist feine Textur und kann auf schwachen Displays flimmern. Text auf Schraffur hat jetzt mindestens 5,27 : 1. | Alegreya Sans hat eine kleine x-Höhe, darum 18–20 px. Vollkorn-Ziffern sind schön, aber ungewohnt. |
| Bedeutung von Farbe | Kaum, Farbe ist leicht. | Pflaume und Violett liegen nah an der Farbe der Diakonie und an kirchlichem Violett. Man könnte einen kirchlichen Träger vermuten. Abendstimmung kann für manche schwer wirken („Sorgen am Abend“). Im Fünf-Sekunden-Test fragen. |
| Darstellung von Familien | – | Die Zahl der Figuren stimmt. Beziehungen zeigen die Figuren nicht, das ist Absicht. Patchwork und getrennte Haushalte sind trotzdem nur so gut abgebildet wie die Fragen. Eine Familie, die sich nicht wiedererkennt, fühlt sich ausgeschlossen. |
| Platz | Leiste 70 px hoch, wie R2 | Band oben etwa 190 px auf jedem Bildschirm. Beträge rutschen tiefer. Auf kleinen Handys (320 px breit) prüfen. |
| Nähe zu früheren Entwürfen | „Papier und Tinte“ erinnert an Version 1 des Designsystems, ist aber ohne Textmarker und ohne Bricolage. | neu |
| Pflege | Handgezeichnete Pfade sind Einzelstücke. Neue Zeichen brauchen dieselbe Hand. | Figuren-Logik ist Code, leicht zu pflegen. |

## 4. Barrierefreiheit

Automatisch geprüft mit `werkzeuge/pruefen.mjs`, Ergebnis in `pruefung-automatisch.md`. Stand nach allen Korrekturen:
- **axe-core** (WCAG 2.0/2.1/2.2 A und AA): 12 Bildschirme je Variante und Modus, also 48 Läufe. **Keine Verstöße.**
- **Fokus hinter dem klebenden Fuß (2.4.11):** jeder Bildschirm per Tab durchlaufen, **kein Element verdeckt**. Gegenprobe: Ohne die Korrektur verdeckt der Fuß auf „Folgen T04“ 5 bzw. 6 von 22 Elementen. Die Messung erkennt den Fehler also.
- **Kontrast** aller Token-Paare, auch Text auf Schraffur, auf getönten Wegflächen, auf dem Band und auf dem Licht: alle ≥ 4,5 : 1 (Text) bzw. ≥ 3 : 1 (Grafik, Rahmen, Fokus).
- **Wege gleich stark:** Skizze 6,99 / 7,00 (hell) und 9,21 / 9,19 (dunkel). Haltestelle 6,13 / 6,08 und 10,17 / 10,20.
- **Farbsehschwäche** (ΔE2000 nach Machado-Simulation): Weg A ↔ Weg B in Skizze mindestens 10,7 (hell) und 12,3 (dunkel), jeweils bei Tritanopie. In Haltestelle über 38. Zum Vergleich R2 dunkel: 8,4. Weg ↔ Handlung mindestens 15,2.
- Kleinste Schrift 14 px (Leiste), kleinste Berührfläche 48 px.

## 5. Empfehlung

**Ich würde Variante 2 „Haltestelle“ nehmen**, unter zwei Bedingungen für den Test.

Warum:
1. Sie bringt das Fehlende am deutlichsten zurück: Atmosphäre und den Moment „Das sind wir“. R2 fehlte beides, nicht nur Farbe.
2. Sie bleibt wörtlich im Fahrplan (Haltestelle, Bank, Warten, Licht am Ziel). Es kommt keine zweite Metapher dazu.
3. Gleiche Gestaltung der Ergebnisse ist eingebaut, nicht nur versprochen: dasselbe Bild für alle Ergebnisarten.
4. Das geringere Risiko für Recht und Lesbarkeit: keine Handschrift, kein Text auf Textur. Der a11y-pruefer kommt unabhängig zum selben Schluss (Abschnitt 6).

Bedingungen:
- Im Fünf-Sekunden-Test zusätzlich fragen: „Wer, glaubst du, steht dahinter?“ Damit lässt sich prüfen, ob Pflaume an Kirche oder Diakonie denken lässt. Und: „Für wen ist das gemacht?“ Damit lässt sich prüfen, ob die Figuren kindlich wirken.
- Das Band auf Fragebildschirmen niedriger machen, wenn die Beträge im Test zu tief rutschen.

Variante 1 ist die intimere. Wenn der Test zeigt, dass die Figuren kindlich wirken, ist „Skizze“ die bessere Rückfallebene. Vorher braucht sie aber ein Urteil des `rechts-pruefer` zur Handschrift.

## 6. Prüfung durch den a11y-pruefer

Der Subagent hat meine Zahlen mit eigenem Code nachgerechnet (Stichproben gleich) und Fokus, Umbruch und Textabstand mit Playwright gemessen.
Sein Fazit: **Variante 2 hat das geringere Risiko.** Ihre Flächen sind voll, also sind die Kontraste eindeutig. Der Fließtext steht in ruhiger Satzschrift, und ihre Mängel lassen sich über Tokens beheben.
Variante 1 hatte einen eigenen AA-Blocker und wenig Puffer auf der Schraffur. Dazu kommt Handschrift in Fragen und Hinweisen.

| Befund | Variante | Schwere | Umgesetzt |
|---|---|---|---|
| Fokus verschwindet hinter dem klebenden Fuß (2.4.11) | beide | blockiert AA | `scroll-padding-bottom` = Fußhöhe + 16 px, nachgeführt per ResizeObserver (`gemeinsam/k2.js`); gemessen: 0 verdeckt |
| Fokus auf dem gewählten Weg-Knopf (T03) nicht sichtbar (2.4.7) | Skizze | blockiert AA | Auswahl als `box-shadow`, Fokus mit 7 px Abstand |
| Bei 200 % Zoom (195 × 422) belegt der Fuß 55 % der Höhe (1.4.10) | beide | sollte | Fuß klebt unter 480 px Höhe nicht mehr |
| „kein Geld“ läuft bei 320 px mit Textabstand aus der Karte (1.4.12) | beide | Hinweis | darf umbrechen |
| Weg-Knöpfe in T03 ohne erkennbare Grenze (1.4.11) | beide | Hinweis | 2 px Rahmen in `--rand` |
| Text auf Schraffur nur 4,70 : 1 | Skizze | sollte | Wege auf 7,0 : 1 gehoben, auf Schraffur jetzt 5,27 / 5,36 |
| Weg A gleicht unter Farbsehschwäche der Handschrift-, Fokus- und Kringelfarbe, wirkt dadurch empfohlen | Skizze | sollte | Handschrift und Fokus hell `#1E2A55`, dunkel `#E6EAFF`. Seine Werte (`#243070`, `#D3DCFF`) habe ich nachgerechnet: Mit dem neuen Weg A lagen sie nur bei ΔE 8,9 und 8,1. Meine Werte erreichen mindestens 12,9. |
| Handschrift schräg und hüpfend, Fragen in Handschrift sind Feld-Beschriftungen | Skizze | sollte | Hüpfen aus, „informell“ auf 0 bei Titeln und Fragen, Notizen höchstens 1° schräg. **Nicht umgesetzt:** Fragen in Atkinson. Das würde die Idee der Variante aufheben. Wenn der Test Leseprobleme zeigt, ist das der nächste Schritt. |
| Dunkler Honig gleicht Weg B (ΔE 4,8 schon bei normalem Sehen), Weg B wirkt wie das Ziel | Haltestelle | sollte | Licht im Dunkelmodus `#F7D9C4` (zu Weg B jetzt mindestens 10,0) |
| Weg A ↔ Handlung (hell) und Weg A ↔ Strecke (dunkel) unter Farbsehschwäche zu nah | Haltestelle | sollte | Handlung hell `#3B2142`, Strecke dunkel `#EBC7D9` |
| Zustand „gewählt“ nur über Füllung, die unter Farbsehschwäche der Weg-A-Fläche gleicht (1.4.1) | Haltestelle | sollte | Häkchen in der gewählten Option, Rahmen in Textfarbe, keine Füllung mehr |
| Weg-Zeichen für A und B gleich, nur die Farbe unterscheidet | beide | Hinweis | nicht umgesetzt: „Weg A“ und „Weg B“ stehen immer als Wort daneben |
| „Hier bist du“ hat dieselbe Pillenform wie der Handlungsknopf | Haltestelle | Hinweis | nicht umgesetzt, im Test beobachten |
| Pflicht-Fläche und Weg-B-Fläche unter Tritan ähnlich | Haltestelle | Hinweis | nicht umgesetzt: Wort und Zeichen sind vorhanden |

Nicht umgesetzt habe ich auch seinen Vorschlag, den Datenschutz-Satz aus dem Fuß zu nehmen. Seine Stelle kommt aus der Quelle, und der Fuß klebt bei 200 % Zoom ohnehin nicht mehr.

## 7. Was offen ist

- Kein Test mit der Zielgruppe. Alle Wirkungen oben sind Annahmen.
- Nicht geprüft: echte Screenreader-Ausgabe (NVDA, VoiceOver), Zoom auf 200 % von Hand, sehr kleine Handys (320 px).
- Folgen-, Antrag- und Leitungsbildschirm sind gebaut und automatisch geprüft, aber nicht fotografiert.
- Die Tokens der gewählten Variante gehören danach ins Designsystem-Artefakt (Quelle für `design/tokens.json`).

## 8. Nachtrag 02.11.2026: Entscheidung „Haltestelle“ und Korrekturen

Entscheidung von Nico: „Haltestelle“ wird Grundlage für M5, mit sechs Korrekturen. Messwerte aus `pruefung-automatisch.md`.

**1. Weg A in Petrol statt Blau** (Regel „kein Behördenblau“).
- Hell `#0E6673` auf Fläche `#DDEEF0`, dunkel `#3EACC4` auf `#16303A`. Farbton LCh 217° (hell) und 223° (dunkel).
  Zum Vergleich: Grün 136°, Türkis 196°, das alte Blau 283°. Petrol liegt damit auf der blauen Seite von Türkis, weit weg von Grün.
- Gleich stark wie Weg B: hell 6,09 : 6,08, dunkel 6,98 : 6,98.
- Im Dunkelmodus habe ich beide Wege von 10,2 auf 7,0 : 1 gesenkt. Grund: Helles Petrol und die helle Pflaume von Strecke und Knopf
  verschwammen bei Farbsehschwäche (ΔE bis 2,8). Mit dem Abstand in der Helligkeit sind es jetzt mindestens 12,4. Weg B ist dafür ein satteres Ocker `#CA9624`.
  Der erste dunkle Wert `#37AEBD` (212°) wirkte laut a11y-pruefer türkis. Darum `#3EACC4`, näher am hellen Petrol.
- Die Strecke ist hell jetzt `#3B2142` (wie Knopf und Abendband), damit Weg A sich auch von Strecke und Pflicht-Haltestellen abhebt (ΔE mindestens 14,9).
- Farbsehschwäche, kleinster Wert über Normal, Protan, Deutan, Tritan: Weg A ↔ Weg B 33,4 (hell) und 42,3 (dunkel); Weg A ↔ Handlung 14,9 und 17,9; Weg A ↔ Strecke 14,9 und 12,4; Weg ↔ Licht mindestens 19,4.
- Fläche Weg A ↔ Pflicht-Fläche liegt bei Deuteranopie nur bei ΔE 2,0 (hell) und 1,8 (dunkel). Laut a11y-pruefer reicht das (1.4.1 erfüllt), weil Pflicht immer Wort und Kästchen-Zeichen trägt und die Flächen nirgends aneinandergrenzen. **Regel für M5: Pflicht nie auf `--a-flaeche` setzen.**

**2. Feste Reihenfolge der Wegkarten.** Ich habe deinen Vorschlag übernommen:

| Ergebnis | links | rechts | Etikett links |
|---|---|---|---|
| `weg_b_deckt` | B | A | „zuerst beantragen“ |
| `nur_weg_a` | A | B | „deckt euren Bedarf“ |
| `erweiterter_zugang` | A | B | – |
| `kein_anspruch` | A | B | – |

Begründung:
- Links wird zuerst gelesen, auch vom Screenreader. Wenn das Regelwerk eine Reihenfolge vorgibt, stimmen so Lesereihenfolge, Kopfzeile und Handlung überein. Das verlangt auch D1 der Prüfung: „klar ‚erst Kinderzuschlag und Wohngeld‘“.
- Wo das Regelwerk nichts vorgibt, steht immer A links. Das ist berechenbar und wertet nicht.
- Die Alternative wäre immer A links. Dann stünde bei `weg_b_deckt` der Weg, den man zuerst beantragen muss, rechts. Kopfzeile und Leserichtung würden sich widersprechen.
- Das Etikett nennt nur den Grund nach den Regeln. Es ist neutral gestaltet: weiße Pille, Textfarbe, kein Stern, keine Farbe.
  Bei `nur_weg_a` lautet es bewusst nicht „zuerst beantragen“. Wer Grundsicherung bekommt, bekommt in der Regel kein Wohngeld (Ausschluss nach § 7 Abs. 1 WoGG, vgl. `docs/offene-rechtsfragen.md` Punkt 36). Ein „danach“ für Weg B gibt es also nicht. Der Text ist aus der Kopfzeile genommen. Die Aussage gehört mit zur Vormerkung für den rechts-pruefer.
- Beide Etiketten sind neuer Text und als Wortlaut-Entwurf markiert (rechts-pruefer, text-lektor).
- Die Reiter auf „Was das für euren Alltag heißt“ folgen derselben Regel. Die Karten liegen auf einem gemeinsamen Raster, damit Beträge auf einer Höhe stehen, auch wenn ein Etikett umbricht.

**3. RDG-Satz ohne Scrollen.** Neue Reihenfolge im Ergebnis: Kopfzeile, dann die Karte mit Beträgen und RDG-Satz, dann die Einordnung.
Anders ging es nicht: Bei T04 standen 7 Zeilen Einordnung vor den Beträgen, damit lag der RDG-Satz unter dem Fuß.
Gemessen: Bei 390 × 844 und 360 × 740 steht der RDG-Satz in allen vier Ergebnisarten über dem Fuß. Für Bildschirme bis 760 px Höhe gibt es dafür eine kompaktere Darstellung (kleinerer Titel, engere Abstände, flachere Weiche).
**Offen, deine Entscheidung:** Bei 375 × 667 fehlen 38 bis 54 px (T01, T04, T03), bei 320 × 568 108 bis 197 px. Dort reicht Verdichten nicht.
Möglich wären: (a) unter 700 px Höhe die Figuren im Band ausblenden, (b) unter 700 px Höhe den Fuß nicht kleben lassen, dann rutscht der Knopf ans Ende,
(c) den rechts-pruefer fragen, ob „auf derselben Karte, direkt unter dem Betrag“ genügt, auch wenn man auf kleinen Handys etwas scrollen muss. Ich würde (c) zuerst klären.
Damit ist auch Widerspruch 1 aus Abschnitt 1 im Sinne des Fachkonzepts gelöst („erst Wie viel?“).

**4. und 5. Entwurf sichtbar.** „Weiß ich nicht“ und „Nach 4 Wochen ohne Bescheid“ tragen eine sichtbare, gestrichelte Marke „Entwurf“.
Andere Entwürfe betreffen nur den Wortlaut und bleiben unsichtbar (`?entwurf=1`), damit sie den Fünf-Sekunden-Test nicht färben.
Die Fragen an den rechts-pruefer zum Vorschuss stehen in `LIESMICH.md`.

**6. Zwei Schriftfamilien reichen.** Vollkorn trägt Titel, Fragen, Beträge und den Trost-Satz (kursiv). Alegreya Sans trägt Text, Knöpfe und Kennzeichen.
- Eine dritte Familie bräuchte es nur für Ziffern oder Code. Vollkorn hat aber Tabellen- und Versalziffern (`lining-nums tabular-nums`), die Beträge stehen also sauber.
- Ich habe Alegreya Sans auf zwei Schnitte gekürzt (400 und 700, vorher auch 500 und 800). Der Zustand „gewählt“ hängt nicht mehr an einem fetteren Schnitt, sondern an Häkchen und Rahmen.
- Haltestelle lädt jetzt vier Dateien mit zusammen 138 KB.
- Eine Familie allein (nur Vollkorn) rate ich nicht. Lange Folgen-Texte in Serifenschrift sind für Menschen mit wenig Lesesicherheit eher schwerer.
- Risiko bleibt die kleine x-Höhe von Alegreya Sans. Darum ist Text 18–20 px groß. Im Test auf Lesbarkeit achten.

### a11y-pruefer, zweite Runde (02.11.2026)

Sein Fazit: ein AA-Blocker, sonst „sollte“ und Hinweise. Alle Messungen danach mit `werkzeuge/pruefen.mjs` und einer eigenen Nachmessung bei Textabstand.

| Befund | Schwere | Umgesetzt |
|---|---|---|
| Bei Textabstand (1.4.12) und schmalen Bildschirmen wuchs die linke Wegkarte über ihre Spalte, die rechte verdeckte den Betrag | blockiert AA | Spalte fest (`minmax(0, 1fr)`), Betrag darf vor „€“ umbrechen, Größe 27–35 px je nach Breite, Wegname mit Silbentrennung. Nachgemessen bei 320, 360, 375, 390 px, hell und dunkel: kein Überlauf, keine Überdeckung. „Skizze“ läuft bei 320 px noch über; sie wird nicht weiter gepflegt |
| RDG-Satz auf kleineren Bildschirmen unter dem Fuß | eure Vorgabe, kein WCAG-Kriterium | 360 × 740 jetzt erfüllt; 375 × 667 und 320 × 568 offen, siehe Punkt 3 oben |
| Dunkles Petrol wirkt türkis | Hinweis | `#3EACC4` (223°) |
| Fläche Weg A ↔ Pflicht-Fläche bei Deuteranopie gleich | Hinweis | Regel „Pflicht nie auf `--a-flaeche`“ |
| Wegkarten nicht als Liste ausgezeichnet (1.3.1) | sollte | `<ul class="wege">` mit `<li>` |
| Ziel im Dunkelmodus: Licht auf heller Fläche unsichtbar (1,14 : 1) | Hinweis | Fenster mit dunklem Rahmen, Licht darauf 11,7 : 1 |
| Ziffern mit Ober- und Unterlängen in Text und Muster-Lohnabrechnung | sollte | Versalziffern überall, Tabellenziffern im Muster |
| RDG-Satz 16 px | sollte | 17 px |
| Fragebildschirme ohne `<h1>` | Best Practice | die Frage ist jetzt die Überschrift |
| Marke „Entwurf“ verdeckt etwa 60 px des Fokusrings von „Weiß ich nicht“ | Hinweis | nicht geändert, der Rest des Rings bleibt sichtbar |

Er bestätigt außerdem: gleiche Stärke der Wege, Petrol liest sich nicht als Signalgrün, das Etikett hebt aus Sicht der Barrierefreiheit keine Karte unzulässig hervor, Kontrast und Knopfname der Marke „Entwurf“ sind in Ordnung, zwei Schriftfamilien sind lesbar.
