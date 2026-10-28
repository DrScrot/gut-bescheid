# Offene Rechtsfragen

Stand: 28.10.2026 (nach M3) · Diese Liste ist für die Rechts- oder Sozialberatung gedacht. Sie sammelt alle Stellen, an denen das Regelwerk eine Annahme trifft, die ein Mensch mit Fachwissen prüfen sollte. Jeder Meilenstein ergänzt sie.

Je Punkt: die Frage, unsere Annahme, die Fundstellen und die Tests, die sich ändern, wenn die Antwort anders ausfällt. Im Regelwerk tragen die betroffenen Werte meist den Status `pruefen` und erscheinen im Ergebnis als Hinweis.

## Kinderzuschlag

### 1. T08: KiZ-Lotse sagt „ja“, das Regelwerk „nein“

- **Frage:** Bekommt ein Paar mit einem Kind (4) in München, Brutto 3.200 €, Netto 2.300 €, Wohnkosten 1.770 €, Kinderzuschlag?
- **Unsere Annahme:** Nein. Bedarf 3.139 €, bereinigtes Einkommen 1.922 €, Kindergeld 259 €, KiZ 297 €, Wohngeld 314 €. Es fehlen 347 €, mehr als 100 € (§ 6a Abs. 1 Nr. 3, Abs. 1a BKGG). Vermutung: Der Lotse schätzt das Wohngeld selbst und deckelt die Miete nicht auf den Höchstbetrag (mit 1.650 € Bruttokaltmiete ergäben sich 587 € Wohngeld, dann fehlten nur 74 €). Eine Angemessenheitsgrenze für die Wohnkosten scheidet aus.
- **Fundstellen:** § 6a Abs. 1 Nr. 3 und Abs. 1a BKGG; DA-KiZ C.3.1.2.1 Abs. 1 Satz 4 und 5 (tatsächliche Bedarfe, keine Angemessenheitsprüfung), C.4.1 Abs. 7 (fiktives Wohngeld); § 11 Abs. 1, § 12 WoGG.
- **Betroffene Tests:** `tests/haushalte/T08.json` (Feld `abweichungen`); `haushalte.test.ts` „KiZ-Anspruch weicht vom Lotsen ab (dokumentiert)“; `vergleich.test.ts` „Nur Weg A (T08)“.
- **Offen bei Nico:** Hat der Lotse nach dem Wohngeld gefragt?

### 2. Erweiterter Zugang: DA-KiZ gegen Gesetzeswortlaut

- **Frage:** Zählt beim erweiterten Zugang das Ersparte über dem Freibetrag der Grundsicherung mit?
- **Unsere Annahme:** Ja. Gut Bescheid rechnet hier wie die Familienkasse nach ihrer Dienstanweisung, an die sie gebunden ist (Entscheidung von Nico am 28.10.2026). Das geht über den Wortlaut von § 6a Abs. 1a Nr. 1 BKGG hinaus, der nur Einkommen, KiZ und Wohngeld nennt. Für die DA spricht, dass Nr. 1 von der „Vermeidung von Hilfebedürftigkeit“ spricht, und die schließt nach § 9 SGB II Vermögen ein. Entsteht der erweiterte Zugang erst durch das Ersparte, meldet das Ergebnis den Hinweis `erweiterter_zugang_mit_erspartem`.
- **Fundstellen:** § 6a Abs. 1a Nr. 1 BKGG („mit ihrem Einkommen, dem Kinderzuschlag und dem Wohngeld höchstens 100 Euro fehlen“); DA-KiZ C.4.2 Abs. 1 Satz 1 und Abs. 2 Satz 2 („unter Berücksichtigung des Einkommens und Vermögens“), Stand 20.02.2026; § 9 Abs. 1 SGB II.
- **Betroffene Tests:** `kiz.test.ts` „DA-KiZ C.4.2 Abs. 2: Erspartes zählt beim erweiterten Zugang mit“, „20 € über dem Freibetrag“, „erweiterter Zugang ohne Erspartes (K03)“, „erweiterter Zugang ohnehin (K03), Erspartes 10 € über dem Freibetrag“ und „Erspartes rund um den SGB-II-Freibetrag“ (Schwelle 30.035 €, nach dem Wortlaut wären es 30.135 €); `vergleich.test.ts` „Erspartes 50 € über dem Freibetrag“; `parameter.test.ts` „Erweiterter Zugang folgt der DA-KiZ C.4.2 Abs. 2“.

