# Fachkonzept Version 0 – Folgen-Check

Stand: 26.10.2026 · Autor: Nico · Lebende Fassung: Claude-Doc „Fachkonzept Version 0 – Folgen-Check“. Bei Änderungen dort zuerst ändern, dann hier neu exportieren.

## Ziel und Abgrenzung

**Version 0 beantwortet einer Familie in unter 5 Minuten, anonym und ohne Gespräch, zwei Fragen: Welcher Weg bringt uns wie viel Geld? Und was folgt daraus für unseren Alltag?** Verglichen werden zwei Wege: Grundsicherung (SGB II) gegenüber Kinderzuschlag plus Wohngeld plus Bildung und Teilhabe.

**Zielgruppe:** Paare und Alleinerziehende mit mindestens einem Kind unter 18, wohnhaft in Bayern, mit Erwerbseinkommen oder vorübergehend ohne.

**Im Umfang:**

- Rechnung nach Rechtsstand 2026, und für das Wohngeld zusätzlich die *geplante* Fassung ab 1.1.2027, als solche gekennzeichnet
- Folgen-Katalog je Weg: Pflichten, Prüfungen, Kontakte mit Behörden, Fristen
- Checkliste der Unterlagen, Erinnerungen als Kalenderdatei (.ics)
- Spracheingabe für freie Angaben, alles auf dem Gerät, kein Konto

**Nicht im Umfang (bewusst):** Alleinstehende ohne Kinder, Selbstständige mit schwankendem Einkommen, Pflege, die Prüfung des Unterhaltsvorschusses selbst (wer ihn bekommt, gibt ihn als Einkommen des Kindes ein), Ausbildungsvergütung von Kindern, Kinder ab 18, Elterngeld (folgt als eigenes Feld), Eigentümer (Lastenzuschuss), Bundesländer außer Bayern, Antragstellung selbst, Post-Scanner. Wer außerhalb des Umfangs liegt, bekommt einen klaren Hinweis und Verweise auf offizielle Rechner, statt eines falschen Ergebnisses.

**Erfolgskriterien:**

| Kennzahl | Ziel |
| --- | --- |
| Abweichung vom offiziellen Rechner (KiZ-Lotse, Wohngeldrechner) bei den Testhaushalten | höchstens 1 € pro Monat |
| Zeit vom Start bis zum Ergebnis | Median unter 5 Minuten |
| Testpersonen, die sagen „Jetzt weiß ich, was passiert“ | mindestens 7 von 10 |
| Daten, die das Gerät verlassen | keine (außer Spracheingabe nach ausdrücklicher Zustimmung) |

## Nutzerfluss

```
Start (anonym, ca. 5 Min., kein Konto)
  -> 1 Wohnort und Haushalt (Gemeinde, Erwachsene, Alter der Kinder)
  -> 2 Einkommen (brutto/netto, gern geschätzt)
  -> 3 Wohnkosten (Kaltmiete, Nebenkosten, Heizung)
  -> 4 Erspartes (Spanne) und 5 Betreuung (Kita, Tagespflege, Schule)
  -> Im Umfang?
       nein -> Hinweis statt Ergebnis (Grund nennen, offizielle Rechner verlinken)
       ja   -> Ergebnis: zwei Wege im Vergleich (Euro/Monat, Rechtsstand, Schätz-Hinweis)
            -> Folgen-Karten je Weg (Pflicht, Prüfung, Gut zu wissen)
            -> Genau ein nächster Schritt (Antrag-Link, Unterlagen, Kalenderdatei)

Auf jedem Frage-Bildschirm: Mikrofon (sprechen statt tippen), Rückfrage „Stimmt das so?“,
Fortschritt (noch X Fragen, Y Minuten), Pausieren ohne Verlust, „Warum fragen wir das?“, Alles löschen.
```

Jeder Schritt besteht aus mehreren Bildschirmen mit je einer Frage.

## Eingaben: das Haushaltsmodell

**Gefragt wird nur, was die Rechnung oder der Folgen-Katalog wirklich braucht: 12 Pflichtangaben, jede auf einem eigenen Bildschirm.** Beträge dürfen geschätzt werden („ungefähr 1.800 €“). Das Ergebnis zeigt dann an, dass es auf einer Schätzung beruht.

| Feld | Typ | Wofür | Frage im Klartext |
| --- | --- | --- | --- |
| `gemeinde` | Auswahl (Gemeinde in Bayern) | Mietstufe Wohngeld | Wo wohnt ihr? |
| `erwachsene` | 1 oder 2 | Haushaltsgröße, Regelbedarfsstufe | Wohnst du allein mit den Kindern oder mit Partner oder Partnerin? |
| `kinder[]` | Liste: Alter in Jahren und Monaten, Einkommen des Kindes (Unterhalt, Unterhaltsvorschuss, Ausbildung) | Kinderzuschlag, Regelbedarf, Mehrbedarf, BuT, Zumutbarkeit (14. Lebensmonat) | Wie alt sind eure Kinder? |
| `erwachsener[].alter` | Zahl | Vermögensfreibetrag SGB II | Wie alt seid ihr? |
| `erwachsener[].brutto` | Euro pro Monat | Mindesteinkommen KiZ, Freibeträge SGB II, Wohngeld-Einkommen | Wie viel verdient ihr brutto im Monat? |
| `erwachsener[].netto` | Euro pro Monat | anrechenbares Einkommen | Und was kommt netto an? |
| `erwachsener[].sonstigesEinkommen` | Euro pro Monat (ALG I, Krankengeld, Elterngeld) | Einkommensanrechnung | Gibt es weiteres Geld, z. B. Arbeitslosengeld oder Elterngeld? |
| `kaltmiete` | Euro pro Monat | Unterkunftsbedarf, Wohngeld | Wie hoch ist eure Kaltmiete? |
| `nebenkosten` | Euro pro Monat ohne Heizung | Bruttokaltmiete (Wohngeld) | Wie hoch sind die Nebenkosten ohne Heizung? |
| `heizkosten` | Euro pro Monat | Heizbedarf SGB II | Wie viel zahlt ihr fürs Heizen? |
| `vermoegen` | Spanne (unter 10.000 / 10.000–40.000 / 40.000–70.000 / darüber) | Vermögensprüfung je Weg | Wie viel Erspartes habt ihr ungefähr zusammen? |
| `betreuung` | ja/nein je Kind (Kita, Tagespflege, Schule) | Folgen-Katalog Zumutbarkeit | Ist euer Kind tagsüber betreut? |

**Bewusst nicht gefragt in Version 0:** Namen, Geburtsdaten (nur Alter), Adresse (nur Gemeinde), Steuer-ID, Bankdaten. Die Daten liegen nur in IndexedDB auf dem Gerät und lassen sich mit einem Klick löschen („Alles löschen“ auf jedem Bildschirm erreichbar).

**Typen im Code:** Euro werden als ganze Cent in `number` (Integer) gespeichert, nie als Kommazahl. Jede Angabe trägt das Flag `geschaetzt: boolean`.

## Regelwerk: Prüflogik und Parameter

**Jede Zahl im Regelwerk trägt drei Angaben: Fundstelle, Gültigkeitsdatum und Prüfstatus.** *geprüft* heißt: am 26.10.2026 in einer Primärquelle nachgelesen. *aus Quelle laden* heißt: Die Tabelle ist zu lang für dieses Dokument und wird beim Bau 1:1 aus dem Gesetz übernommen. *prüfen* heißt: Der Wert stammt aus einer Sekundärquelle oder ist abgeleitet und muss vor dem Release bestätigt werden.

### Entscheidungslogik

1. **Bedarf nach SGB II berechnen:** Regelbedarfe + Mehrbedarfe + Kosten der Unterkunft und Heizung.
2. **Einkommen nach SGB II bereinigen:** Netto minus Freibetrag (Grundabsetzbetrag 100 € + Erwerbstätigenfreibetrag, höchstens bis zum Netto). Sonstiges Einkommen Erwachsener ohne Erwerbseinkommen minus 30 € Versicherungspauschale. Kindergeld zählt als Einkommen des Kindes; was das Kind davon nicht braucht, zählt beim Elternteil (Kindergeld-Überhang), und das Kind fällt dann aus der Bedarfsgemeinschaft. Daraus ergibt sich **Lücke A** = Bedarf minus Einkommen. Ist sie 0 oder kleiner, besteht kein Anspruch auf Grundsicherung.
3. **Weg B rechnen:** Kinderzuschlag (wenn das Mindesteinkommen erreicht ist) und Wohngeld (unter der Annahme, dass keine Grundsicherung bezogen wird).
4. **Vergleich:** Deckt Einkommen + Kindergeld + KiZ + Wohngeld den Bedarf, ist Weg B möglich. Das Jobcenter würde nach § 12a SGB II ohnehin auf die vorrangigen Leistungen verweisen. Fehlen höchstens 100 €, greift der erweiterte Zugang zum KiZ (§ 6a Abs. 1a BKGG), dann besteht eine echte Wahl. Fehlt mehr, deckt nur Weg A den Bedarf. Beide Beträge werden trotzdem gezeigt.
5. **Bildung und Teilhabe** ist auf beiden Wegen möglich. Nur die zuständige Stelle unterscheidet sich.

### Grundsicherung (SGB II), Stand ab 1.7.2026