### 3. Erweiterter Zugang durch Erspartes: der zweite Monat

- **Frage:** Was passiert, wenn der erweiterte Zugang nur dank des Ersparten greift und das Ersparte im ersten Monat aufgebraucht ist?
- **Unsere Annahme:** Der KiZ ist für sechs Monate fest bewilligt. Danach fehlt aber wieder mehr als 100 €; dann ist ergänzend Grundsicherung möglich. Version 0 zeigt nur den Hinweis `erweiterter_zugang_mit_erspartem`. Wichtig für die Folgen-Karten in M4.
- **Fundstellen:** § 6a Abs. 7 BKGG; DA-KiZ C.4.3.
- **Betroffene Tests:** `kiz.test.ts` „DA-KiZ C.4.2 Abs. 2: Erspartes zählt beim erweiterten Zugang mit“.

### 4. KiZ von Kindern, die nach SGB II ihren Bedarf decken, beim KiZ aber nicht

- **Frage:** Wie viel vom KiZ eines solchen Kindes zählt in der Prüfung, ob der Bedarf gedeckt ist?
- **Unsere Annahme:** Nur so viel, wie dem Kind ohne Kindergeld zu seinem Bedarf fehlt (Regelbedarf + Kopfteil − eigenes Einkommen). Was darüber liegt, bleibt beim Kind, weil beim Elternteil höchstens das Kindergeld ankommt. Der Anteil des Kindes am KiZ zählt nach dem Verhältnis vor der Minderung durch Elterneinkommen, auf Cent (Analogie zur DA-Regel für Patchwork-Familien, die je Kind auf Euro rundet; Abweichung unter 1 €).
- **Fundstellen:** § 11 Abs. 1 Satz 4 und 5 SGB II; DA-KiZ B.3 Abs. 2 Satz 13, C.3.2.1.3 Abs. 6.
- **Betroffene Tests:** `kiz.test.ts` „Kind außerhalb der SGB-II-BG, aber in der KiZ-BG“.

### 5. Bedarfsprüfung mit dem gerundeten KiZ, für den ganzen Haushalt

- **Frage:** Rechnet die Familienkasse in der Prüfung, ob der Bedarf gedeckt ist, mit dem auf Euro gerundeten KiZ? Und reicht eine Rechnung für den ganzen Haushalt?
- **Unsere Annahme:** Ja, gerundeter KiZ (Entscheidung von Nico am 28.10.2026). Haushaltsrechnung: Kinder, die erst durch KiZ oder Wohngeld aus der Bedarfsgemeinschaft fallen, bildet Version 0 nur beim Betrag des KiZ ab (Punkt 4), nicht bei weiteren Folgen wie Freibeträgen. Steht im Fachkonzept unter „Nicht im Umfang“.
- **Fundstellen:** § 11 Abs. 2 BKGG; § 6a Abs. 1 Nr. 3 BKGG; DA-KiZ C.4.1, E.5 Abs. 2.
- **Betroffene Tests:** `kiz.test.ts` (alle Fälle mit Bedarfsprüfung); `haushalte.test.ts` „mit KiZ und Wohngeld fehlen …“ (T08).

### 6. KiZ-Höchstbetrag 2027

- **Frage:** Wie hoch ist der Höchstbetrag 2027, wenn der Sofortzuschlag wegfällt?
- **Unsere Annahme:** 272 € (297 € ohne 25 € Sofortzuschlag) als Mindestbetrag nach § 6a Abs. 2 Satz 3 BKGG, Status `geplant`, ebenso 2028. Höchstbetrag und Kindergeld für ein erstes Kind decken zusammen ein Zwölftel des sächlichen Existenzminimums eines Kindes (Satz 1). Das höhere Kindergeld (geplant 267 € ab 2027, 272 € ab 2028, Punkt 18) drückt den Höchstbetrag also. Der Entwurf BT-Drs. 21/8235 hebt aber den Kinderfreibetrag für das sächliche Existenzminimum je Elternteil um 150 € (2027) und 90 € (2028), „in Höhe der voraussichtlichen Vorgaben“ des 16. Existenzminimumberichts (Begründung zu Art. 1 Nr. 3 und Art. 2 Nr. 1). Das sind 25 € und 15 € im Monat, mehr als der Anstieg des Kindergelds (8 € und 5 €). Ob die Rechnung damit über 272 € kommt, zeigt erst der 16. Existenzminimumbericht (erwartet im Herbst 2026). Version 0 kann das nicht selbst rechnen: Existenzminimum und Anteil für Bildung und Teilhabe kommen aus dem Bericht.
- **Fundstellen:** § 6a Abs. 2 BKGG; Regierungsentwurf Haushaltsbegleitgesetz 2027, BT-Drs. 21/7860, Art. 7 und Art. 10 Abs. 1; DA-KiZ C.2.1 Abs. 5 und 7.
- **Betroffene Tests:** `kiz.test.ts` „Stand 2027: Höchstbetrag 272 €“; `parameter.test.ts` „KiZ 2027: Höchstbetrag 272 €“ und „Stand 2028 hat dieselben Werte wie 2027“; `vergleich.test.ts` „Stichtag 2027, T01“.

## Grundsicherung (SGB II)

### 7. Sofortzuschlag für Haushalte ohne Anspruch

- **Frage:** Bekommen Kinder den Sofortzuschlag von 25 €, wenn der ganze Haushalt nur wegen des angerechneten Kindergelds keine Grundsicherung bekommt?
- **Unsere Annahme:** Ja, nach dem Wortlaut von § 72 Abs. 1 Satz 2 Nr. 2 SGB II (Entscheidung von Nico am 28.10.2026). Ist Lücke A ohne Kindergeld positiv, zeigt Weg A je Kind 25 €. Bei T09 sind das 50 €. Status `pruefen`, weil die Fachlichen Weisungen zu § 72 nicht nachgelesen sind (PDF nicht lesbar).
  - **Lesart „ganzer Haushalt“:** Gerechnet wird mit dem ganzen angerechneten Kindergeld, nicht je Kind. Je Kind gerechnet bekäme T09 nichts (−286 + 259 = −27 €).
  - **Gegenrechnung:** Ohne Kindergeld entfällt auch der Überhang samt der Pauschale, die nur seinetwegen abging, und Kinder außerhalb der Bedarfsgemeinschaft mit Einkommen unter ihrem Bedarf kämen zurück. Ihr Vermögensfreibetrag ist dabei nicht neu gerechnet.
  - **Kein Doppelbezug auf Weg B:** 2026 steckt der Sofortzuschlag im KiZ. Das ist eine Auslegung: Nach dem bloßen Wortlaut hätte z. B. T01 auf Weg B Lücke A ohne Kindergeld > 0. Für 2027 streicht der Entwurf den Sofortzuschlag im KiZ; ob KiZ-Haushalte ihn dann nach § 72 SGB II bekommen, ist offen.