| Parameter | Wert | Fundstelle | Status |
| --- | --- | --- | --- |
| Regelbedarf Stufe 1 (alleinerziehend) | 563 € | RBSFV 2026 | geprüft |
| Regelbedarf Stufe 2 (je Partner) | 506 € | RBSFV 2026 | geprüft |
| Regelbedarf Kind 14–17 / 6–13 / 0–5 | 471 / 390 / 357 € | RBSFV 2026 (Nullrunde) | geprüft |
| Mehrbedarf Alleinerziehende | 36 % von Stufe 1 bei Kind unter 7 oder 2–3 Kindern unter 16, oder 12 % je Kind, wenn das mehr ergibt; höchstens 60 % | § 21 Abs. 3 SGB II | geprüft |
| Grundabsetzbetrag Erwerbseinkommen | 100 € | § 11b Abs. 2 SGB II | geprüft |
| Erwerbstätigenfreibetrag | 20 % auf 100–520 €, 30 % auf 520–1.000 €, 10 % auf 1.000–1.200 € (1.500 € mit minderjährigem Kind), jeweils vom Brutto | § 11b Abs. 3 SGB II | geprüft |
| Versicherungspauschale | 30 € vom sonstigen Einkommen Volljähriger; nicht zusätzlich bei Erwerbseinkommen, dann steckt sie im Grundabsetzbetrag | § 6 Abs. 1 Nr. 1 GrusiGV | aus Quelle laden |
| Kindergeld | 259 € je Kind | § 66 Abs. 1 EStG; § 6 Abs. 1 BKGG | geprüft |
| Vermögensfreibetrag je Person | 0–29 Jahre: 5.000 €, 30–39 Jahre: 10.000 €, 40–49 Jahre: 12.500 €, ab 50 Jahren: 20.000 €. Der höhere Freibetrag gilt ab Beginn des Monats, in dem die Altersgrenze erreicht wird. Innerhalb der Bedarfsgemeinschaft übertragbar, keine Karenzzeit mehr. Auto und Altersvorsorge zählen nicht mit, die Frage nach dem Ersparten nimmt sie aus | § 12 Abs. 2 SGB II | geprüft |
| Wohnkosten | tatsächliche Kosten bis zur regionalen Angemessenheitsgrenze, im ersten Jahr höchstens 1,5-fach | § 22 SGB II | geprüft; regionale Grenzen nicht in Version 0 |
| Bewilligungszeitraum | in der Regel 12 Monate, 6 Monate bei schwankendem Einkommen | BA | geprüft |
| Rundung | zwei Dezimalstellen, ab 5 in der dritten Stelle aufrunden | § 41 Abs. 2 SGB II | prüfen |
| Stichtag ab 1.1.2027 | Regelsätze 2027 noch nicht festgelegt: gerechnet wird mit den Werten von 2026, Kindergeld 259 € | RBSFV 2027 noch nicht verkündet | prüfen |

*Hinweis Wohnkosten:* Version 0 rechnet mit den tatsächlichen Kosten und zeigt deutlich: „Das Jobcenter prüft, ob eure Miete angemessen ist. Die Grenze legt jedes Jobcenter selbst fest.“

### Kinderzuschlag (§ 6a BKGG)

| Parameter | Wert | Fundstelle | Status |
| --- | --- | --- | --- |
| Höchstbetrag je Kind | 297 € | § 6a BKGG, Merkblatt KiZ 2026 | geprüft |
| Mindesteinkommen (brutto, Durchschnitt der letzten 6 Monate) | 900 € Paare, 600 € Alleinerziehende | DA-KiZ C | geprüft |
| Anrechnung Kindeseinkommen (ohne Kindergeld) | 45 % | § 6a Abs. 3 BKGG | geprüft |
| Anrechnung Elterneinkommen | 45 % des bereinigten Einkommens über dem elterlichen Bedarf; Rundungsregel aus DA-KiZ | § 6a Abs. 6 BKGG | geprüft; Rundung: aus Quelle laden |
| Elterlicher Bedarf | Regelbedarfe der Eltern + Mehrbedarfe + Wohnkostenanteil der Eltern | DA-KiZ | geprüft |
| Wohnkostenanteil der Eltern | Paar: 1 Kind 83 %, 2 Kinder 71 %; alleinerziehend: 1 Kind 77 %, 2 Kinder 63 %; ab 3 Kindern | 12. Existenzminimumbericht, DA-KiZ | 1–2 Kinder geprüft; ab 3 Kindern aus Quelle laden |
| Erhebliches Vermögen (ganze Familie) | 2 Personen 55.000 €, 3 Personen 70.000 €, je weitere Person vermutlich +15.000 € | KiZ-1-Hinweisblatt 2026 | 2–3 Personen geprüft; Fortschreibung prüfen |
| Erweiterter Zugang | wenn mit KiZ und Wohngeld höchstens 100 € zum Bedarf fehlen | § 6a Abs. 1a BKGG | geprüft |
| Bewilligung | 6 Monate fest, nicht rückwirkend, ab Antragsmonat | Merkblatt KiZ | geprüft |

### Wohngeld (WoGG), Stand 2026 und geplant ab 1.1.2027

| Parameter | Wert | Fundstelle | Status |
| --- | --- | --- | --- |
| Formel | W = 1,15 · (M − (a + b·M + c·Y) · Y), Festkomma mit 10 Nachkommastellen | § 19 WoGG, Anlage 3 | geprüft |
| a / b / c bei 3 Personen | 0,02 / 2,917E-4 / 2,450E-5 | Anlage 2 WoGG | geprüft |
| a / b / c bei 4 Personen | 0,01 / 2,163E-4 / 1,760E-5 | Anlage 2 WoGG | geprüft |
| a / b / c bei 1, 2, 5, 6 Personen | siehe Anlage 2 | Anlage 2 WoGG | aus Quelle laden |
| Mindestwerte für M und Y, Rundung | Tabelle | Anlage 3 WoGG | aus Quelle laden |
| Höchstbeträge Miete (M) nach Mietstufe I–VII und Haushaltsgröße, plus Heizkosten- und Klimakomponente | Tabelle, seit 1.1.2025 unverändert | Anlage 1, § 12 WoGG | aus Quelle laden |
| Mietstufe der Gemeinde (Bayern I–VII) | Liste | Anlage WoGV | aus Quelle laden |
| Gesamteinkommen (Y) | Jahreseinkommen aller Haushaltsmitglieder minus pauschaler Abzug 10/20/30 % je nach Abgaben, minus Freibeträge, geteilt durch 12. Kindergeld und KiZ zählen nicht | §§ 14–18 WoGG | aus Quelle laden |
| Ausschluss | kein Wohngeld bei Bezug von Grundsicherung | § 7 WoGG | geprüft |
| Erhebliches Vermögen | 60.000 € für das erste, 30.000 € je weiteres Haushaltsmitglied | Wohngeld-VwV | prüfen |
| **Geplant ab 1.1.2027** | Fortschreibung ausgesetzt, Heizkostenkomponente halbiert, Parameter c erhöht, Mindestbetrag 15 € statt 10 € | Regierungsentwurf BT-Drs. 21/8284, 1. Lesung 8.10.2026 | Status *geplant*, nicht beschlossen |

### Bildung und Teilhabe

| Leistung | Wert | Status |
| --- | --- | --- |
| Schulbedarf | 130 € im 1., 65 € im 2. Schulhalbjahr | geprüft (BMBFSFJ-Einlegeblatt 2026) |
| Soziale und kulturelle Teilhabe | 15 € im Monat | prüfen |
| Mittagessen in Kita und Schule, Ausflüge, Schülerbeförderung, Lernförderung | tatsächliche Kosten | prüfen |
| Zuständig | Weg A: Jobcenter. Weg B: Kommune (Landratsamt oder kreisfreie Stadt) | prüfen |

**Abgleich:** GETTSIM (Open-Source-Modell für Steuern und Transfers) dient als zweite Referenz neben den offiziellen Rechnern. Lizenz und Rechtsstand prüfen, bevor Code übernommen wird.

## Folgen-Katalog: was jeder Weg für den Alltag bedeutet

**Dieser Katalog ist der Kern des Produkts, denn kein offizieller Rechner zeigt ihn.** Jede Aussage hat eine Fundstelle und einen Status. Formuliert wird neutral. Beide Wege sind ein Recht, und die App rät von keinem ab. Wenn nur die Grundsicherung den Bedarf deckt, sagt sie das klar.

| Thema | Weg A: Grundsicherung | Weg B: Kinderzuschlag + Wohngeld | Fundstelle / Status |
| --- | --- | --- | --- |
| Zuständig | Jobcenter | Familienkasse (KiZ), Wohngeldstelle (Gemeinde oder Landratsamt), Kommune (BuT) | geprüft |
| Wessen Einkommen zählt | alle in der Bedarfsgemeinschaft: Partner, auch unverheiratet, und Kinder unter 25 | Eltern und Kinder (KiZ), alle Haushaltsmitglieder (Wohngeld) | § 7, § 9 SGB II; geprüft |
| Pflicht zur Arbeitssuche | ja, für alle Erwerbsfähigen. Grundsätzlich ist jede Arbeit zumutbar, Vermittlung hat Vorrang | keine | § 10 SGB II, BA; geprüft |
| Die Partnerin, die schon arbeitet | gehört zur Bedarfsgemeinschaft. Das Jobcenter kann sie in Beratung und Pflichten einbeziehen, auch mit dem Ziel, die Hilfebedürftigkeit zu verringern | keine Vorgaben | BA „Unterstützung für Familien“; Reichweite im Einzelfall prüfen |
| Kinderbetreuung | Ist das Kind älter als 14 Monate, gilt Arbeit in der Regel als zumutbar, sofern die Betreuung (Kita, Tagespflege) gesichert ist. Die Kommune soll vorrangig einen Platz anbieten. Nur ein Elternteil kann sich auf die Betreuung berufen | keine Vorgaben | § 10 Abs. 1 Nr. 3 SGB II (Fassung ab 7/2026); geprüft |
| Termine und Gespräche | Erstgespräch, Meldetermine, Kooperationsplan. Bei wiederholtem Meldeversäumnis werden 30 % des Regelbedarfs gekürzt, bei Pflichtverletzungen 30 % für drei Monate | keine Pflichttermine. Der KiZ-Antrag ist vollständig online möglich (KiZ Digital mit BundID) | §§ 31a, 32 SGB II; geprüft |
| Erspartes | Freibetrag nach Alter (5.000–20.000 € je Person), Prüfung sofort | KiZ: erst ab 55.000 € (2 Personen) bzw. 70.000 € (3 Personen). Wohngeld: deutlich höhere Grenzen | § 12 SGB II geprüft; Wohngeld prüfen |
| Kontoauszüge | werden in der Regel angefordert. Wer sie komplett verweigert, riskiert die Ablehnung | Einkommensnachweise, Kontoauszüge nur im Einzelfall | prüfen |
| Wohnung | Prüfung, ob die Miete angemessen ist. Nach dem ersten Jahr kann das Jobcenter verlangen, die Kosten zu senken | keine Pflicht zum Umzug. Das Wohngeld berücksichtigt die Miete nur bis zum Höchstbetrag | § 22 SGB II; geprüft |
| Krankenversicherung | über den Bezug pflichtversichert | **keine Absicherung durch die Leistung.** Wer nicht selbst versichert ist, braucht eine Familienversicherung oder eine eigene Versicherung | prüfen; wichtig für Arbeitssuchende ohne ALG I |
| Ab wann Geld kommt | Der Antrag wirkt auf den Monatsersten zurück | ab dem Antragsmonat, keine Rückwirkung. **Früh beantragen, Nachweise nachreichen** | § 37 SGB II, Merkblatt KiZ; geprüft |
| Folgeantrag | nach 12 Monaten Weiterbewilligungsantrag | KiZ alle 6 Monate neu, Wohngeld meist nach 12 Monaten | geprüft |
| Änderungen melden | jede Änderung sofort | KiZ: Änderungen in den 6 Monaten meist ohne Einfluss. Wohngeld: bestimmte Änderungen melden | Wohngeld-Schwellen prüfen (§ 27 WoGG) |