- **Fundstellen:** § 72 Abs. 1 SGB II; § 11 Abs. 1 Satz 4 und 5 SGB II; § 9 Abs. 2 Satz 3 SGB II; § 6a Abs. 2 Satz 4 BKGG; BT-Drs. 21/7860; Fachliche Weisungen der BA zu § 72 SGB II (https://www.arbeitsagentur.de/datei/fachliche-weisungen-zu-paragraph-72-sgb-ii-sofortzuschlag_ba147517.pdf).
- **Betroffene Tests:** `sgb2.test.ts` Block „Sofortzuschlag für Kinder (§ 72 SGB II)“ (u. a. „Haushalt nur wegen des Kindergelds ohne Anspruch (T09)“, „Gegenrechnung ohne Kindergeld“, „Sofortzuschlag ohne Anspruch bei unklarem Ersparten“, „auch ohne Kindergeld kein Anspruch“); `vergleich.test.ts` „Keine Grundsicherung (T09)“; `parameter.test.ts` „Sofortzuschlag für Haushalte nur wegen Kindergeld ohne Anspruch: Status pruefen“; `tests/haushalte/T09.json` (Feld `pruefen`).

### 8. Weg A mit nur dem Sofortzuschlag: Wohngeld und erweiterter Zugang

- **Frage:** Kann ein Haushalt wie T09 auf Weg A den Sofortzuschlag beim Jobcenter beantragen und trotzdem Wohngeld bekommen? Und sperrt dieser Antrag den erweiterten Zugang zum KiZ?
- **Unsere Annahme:** Version 0 zeigt auf Weg A nur den Sofortzuschlag, ohne Wohngeld. § 7 Abs. 1 Satz 1 Nr. 1 WoGG schließt nur „Grundsicherungsgeld“ aus, den Sofortzuschlag nennt er nicht; dann wären 50 € plus Wohngeld möglich. Ein solcher Antrag ist aber ein Antrag auf Leistungen nach dem SGB II und sperrt den erweiterten Zugang (§ 6a Abs. 1a Nr. 3 BKGG). Die Folgen-Karten von Weg A (z. B. Arbeitssuche) passen auf diesen Fall vermutlich nicht. Für M4 und M5 vorgemerkt.
- **Fundstellen:** § 7 Abs. 1 Satz 1 Nr. 1 WoGG; § 72 SGB II; § 6a Abs. 1a Nr. 3 BKGG.
- **Betroffene Tests:** `vergleich.test.ts` „Keine Grundsicherung (T09)“.

### 9. Weg A bei Erspartem knapp über dem Freibetrag

- **Frage:** Was zeigt Weg A, wenn das Ersparte über dem Freibetrag liegt, aber nicht deckt, was im Monat fehlt?
- **Unsere Annahme:** Das SGB-II-Ergebnis meldet „Erspartes zuerst einsetzen“. Weg A zeigt Lücke A plus Sofortzuschlag mit dem Kennzeichen `nachEinsatzDesErsparten`, also den Betrag, sobald das Ersparte eingesetzt ist. Im ersten Monat wäre es weniger.
- **Lücke dazu:** Hat ein Haushalt nur wegen des angerechneten Kindergelds keinen Anspruch (wie T09) und liegt sein Erspartes sicher über dem Freibetrag, zeigt Weg A keinen Sofortzuschlag, auch nicht „nach Einsatz des Ersparten“. Folgerichtig wären je Kind 25 €, sobald das Ersparte bis auf den Freibetrag eingesetzt ist (§ 72 Abs. 1 Satz 2 Nr. 2 SGB II: „nur deshalb“). Version 0 bildet das nicht ab; es betrifft nur den Sofortzuschlag (Punkt 7). Uneinheitlich: Liegt das Ersparte in einer Spanne um den Freibetrag (unklar), zeigt Weg A den Sofortzuschlag mit dem Hinweis „Erspartes zuerst einsetzen“.
- **Fundstellen:** § 9 Abs. 1, § 12 SGB II.
- **Betroffene Tests:** `vergleich.test.ts` „Erspartes 50 € über dem Freibetrag“ und „Erspartes 20 € über dem Freibetrag“; für die Lücke `sgb2.test.ts` „Lücke (offene Rechtsfragen Punkt 9)“ und „Sofortzuschlag ohne Anspruch bei unklarem Ersparten“.

### 10. Rundung nach § 41 Abs. 2 SGB II (aus M2)

- **Frage:** Wird je Freibetragsstufe und beim Kopfteil der Wohnkosten auf Cent gerundet, ab 5 in der dritten Stelle auf?
- **Unsere Annahme:** Ja. Status `pruefen` seit M2.
- **Fundstellen:** § 41 Abs. 2 SGB II.
- **Betroffene Tests:** `parameter.test.ts` „Rundung nach § 41 Abs. 2 SGB II steht auf pruefen“; Rundungsfälle in `sgb2.test.ts`.

## Wohngeld

### 11. Anteil am Wohngeld von Kindern außerhalb der Bedarfsgemeinschaft

- **Frage:** Kommt das Wohngeld in der Prüfung, ob der Bedarf gedeckt ist, voll beim Haushalt an, auch wenn ein Kind nach SGB II außerhalb der Bedarfsgemeinschaft steht?
- **Unsere Annahme:** Ja, Version 0 rechnet das Wohngeld für den ganzen Haushalt (Vereinfachung, Entscheidung von Nico am 28.10.2026). Wird es nach Köpfen zugerechnet, nützt der Anteil eines solchen Kindes dem Haushalt nur bis zum vollen Kindergeld.
- **Fundstellen:** § 11 Abs. 1 SGB II; Fachliche Weisungen zu § 11 SGB II; DA-KiZ C.4.1.
- **Betroffene Tests:** keine (bewusst nicht abgebildet). Code: `src/kiz.ts`, Kommentar an `fehlbetrag`.

### 12. Schätzung der Abzüge nach § 16 WoGG aus Brutto und Netto

- **Frage:** Ist die Schätzregel tragfähig: Kranken-, Pflege- und Rentenversicherung über der Minijob-Grenze, Steuer, wenn Brutto minus Netto mehr als 22,5 % vom Brutto ist?
- **Unsere Annahme:** Ja, für Version 0 (Entscheidung von Nico am 28.10.2026). Sie kann in beide Richtungen irren: Bei Midijobs kann eine kleine Lohnsteuer übersehen werden (Wohngeld zu niedrig). Enthält das Netto andere Abzüge, etwa Entgeltumwandlung, vermögenswirksame Leistungen oder eine Pfändung, nimmt sie fälschlich Steuer an (Wohngeld zu hoch). Beamte und privat Versicherte erkennt sie nicht. Für M5 ist eine freiwillige Frage nach der Lohnsteuer vorgemerkt.
  - **Ab 2027 (geplant):** Der Entwurf BT-Drs. 21/8235 hebt die Pauschsteuer für Minijobs von 2 % auf 5 % (Art. 1 Nr. 7, § 40a Abs. 2 EStG, im Original gelesen). Wälzt der Arbeitgeber sie auf den Lohn ab, ist das Netto kleiner als das Brutto. Die Schätzregel liest das dann als Abzug für die Rentenversicherung. Für M5 vorgemerkt.
- **Fundstellen:** § 16 WoGG; § 8 Abs. 1a SGB IV i. V. m. § 1 MiLoV5 (Minijob-Grenze 603 € / 633 €); § 40a Abs. 2 EStG i. d. F. BT-Drs. 21/8235, Art. 1 Nr. 7.
- **Betroffene Tests:** `wohngeld.test.ts` Block „Schätzung der Abzüge nach § 16 WoGG“; `haushalte.test.ts` „Abzüge nach § 16 WoGG wie im Rechner“.

### 13. Beitragssätze hinter der 22,5-%-Schwelle

- **Frage:** Stimmen der durchschnittliche Zusatzbeitrag 2026 (2,9 %) und der Beitragssatz der Rentenversicherung 2026 (18,6 %)?
- **Unsere Annahme:** Ja, aus Sekundärquellen. Primär gelesen sind KV 14,6 % (§ 241 SGB V), PV 3,6 % (§ 1 PBAV 2025), Kinderlosenzuschlag 0,6 % (§ 55 Abs. 3 SGB XI), AV 2,6 % (§ 341 Abs. 2 SGB III).
- **Fundstellen:** Bekanntmachung des BMG zum durchschnittlichen Zusatzbeitragssatz 2026 (Bundesanzeiger vom 10.11.2025); Bekanntmachung der Beitragssätze in der allgemeinen Rentenversicherung 2026 (§ 158 SGB VI).
- **Betroffene Tests:** `wohngeld.test.ts` „Steuer erst, wenn Brutto minus Netto mehr als 22,5 % vom Brutto ist“.

### 14. Punkte aus der Wohngeld-Verwaltungsvorschrift (WoGVwV)

Die WoGVwV vom 28.06.2017 ist nicht im Original gelesen.

- **a) Vermögensgrenze:** Annahme 60.000 € für das erste plus 30.000 € je weiteres Haushaltsmitglied, ohne Obergrenze (die 120.000 € kommen erst mit dem Entwurf 2027). Fundstellen: § 21 Nr. 3 WoGG; WoGVwV Nr. 21.37; Begründung zu BT-Drs. 21/8284, S. 83. Tests: `wohngeld.test.ts` Block „Vermögen (§ 21 Nr. 3 WoGG)“.
- **b) Obergrenze Miete:** Annahme: Das Wohngeld ist höchstens so hoch wie die zu berücksichtigende Miete, auf Euro abgerundet. Fundstellen: WoGVwV Nr. 19.21 (gelesen in einer Wiedergabe auf wohngeld.org); geplant § 19 Abs. 4 WoGG (BT-Drs. 21/8284). Tests: `wohngeld.test.ts` „höchstens die Miete: 12 Personen“.
- **c) Minijob 2026:** Annahme: Vom pauschal besteuerten Minijob geht der Arbeitnehmer-Pauschbetrag von 1.230 € ab. Jedes Brutto bis zur Minijob-Grenze gilt als pauschal besteuert. Fundstellen: § 14 Abs. 1 Satz 3 Nr. 2 WoGG; § 9a Satz 1 Nr. 1 Buchst. a EStG. Tests: `wohngeld.test.ts` „Minijob: 2026 mit Pauschbetrag“.