### Darstellung in der App

Jede Zeile wird zu einer Karte mit einer von drei Markierungen: **Pflicht** (Handeln nötig, sonst drohen Kürzungen), **Prüfung** (die Behörde schaut genauer hin) oder **Gut zu wissen**. Jede Karte hat einen Link „Warum?“ zur Fundstelle in einfacher Sprache. Die Karten zu Kinderbetreuung und Partnerin stehen bei Familien ganz oben.

## Ergebnis-Bildschirm, Texte und Barrierefreiheit

**Das Ergebnis passt auf einen Handybildschirm und beantwortet erst „Wie viel?“, dann „Was heißt das?“, dann „Was jetzt?“.**

1. **Kopfzeile:** „Für euch kommen zwei Wege infrage.“ Oder: „Nur ein Weg deckt euren Bedarf.“
2. **Zwei Karten:** Weg A und Weg B, jeweils Euro pro Monat und pro Jahr, Spanne bei geschätzten Angaben, Status-Label *Rechtsstand 2026*. Beim Wohngeld zusätzlich: „Ab Januar 2027 voraussichtlich ca. X € (Gesetz noch nicht beschlossen).“
3. **Folgen je Weg:** die Karten aus dem Folgen-Katalog, die drei wichtigsten zuerst.
4. **Nächster Schritt, genau einer:** z. B. „Kinderzuschlag online beantragen, etwa 20 Minuten. Diese 4 Unterlagen brauchst du.“ Mit Link zum offiziellen Antrag und Kalenderdatei.
5. **Fußzeile:** Stand-Datum des Regelwerks, Hinweis „Keine Rechtsberatung“, Link zu Beratungsstellen, „Alles löschen“.

### Texte

- Messbar einfach: Standardtexte auf Sprachniveau B1, Lesbarkeitswert nach Amstad (deutsche Flesch-Formel) mindestens 70 je Text, automatisch geprüft in den Tests; dazu eine Ebene in Leichter Sprache für Ergebnis und Folgen-Karten.
- Du-Form, Sätze unter 15 Wörter, keine Amtssprache ohne Übersetzung („Bedarfsgemeinschaft = alle, deren Geld zusammengerechnet wird“).
- Kein Wort, das bewertet: nicht „Sozialleistung beziehen“, sondern „Geld, das euch zusteht“. Nicht „Sanktion“ ohne Erklärung, sondern „Kürzung um 30 %, wenn …“.
- Jeder Bildschirm zeigt, wie viel noch fehlt („Noch 4 Fragen, etwa 2 Minuten“).
- Spracheingabe: Mikrofon-Knopf bei jeder Zahl und jedem Freitext, danach Rückfrage „Ich habe verstanden: Kaltmiete 680 €. Stimmt das?“. Vor der ersten Nutzung einmal erklären, dass der Browser das Audio an Google oder Apple sendet, mit Alternative Tastatur.

### Barrierefreiheit (Ziel: WCAG 2.2 AA)

- Kontrast mindestens 4,5:1, Schrift skalierbar bis 200 %, Berührflächen mindestens 44 × 44 px
- vollständig per Tastatur und Screenreader bedienbar, Fortschritt per `aria-live` angesagt
- Vorlesefunktion für Ergebnis und Folgen-Karten (Sprachausgabe des Browsers, lokal)
- Leichte Sprache als zweite Textebene: in Version 0 für Ergebnis und Folgen-Karten
- Version 0 nur Deutsch, Textschlüssel von Anfang an übersetzbar (i18n)