### 15. T09: Rundung des Monatseinkommens im amtlichen Rechner

- **Frage:** Rundet der Wohngeldrechner des BMWSB das Monatseinkommen Y auf volle Euro auf?
- **Unsere Annahme:** Nein, wir rechnen nach Gesetz. Für T09 ergibt das 226 € statt amtlich 225 € (ungerundet 225,5966 €). Rundet man Y auf volle Euro auf, stimmen alle 19 amtlichen Werte genau. Weder Anlage 3 WoGG noch das Rechenbeispiel in WoGVwV Nr. 19.01 (Y = 837,39 € „ungerundet“) sehen das vor.
- **Fundstellen:** § 13 Abs. 2 WoGG; Anlage 3 WoGG; WoGVwV Nr. 19.01.
- **Betroffene Tests:** `wohngeld.test.ts` „T09: 226 € statt amtlich 225 €“; `tests/haushalte/T09.json` (Feld `abweichungen`).

### 16. Weiteres Einkommen im Wohngeld

- **Frage:** Wie zählen Arbeitslosengeld, Krankengeld und Elterngeld beim Wohngeld?
- **Unsere Annahme:** Version 0 rechnet sie voll und ohne Abzüge, mit Hinweis „grob geschätzt“ (Entscheidung von Nico am 28.10.2026). Die Regeln je Art folgen in M5, z. B. Elterngeld bis 300 € frei.
- **Fundstellen:** § 14 Abs. 2 Nr. 6 WoGG i. V. m. § 10 BEEG; § 16 WoGG.
- **Betroffene Tests:** `wohngeld.test.ts` „Sonstiges Einkommen (Version 0: voll, ohne Abzüge)“.