## Testhaushalte

**Bedarf und Freibetrag sind aus den geprüften Parametern vorgerechnet. Die Sollwerte für KiZ und Wohngeld werden beim Bau aus den offiziellen Rechnern eingetragen, mit Datum.** Erst wenn alle zehn auf 1 € genau stimmen, gilt das Regelwerk als fertig.

Wohnkosten = Kaltmiete + Nebenkosten + Heizung. Freibetrag = Grundabsetzbetrag 100 € (§ 11b Abs. 2) + Erwerbstätigenfreibetrag (§ 11b Abs. 3) auf das Brutto der erwerbstätigen Person, höchstens bis zum Netto.

| ID | Haushalt | Einkommen (brutto / netto) | Wohnkosten | Prüft vor allem | SGB-II-Bedarf | Freibetrag | Erwartung |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T01 | Paar, Kinder 4 und 8, Nürnberg | 2.400 / 1.750 € | 750 + 180 + 110 = 1.040 € | Standardfall Weg B | 1.759 + 1.040 = 2.799 € | 378 € | Weg B deckt den Bedarf |
| T02 | wie T01 | 1.400 / 1.120 € | 1.040 € | niedriges Einkommen | 2.799 € | 368 € | nur Weg A deckt den Bedarf |
| T03 | alleinerziehend, Kind 3, Erlangen, Unterhaltsvorschuss 227 € | 1.300 / 1.000 € | 550 + 120 + 80 = 750 € | Mehrbedarf 36 %, Kindeseinkommen 45 % | 563 + 357 + 202,68 + 750 = 1.872,68 € | 358 € | KiZ gemindert, Weg B wahrscheinlich |
| T04 | Paar, Kinder 6 und 9, Landkreis Passau | 850 / 680 € | 620 + 150 + 90 = 860 € | Mindesteinkommen 900 € nicht erreicht | 1.792 + 860 = 2.652 € | 283 € | kein KiZ, nur Weg A |
| T05 | Paar, Kinder 1, 5 und 12, Augsburg | 2.900 / 2.050 € | 900 + 200 + 130 = 1.230 € | Kind unter 14 Monaten (Folgen-Karte), 3 Kinder | 2.116 + 1.230 = 3.346 € | 378 € | Grenzfall, Wohnkostenanteil für 3 Kinder nötig |
| T06 | Paar (35 und 38), Kind 7, Würzburg, Erspartes 60.000 € | 2.200 / 1.650 € | 650 + 150 + 90 = 890 € | Vermögen: SGB II ausgeschlossen (Freibetrag 25.000 €), KiZ möglich (Grenze 70.000 €) | 1.402 + 890 = 2.292 € | 378 € | nur Weg B, Hinweis Vermögen |
| T07 | Paar, 2 Kinder, Werte so gewählt, dass 1–100 € fehlen | beim Bau einstellen | beim Bau einstellen | erweiterter Zugang KiZ | – | – | echte Wahl zwischen A und B |
| T08 | Paar, Kind 4, München | 3.200 / 2.300 € | 1.400 + 250 + 120 = 1.770 € | Miete über dem Wohngeld-Höchstbetrag (Mietstufe VII) | 1.369 + 1.770 = 3.139 € | 378 € | Wohngeld gedeckelt, Wohnkosten-Hinweis |
| T09 | Paar, Kinder 14 und 16, Regensburg (1.000 € als Kaltmiete, Aufteilung in M3 nachtragen) | 4.500 / 3.100 € | 1.000 € | kein Anspruch | – | 378 € | „Kein Anspruch“, mit Verweis auf Steuer und BuT-Prüfung |
| T10 | Paar, Kinder 2 und 5, Landkreis Regensburg, eine Person ohne Einkommen und ohne ALG I | 2.800 / 2.000 € | 780 + 170 + 100 = 1.050 € | Krankenversicherungs-Karte, Partner-Karte | 1.726 + 1.050 = 2.776 € | 378 € | Weg B wahrscheinlich |

**So werden die Sollwerte erfasst:** je Haushalt eine Datei `packages/regelwerk/tests/haushalte/T01.json` mit Eingaben, Sollwerten, Quelle („KiZ-Lotse, 28.10.2026“) und Rechtsstand. Weicht ein offizieller Rechner von der Gesetzesrechnung ab, wird das notiert und nicht stillschweigend angeglichen. Die Mietstufen der Orte stammen aus der WoGV-Anlage, nicht aus Annahmen.

## Architektur und Bau-Reihenfolge für Claude Code

**Zwei Teile, streng getrennt: Das Regelwerk ist ein reines TypeScript-Paket ohne Oberfläche. Die App ist eine PWA, die das Regelwerk nur aufruft.**

### Projektstruktur

```
gut-bescheid/
  CLAUDE.md
  LICENSE                       EUPL-1.2 (entschieden)
  docs/fachkonzept-v0.md        dieses Dokument
  packages/regelwerk/
    parameter/2026-07-01/       sgb2.json, kiz.json, wohngeld.json, but.json
    parameter/2027-01-01/       wohngeld.json  (status: geplant)
    daten/mietstufen-bayern.json
    folgen/katalog.json         Folgen-Karten mit Fundstelle und Status
    src/sgb2.ts  kiz.ts  wohngeld.ts  but.ts  vergleich.ts  geld.ts
    tests/haushalte/T01.json … T10.json
    tests/*.test.ts
  apps/web/
    src/screens/                eine Frage pro Bildschirm
    src/speicher/               IndexedDB (Dexie), "Alles löschen"
    src/sprache/                Spracheingabe, Rückfrage
    src/i18n/de.json
```

### Technische Regeln

- **Jeder Parameter** ist ein Objekt `{ wert, fundstelle, gueltigAb, status }` mit `status` aus „geprueft“, „aus_quelle“, „pruefen“, „geplant“. Das Ergebnis meldet, wenn ein Wert mit Status „pruefen“ oder „geplant“ eingeflossen ist.
- **Geld:** intern ganze Cent. Die Wohngeldformel rechnet mit Festkomma und 10 Nachkommastellen (decimal.js oder BigInt), genau wie Anlage 3 WoGG.
- **Rechtsstand wählbar:** `berechne(haushalt, { stichtag })`. Ein Test prüft, dass ein Stichtag 2027 die geplanten Werte nimmt und das Ergebnis als „geplant“ markiert.
- **Keine Netzwerkaufrufe** im Regelwerk. Die App funktioniert offline.
- **Stack:** aktuelle Node-LTS, pnpm-Workspaces, Vite, React, TypeScript (strict), Vitest, Playwright, Hosting über GitHub Pages.

### Bau-Reihenfolge (Meilensteine)

| # | Meilenstein | Fertig, wenn | Aufwand (Vollzeit, Schätzung) |
| --- | --- | --- | --- |
| M1 | Gerüst: Repository, Lizenz, Workspaces, CLAUDE.md, CI mit Tests | `pnpm test` läuft grün auf GitHub | 0,5 Tage |
| M2 | SGB II: Bedarf, Freibetrag, Lücke A | T01–T10: Bedarf und Freibetrag stimmen auf den Cent | 2–3 Tage |
| M3 | KiZ, Wohngeld, BuT, Vergleichslogik | Sollwerte aus den offiziellen Rechnern eingetragen, alle Tests grün (± 1 €) | 4–6 Tage |
| M4 | Folgen-Katalog als Daten, Auswahl der Karten je Haushalt | Snapshot-Test je Testhaushalt | 1–2 Tage |
| M5 | Oberfläche: Fragebogen, Ergebnis, Speicher, Löschen, Kalenderdatei | Durchlauf T01 im Browser unter 5 Minuten | 4–5 Tage |
| M6 | Spracheingabe, Barrierefreiheit, Veröffentlichung | axe-Check ohne Fehler, Demo-Link online | 2–3 Tage |

Das sind rund drei Wochen Vollzeit. Bis zum 23.11. knapp, aber machbar. Falls es eng wird: M6 auf Spracheingabe beschränken, Barrierefreiheit nach der Bewerbung.

**So arbeitest du mit Claude Code:** Pro Sitzung genau einen Meilenstein, z. B.: „Lies CLAUDE.md und docs/fachkonzept-v0.md. Setze M2 um. Schreibe zuerst die Tests aus T01–T10.“ Nach jedem Meilenstein committen und das Ergebnis selbst ansehen.

## Rechtliche Leitplanken und Akzeptanzkriterien

**Version 0 bleibt allgemeine Information über Regeln. Sie trifft keine rechtliche Bewertung eines Einzelfalls (§ 2 RDG) und speichert keine Daten außerhalb des Geräts.**

- Statt „Du bekommst 412 €“: „Nach den Regeln für 2026 ergibt sich für Haushalte mit euren Angaben etwa 412 €. Verbindlich entscheidet die Behörde.“
- Statt „Das Jobcenter wird verlangen, dass deine Partnerin mehr arbeitet“: „In der Grundsicherung kann das Jobcenter alle Erwachsenen im Haushalt in die Arbeitssuche einbeziehen.“
- Jede Folgen-Karte nennt ihre Fundstelle. Jede Seite verlinkt kostenlose Beratung (Sozialberatung der Wohlfahrtsverbände, Verbraucherzentrale).
- Impressum und Datenschutzerklärung ab dem ersten öffentlichen Link.
- Die rechtliche Ersteinschätzung (IHK-Gründungsberatung oder Law Clinic) prüft diese Formulierungen, bevor der Link geteilt wird.

### Akzeptanzkriterien Version 0