## Bildung und Teilhabe

### 17. Zuständige Stelle auf Weg A in Bayern

- **Frage:** Beantragt man Bildung und Teilhabe in Bayern auf Weg A immer beim Jobcenter, oder machen das manche Kommunen selbst?
- **Unsere Annahme:** In der Regel beim Jobcenter. Status `pruefen`.
- **Fundstellen:** § 6 Abs. 1 Satz 1 Nr. 2 SGB II; § 44b SGB II.
- **Betroffene Tests:** `but.test.ts` „Zuständigkeit Weg A ist noch zu prüfen“; `vergleich.test.ts` „Bildung und Teilhabe im Vergleich“.

## Werte für 2027 und 2028, die noch nicht feststehen

### 18. Fortgeschriebene und geplante Werte ab 1.1.2027 und 1.1.2028

- **Frage:** Welche Werte gelten ab 2027 und ab 2028?
- **Unsere Annahme:** Was noch nicht verkündet ist, rechnet das Regelwerk mit den Werten von 2026 und dem Status `pruefen` oder, wenn ein Regierungsentwurf vorliegt, mit dem Entwurf und dem Status `geplant`.
  - Regelsätze: Werte von 2026, `pruefen` (RBSFV 2027 noch nicht verkündet; nach dem 31.10.2026 erneut suchen).
  - Kindergeld: 267 € ab 1.1.2027 und 272 € ab 1.1.2028, `geplant` (Entscheidung von Nico am 28.10.2026). Quelle ist der Regierungsentwurf zum Einkommensteuerreformgesetz 2027, BT-Drs. 21/8235 vom 28.09.2026 (Art. 1 Nr. 9 und Art. 4 für 2027, Art. 2 Nr. 5 und Art. 5 für 2028, Inkrafttreten Art. 7). Artikel und Nummern im Original geprüft (Vorabfassung). Für 2028 gibt es deshalb einen eigenen Rechtsstand; alle anderen Werte sind dort wie 2027 (Minijob-Grenze und KiZ siehe unten).
  - Beratung zu BT-Drs. 21/8235: erste Lesung am 08.10.2026; Stellungnahme des Bundesrates am 16.10.2026 (BR-Drs. 507/26(B)), ohne Einwand zu Kindergeld, Pauschbetrag oder Minijobs; Anhörung im Finanzausschuss am 04.11.2026; nicht beschlossen (Stand 28.10.2026). Das Gesetz braucht die Zustimmung des Bundesrates.
  - Arbeitnehmer-Pauschbetrag beim Wohngeld: 1.430 € statt 1.230 € ab 1.1.2027, `geplant` (gleicher Entwurf, Entscheidung von Nico am 28.10.2026). Er wirkt über § 14 Abs. 1 WoGG auf die Werbungskosten: 119,17 € statt 102,50 € im Monat. Beispiel T01: Wohngeld 2027 684 €.
  - Schulbedarf: 130 € / 65 €, `pruefen`.
  - Sofortzuschlag SGB II: 25 €, `pruefen` (BT-Drs. 21/7860 kündigt eine Überprüfung an). Der Hinweis dazu erscheint ab 2027 auch dann, wenn Weg A wegen des Ersparten ausscheidet. Das nehmen wir hin; der Hinweis betrifft den Rechtsstand, nicht den Fall.
  - KiZ-Höchstbetrag: 272 €, `geplant`, auch 2028 (Punkt 6).
  - Minijob-Grenze 2028: 633 € wie 2027, `pruefen`. Sie folgt dem Mindestlohn (§ 8 Abs. 1a SGB IV). Über den Mindestlohn ab 2028 entscheidet die Mindestlohnkommission bis Mitte 2027 (§ 9 Abs. 1 MiLoG). Sie wirkt auf die Schätzung der Abzüge und die Minijob-Regel beim Wohngeld.
  - Wohngeld: Entwurf BT-Drs. 21/8284, `geplant`, mit neuen Mietenstufen. Der federführende Wohnungsausschuss des Bundesrates empfahl die Ablehnung (BR-Drs. 474/1/26, Ziffer 1); das Plenum ist dem am 25.09.2026 nicht gefolgt und hat Änderungen gefordert (BT-Drs. 21/8284, Anlage 3).
- **Fundstellen:** wie genannt; § 66 Abs. 1 EStG, § 6 Abs. 1 BKGG, § 9a Satz 1 Nr. 1 Buchst. a EStG, § 14 Abs. 1 WoGG; BT-Drs. 21/8235 Art. 1 Nr. 2 und 9, Art. 2 Nr. 5, Art. 4, 5 und 7; BR-Drs. 507/26(B); § 8 Abs. 1a SGB IV; § 9 Abs. 1 MiLoG.
- **Betroffene Tests:** `parameter.test.ts` (Stand 2027 und 2028, „Kindergeld: 267 € ab 2027, 272 € ab 2028“, „Arbeitnehmer-Pauschbetrag beim Wohngeld“, „Minijob-Grenze 2028“, „Stand 2028 hat dieselben Werte wie 2027“); `sgb2.test.ts` „ab 2028: eigener Stand mit Kindergeld 272 €“; `wohngeld.test.ts` Block „Geplante Fassung ab 1.1.2027“; `kiz.test.ts` „Stand 2027“; `but.test.ts` „Stand 2027“; `sgb2.test.ts` Block „Stichtag ab 1.1.2027“.