- [ ] T01–T10 grün: Abweichung höchstens 1 € pro Monat zu den dokumentierten Sollwerten
- [ ] Kein Parameter mit Status „pruefen“ fließt ohne sichtbaren Hinweis ins Ergebnis ein
- [ ] Wohngeld zeigt Rechtsstand 2026 und daneben, als *geplant* markiert, den Wert ab 2027
- [ ] Haushalte außerhalb des Umfangs bekommen einen klaren Hinweis statt eines Ergebnisses
- [ ] Die App funktioniert offline, keine Netzwerkanfragen außer dem Laden der App (und der Spracheingabe nach Zustimmung)
- [ ] „Alles löschen“ entfernt die IndexedDB vollständig, geprüft per Test
- [ ] Lighthouse Barrierefreiheit mindestens 95, axe ohne kritische Fehler
- [ ] 3 Personen außerhalb deines Umfelds kommen ohne Hilfe vom Start bis zum Ergebnis und können danach in eigenen Worten sagen, was jeder Weg für sie bedeutet
- [ ] Alle sichtbaren Texte erreichen Amstad ≥ 70 (Test in apps/web)
- [ ] Rechtliche Ersteinschätzung liegt vor

## Quellen

**Gesetze**

- § 10 SGB II: https://www.gesetze-im-internet.de/sgb_2/__10.html
- § 11b SGB II: https://www.gesetze-im-internet.de/sgb_2/__11b.html
- § 12 SGB II: https://www.gesetze-im-internet.de/sgb_2/__12.html
- § 31a SGB II: https://www.gesetze-im-internet.de/sgb_2/__31a.html
- Anlage 2 WoGG: https://www.gesetze-im-internet.de/wogg/anlage_2.html
- § 12 WoGG: https://www.gesetze-im-internet.de/wogg/__12.html
- Anlage 3 WoGG: https://www.sozialgesetzbuch-sgb.de/wogg/anlage-3.html
- Anlage WoGV (Mietstufen): https://www.gesetze-im-internet.de/wogv/anlage.html
- § 27 WoGG: https://www.gesetze-im-internet.de/wogg/__27.html
- § 6a BKGG: https://www.gesetze-im-internet.de/bkgg_1996/__6a.html
- Regelbedarfsstufen 2026 (BGBl. 2025 I Nr. 243): https://www.recht.bund.de/bgbl/1/2025/243/regelungstext.pdf?__blob=publicationFile

**Verwaltungsanweisungen und Merkblätter**

- DA-KiZ: https://www.arbeitsagentur.de/datei/fw-bkgg_ba023130.pdf
- KiZ-1-Hinweisblatt 2026: https://www.arbeitsagentur.de/datei/kiz1-hinweise_ba036545.pdf
- Merkblatt Kinderzuschlag 2026: https://www.arbeitsagentur.de/datei/KiZ2-MerkblattKinderzuschlag_ba015395.pdf
- Merkblatt SGB II (2026): https://www.arbeitsagentur.de/datei/merkblatt-sgb2_ba043375.pdf
- Fachliche Weisungen § 12 SGB II: https://www.arbeitsagentur.de/datei/fw-zu-par-12-sgb2-beruecksichtigung-von-vermoegen_ba058027.pdf
- BA Grundsicherungsgeld: https://www.arbeitsagentur.de/grundsicherung-loest-buergergeld-ab
- BA Rechte, Pflichten, Minderungen: https://www.arbeitsagentur.de/grundsicherung/pflichten-verstehen-und-beachten/rechte-pflichten-minderungen
- BA Auszahlung und Dauer: https://www.arbeitsagentur.de/grundsicherung/finanziell-absichern/auszahlung-dauer
- BA Unterstützung für Familien: https://www.arbeitsagentur.de/grundsicherung/unterstuetzung-fuer-familien
- BMBFSFJ Einlegeblatt 2026: https://www.bmbfsfj.bund.de/resource/blob/256052/2b19e389612f4244069d5b1a686e82f8/einlegeblatt-leistungen-fuer-alleinerziehende-2026-data.pdf

**Gesetzgebung (geplant)**

- Regierungsentwurf Wohngeldgesetz, BT-Drs. 21/8284: https://dserver.bundestag.de/btd/21/082/2108284.pdf
- Bundestag, 1. Lesung 8.10.2026: https://www.bundestag.de/dokumente/textarchiv/2026/kw41-de-wohngeldgesetz-1217564

**Sekundärquellen (nur zur Orientierung)**

- Haufe, Zumutbarkeit und Kinderbetreuung: https://www.haufe.de/id/beitrag/zumutbarkeit-bei-bezug-von-grundsicherungsgeld-12-kinderbetreuung-HI11443764.html
- Bundesregierung, Regelbedarfe 2026: https://www.bundesregierung.de/breg-de/aktuelles/nullrunde-buergergeld-2383676
- wohngeld.org, Mietstufen Bayern: https://www.wohngeld.org/mietstufe/bayern

**Offizielle Rechner für Sollwerte:** KiZ-Lotse https://www.arbeitsagentur.de/familie-und-kinder/kiz-lotse · Wohngeldrechner des Freistaats Bayern bzw. des BMWSB (aktuellen Link beim Bau prüfen).
