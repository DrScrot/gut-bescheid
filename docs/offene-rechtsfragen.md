# Offene Rechtsfragen

Stand: 29.10.2026 (nach M4, zweite Runde) · Diese Liste ist für die Rechts- oder Sozialberatung gedacht. Sie sammelt alle Stellen, an denen das Regelwerk eine Annahme trifft, die ein Mensch mit Fachwissen prüfen sollte. Jeder Meilenstein ergänzt sie.

Je Punkt: die Frage, unsere Annahme, die Fundstellen und die Tests, die sich ändern, wenn die Antwort anders ausfällt. Im Regelwerk tragen die betroffenen Werte meist den Status `pruefen` und erscheinen im Ergebnis als Hinweis.

## Hohe Priorität

### 30. Krankenversicherung bei unverheirateten Paaren auf Weg B

- **Frage:** Soll der Vergleich auf Weg B den Beitrag zur Krankenversicherung abziehen, wenn ein Partner ohne eigene Versicherung lebt und das Paar nicht verheiratet ist?
- **Hintergrund:** Auf Weg A ist eine Person mit Grundsicherungsgeld in der Regel pflichtversichert (§ 5 Abs. 1 Nr. 2a SGB V, Ausnahmen nach § 5 Abs. 5a SGB V); einen Beitrag zahlt sie nicht selbst. Auf Weg B zahlen Kinderzuschlag und Wohngeld nichts für die Krankenkasse. Verheiratete können oft in die Familienversicherung (§ 10 Abs. 1 SGB V), unverheiratete Partner nicht. Sie müssen sich selbst versichern (§ 188 Abs. 4 SGB V oder freiwillig). Mindestbeitrag 2026 ohne eigenes Einkommen: beitragspflichtig mindestens 3.955 € ÷ 90 je Tag × 30 = 1.318,33 € (§ 240 Abs. 4 Satz 1, § 223 Abs. 2 SGB V), davon 14,0 % (§ 243 SGB V) + Ø-Zusatzbeitrag 2,9 % (BAnz AT 10.11.2025 B7) + Pflege 3,6 % für Eltern, vom zweiten bis zum fünften Kind unter 25 je 0,25 Punkte weniger (§ 55 Abs. 1 und Abs. 3 Satz 3 bis 5, § 57 Abs. 4 SGB XI; § 1 PBAV 2025). Das sind etwa 270 € (1 Kind), 267 € (2 Kinder), 264 € (3 Kinder). Werte in `parameter/<stand>/kv.json`, Rechnung in `src/krankenversicherung.ts`. Ab 2027 mit der geplanten Bezugsgröße von 4.130 € (Punkt 18): etwa 282 €, 279 € und 275 €.
- **Unsere Annahme in Version 0 (M4):** Der Vergleich zieht den Beitrag noch nicht ab. Version 0 weiß nicht, ob ein Paar verheiratet ist und wie jede Person versichert ist. Die Karte `b_krankenversicherung` nennt den Beitrag: „Ohne Einkommen sind das nach den Regeln etwa {kv.mindestbeitrag} im Monat oder mehr.“
- **Entscheidung von Nico am 29.10.2026, gehört zum Umfang von M5:** Sobald die Fragen „Seid ihr verheiratet?“ und „Wie ist jede erwachsene Person krankenversichert?“ da sind, zieht der Vergleich den Beitrag auf Weg B ab. Das ist eine Änderung an der Rechnung (vergleich.ts, Tests und Sollwerte), nicht „später“. Dabei mitprüfen: den Zuschuss nach § 26 Abs. 2 und 4 SGB II und seine Sperre für den erweiterten Zugang (§ 6a Abs. 1a Nr. 3 BKGG, siehe unten).
- **Wechselwirkungen, ungeklärt:** Im SGB II mindern Beiträge zur Kranken- und Pflegeversicherung von Personen, die nicht versicherungspflichtig sind, das Einkommen (§ 11b Abs. 1 Satz 1 Nr. 3 Buchst. a SGB II); der Partner ohne Einkommen hat aber kein eigenes Einkommen, von dem sie abgehen könnten. Wer allein durch den Beitrag hilfebedürftig würde, bekommt vom Jobcenter einen Zuschuss in der nötigen Höhe (§ 26 Abs. 2 und 4 SGB II). Ob und wie das in die Prüfung des Kinderzuschlags einfließt, ob der Bedarf gedeckt ist (§ 6a Abs. 1 Nr. 3 BKGG), ist offen. Den erweiterten Zugang sperrt nach dem Wortlaut schon der Antrag auf einen solchen Zuschuss: Er ist eine Leistung nach dem Zweiten Buch (§ 6a Abs. 1a Nr. 3 BKGG: kein Mitglied der Bedarfsgemeinschaft „erhält oder beantragt“ Leistungen nach dem SGB II; Hinweis des rechts-pruefer vom 29.10.2026). Laut einem Jobcenter-Leitfaden gibt es keinen Sofortzuschlag, wenn nur dieser Zuschuss gezahlt wird (Sekundärquelle, nicht in den Weisungen gelesen); das passt zu Punkt 7.
- **Weitere Grenzen der Rechnung:**
  - Der Mindestbeitrag nimmt an, dass die Person Elternteil aller Kinder ist. Sind die Kinder nur vom anderen Partner, zahlt sie als Kinderlose den Zuschlag von 0,6 Punkten: 21,1 % × 1.318,33 € = etwa 278 €. Solche Patchwork-Familien sind nicht im Umfang von Version 0 (M5-Vormerkung „Patchwork-Frage“).
  - Bezugsgröße 2027: seit dem 29.10.2026 mit 4.130 €, Status `geplant` (Punkt 18).
  - Jede Kasse hat ihren eigenen Zusatzbeitrag. Bei Kassen unter 2,9 % liegt der Beitrag etwas unter dem Überschlag; die Karte sagt deshalb „etwa … oder mehr“ (Vorschlag beider Prüfer, Entscheidung von Nico am 29.10.2026).
- **Überschlag, ohne Wechselwirkungen:** Was sich in T01–T10 ändern würde, wenn die Paare nicht verheiratet wären und der Partner ohne Einkommen sich selbst versichern müsste (Fehlbetrag Weg B zum Bedarf; negativ = Überschuss; Stand 2026):

  | Haushalt | Ergebnis heute | Fehlbetrag heute | Beitrag | Fehlbetrag mit Beitrag | Folge |
  |---|---|---|---|---|---|
  | T01 | Weg B deckt | −460 € | 267 € | −193 € | deckt weiter |
  | T02 | Weg B deckt | −5 € | 267 € | +262 € | deckt nicht mehr, mehr als 100 €: nur Weg A |
  | T03 | erweiterter Zugang | +18,68 € | – | +18,68 € | nicht betroffen (alleinerziehend, mit Arbeit) |
  | T04 | nur Weg A | +1.046 € | 267 € | +1.313 € | bleibt nur Weg A, Abstand größer |
  | T05 | Weg B deckt | −873 € | 264 € | −609 € | deckt weiter |
  | T06 | Weg B deckt | −57 € | 270 € | +213 € | deckt nicht mehr; Weg A ist wegen des Ersparten ausgeschlossen, der Rest käme aus dem Ersparten |
  | T07 | erweiterter Zugang | +65 € | 267 € | +332 € | kein erweiterter Zugang mehr: nur Weg A |
  | T08 | nur Weg A | +644 € | 270 € | +914 € | bleibt nur Weg A, Abstand größer |
  | T09 | Weg B deckt | −656 € | 267 € | −389 € | deckt weiter |
  | T10 | Weg B deckt | −489 € | 267 € | −222 € | deckt weiter |

  Betroffen wären also alle Paare (T01, T02, T04 bis T10), im Ergebnis ändern würden sich T02, T06 und T07. Mit dem Zuschuss nach § 26 Abs. 2 und 4 SGB II könnte es anders aussehen.
- **Für M5 (im Umfang):** Fragen „Seid ihr verheiratet?“ und „Wie ist jede erwachsene Person krankenversichert?“ (etwa: über die Arbeit, über Arbeitslosengeld oder Krankengeld, über den Ehepartner oder die Ehepartnerin, selbst, privat, weiß nicht). Danach zieht der Vergleich den Beitrag auf Weg B ab und prüft den Zuschuss nach § 26 Abs. 2 und 4 SGB II mit.
- **Fundstellen:** § 5 Abs. 1 Nr. 2a, § 10 Abs. 1, § 188 Abs. 4, § 223 Abs. 2, § 240 Abs. 4 Satz 1, § 242a, § 243 SGB V; §§ 55, 57 Abs. 4 SGB XI; § 1 PBAV 2025; § 1 SVBezGrV 2026; § 11b Abs. 1 Satz 1 Nr. 3, § 26 Abs. 2 und 4 SGB II; § 6a Abs. 1 Nr. 3 und Abs. 1a BKGG.
- **Betroffene Tests:** `krankenversicherung.test.ts`; `folgen.test.ts` „Krankenversicherung: Mindestbeitrag gerundet …“ und „ab 2027: Mindestbeitrag …“; `parameter.test.ts` „Krankenversicherung (M4) …“, „Krankenversicherung 2027 …“ und „Krankenversicherung 2028 …“. Zieht der Vergleich den Beitrag später ab: `vergleich.test.ts`, `haushalte.test.ts`, T01–T10 (soll.vergleich und soll.folgen).

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

### 3. Erweiterter Zugang durch Erspartes: der zweite Monat – geklärt (M4, 28.10.2026)

- **Frage:** Was passiert, wenn der erweiterte Zugang nur dank des Ersparten greift und das Ersparte im ersten Monat aufgebraucht ist?
- **Ergebnis:** Der KiZ bleibt für sechs Monate fest (§ 6a Abs. 7 BKGG). Fehlt danach wieder Geld, ist ergänzend Grundsicherung möglich, „bereits ab dem ersten Monat des BWZ“ (DA-KiZ C.4.3 Satz 2 und 3, Stand 20.02.2026, im Original gelesen). Folgen-Karte `b_erweiterter_zugang_erspartes`. Offen bleibt nur Punkt 2 (ob das Ersparte überhaupt mitzählt).
- **Fundstellen:** § 6a Abs. 7 BKGG; DA-KiZ C.4.2 Abs. 5 Satz 2, C.4.3.
- **Betroffene Tests:** `kiz.test.ts` „DA-KiZ C.4.2 Abs. 2: Erspartes zählt beim erweiterten Zugang mit“; `folgen.test.ts` „erweiterter Zugang nur dank Erspartem“.

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
- **Unsere Annahme seit dem 28.10.2026 (M4):** Nein. Entscheidung von Nico (Option B): Jobcenter entscheiden nach den Fachlichen Weisungen; Gut Bescheid zeigt kein Geld, das in der Praxis abgelehnt wird. Parameter `sofortzuschlagOhneAnspruch` = `nicht_ohne_leistungsbezug`, Status `pruefen`. Er erscheint im Ergebnis als Hinweis, wenn die Regel greift (Lücke A ohne Kindergeld wäre positiv). T09 zeigt auf Weg A 0 € statt 50 €, dazu die Karte `a_kein_geld` („Auf diesem Weg kein Geld“). Die Entscheidung aus M3 (25 € je Kind nach dem Wortlaut) bleibt als Wert `wenn_luecke_ohne_kindergeld_positiv` umschaltbar.
- **Offen für die Rechtsberatung: Wortlaut gegen Weisungen.**
  - **Wortlaut:** § 72 Abs. 1 Satz 2 Nr. 2 SGB II nennt Kinder, die „nur deshalb keinen Anspruch auf Grundsicherungsgeld haben, weil im Rahmen der Prüfung der Hilfebedürftigkeit Kindergeld berücksichtigt wurde“. Das ließe den Sofortzuschlag auch zu, wenn der ganze Haushalt nur wegen des Kindergelds keinen Anspruch hat.
  - **Weisungen:** Die Fachlichen Weisungen zu § 72 (Stand 21.01.2025), Kap. 2.3 Abs. 1 (Rz. 72.7), beschreiben Satz 2 Nr. 2 für Kinder, „die mit ihren leistungsbeziehenden Eltern … in einem Haushalt leben, aber keinen eigenen Anspruch … haben und daher nicht Mitglied der Bedarfsgemeinschaft sind“. Den Fall T09, in dem niemand im Haushalt Leistungen bekommt, nennen sie nicht. Der rechts-pruefer verweist zusätzlich auf den Kommentar Sauer zu § 72 Rz. 2 (Haufe): Die Begründung knüpft die Hilfebedürftigkeit der Kinder an die der Eltern. Die Weisungen stammen von vor dem 13. SGB-II-ÄndG, eine neuere Fassung haben wir nicht gefunden.
  - **Lesart „ganzer Haushalt“ (nur beim Wortlaut von Belang):** Gerechnet würde mit dem ganzen angerechneten Kindergeld, nicht je Kind. Je Kind gerechnet bekäme T09 auch nach dem Wortlaut nichts (−286 + 259 = −27 €). Gegenrechnung: Ohne Kindergeld entfiele auch der Überhang samt der Pauschale, die nur seinetwegen abging, und Kinder außerhalb der Bedarfsgemeinschaft mit Einkommen unter ihrem Bedarf kämen zurück.
  - **Kein Doppelbezug auf Weg B:** 2026 steckt der Sofortzuschlag im KiZ. Das ist eine Auslegung: Nach dem bloßen Wortlaut hätte z. B. T01 auf Weg B Lücke A ohne Kindergeld > 0. Für 2027 streicht der Entwurf den Sofortzuschlag im KiZ; ob KiZ-Haushalte ihn dann nach § 72 SGB II bekommen, ist offen.
- **Betroffene Haushalte:** Von T01–T10 nur T09 (Weg A 50 € → 0 €). Sonst die Testfälle in `sgb2.test.ts` (Alleinerziehende mit Kind 15 und 600 € Unterhalt: 25 € → 0 €; T09 mit unklarem Ersparten: 50 € → 0 €, ohne Hinweis „Erspartes zuerst einsetzen“). Das Vergleichsergebnis ändert sich nirgends, weil Weg A bei diesen Haushalten ohnehin weniger bringt als Weg B.
- **Fundstellen:** § 72 Abs. 1 SGB II; § 11 Abs. 1 Satz 4 und 5 SGB II; § 9 Abs. 2 Satz 3 SGB II; § 6a Abs. 2 Satz 4 BKGG; BT-Drs. 21/7860; Fachliche Weisungen der BA zu § 72 SGB II (https://www.arbeitsagentur.de/datei/fachliche-weisungen-zu-paragraph-72-sgb-ii-sofortzuschlag_ba147517.pdf).
- **Betroffene Tests:** `sgb2.test.ts` Block „Sofortzuschlag für Kinder (§ 72 SGB II)“ („Haushalt nur wegen des Kindergelds ohne Anspruch (T09)“, „Gegenrechnung ohne Kindergeld“, „nur wegen Kindergeld ohne Anspruch, Erspartes unklar“, „… Erspartes sicher über dem Freibetrag“); `vergleich.test.ts` „Keine Grundsicherung (T09)“; `parameter.test.ts` „Sofortzuschlag für Haushalte nur wegen Kindergeld ohne Anspruch“; `folgen.test.ts` „T09: kein Eintrag zum Sofortzuschlag mehr“; `tests/haushalte/T09.json` (Felder `erwartung`, `pruefen`, `soll.folgen`).

### 8. Weg A mit nur dem Sofortzuschlag: Wohngeld und erweiterter Zugang – ruht seit Option B (28.10.2026)

- **Stand:** Seit der Entscheidung zu Punkt 7 zeigt Weg A solchen Haushalten kein Geld, sondern die Karte `a_kein_geld`. Die Frage lebt nur wieder auf, wenn die Rechtsberatung dem Wortlaut folgt.
- **Frage:** Kann ein Haushalt wie T09 auf Weg A den Sofortzuschlag beim Jobcenter beantragen und trotzdem Wohngeld bekommen? Und sperrt dieser Antrag den erweiterten Zugang zum KiZ?
- **Frühere Annahme (bis 28.10.2026):** Version 0 zeigte auf Weg A nur den Sofortzuschlag, ohne Wohngeld. § 7 Abs. 1 Satz 1 Nr. 1 WoGG schließt nur „Grundsicherungsgeld“ aus, den Sofortzuschlag nennt er nicht; dann wären 50 € plus Wohngeld möglich. Ein solcher Antrag ist aber ein Antrag auf Leistungen nach dem SGB II und sperrt den erweiterten Zugang (§ 6a Abs. 1a Nr. 3 BKGG). Die Folgen-Karten von Weg A (z. B. Arbeitssuche) passen auf diesen Fall vermutlich nicht. Für M4 und M5 vorgemerkt.
  - **M4, erste Runde:** Solche Haushalte bekamen auf Weg A die Karte `a_nur_sofortzuschlag` (Pflichten siehe Punkt 19). Seit Option B ersetzt durch `a_kein_geld`.
- **Fundstellen:** § 7 Abs. 1 Satz 1 Nr. 1 WoGG; § 72 SGB II; § 6a Abs. 1a Nr. 3 BKGG.
- **Betroffene Tests:** `vergleich.test.ts` „Keine Grundsicherung (T09)“.

### 9. Weg A bei Erspartem knapp über dem Freibetrag

- **Frage:** Was zeigt Weg A, wenn das Ersparte über dem Freibetrag liegt, aber nicht deckt, was im Monat fehlt?
- **Unsere Annahme:** Das SGB-II-Ergebnis meldet „Erspartes zuerst einsetzen“. Weg A zeigt Lücke A plus Sofortzuschlag mit dem Kennzeichen `nachEinsatzDesErsparten`, also den Betrag, sobald das Ersparte eingesetzt ist. Im ersten Monat wäre es weniger.
- **Lücke dazu, ruht seit Option B (Punkt 7):** Mit dem Wert `wenn_luecke_ohne_kindergeld_positiv` zeigte Weg A einem Haushalt wie T09 mit Erspartem sicher über dem Freibetrag keinen Sofortzuschlag, auch nicht „nach Einsatz des Ersparten“, bei Erspartem in einer Spanne um den Freibetrag aber schon. Seit dem 28.10.2026 gibt es den Sofortzuschlag ohne Anspruch gar nicht; die Uneinheitlichkeit besteht nur noch, wenn der alte Wert zurückkommt.
- **Fundstellen:** § 9 Abs. 1, § 12 SGB II.
- **Betroffene Tests:** `vergleich.test.ts` „Erspartes 50 € über dem Freibetrag“ und „Erspartes 20 € über dem Freibetrag“; zur Lücke `sgb2.test.ts` „nur wegen Kindergeld ohne Anspruch, Erspartes unklar“ und „… Erspartes sicher über dem Freibetrag“.

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
- **Unsere Annahme:** Ja. Den Ø-Zusatzbeitrag 2,9 % haben wir am 29.10.2026 im Original gelesen (Bekanntmachung des BMG vom 07.11.2025, BAnz AT 10.11.2025 B7); die RV mit 18,6 % stammt weiter nur aus Sekundärquellen. Primär gelesen sind außerdem KV 14,6 % (§ 241 SGB V), PV 3,6 % (§ 1 PBAV 2025), Kinderlosenzuschlag 0,6 % (§ 55 Abs. 3 SGB XI), AV 2,6 % (§ 341 Abs. 2 SGB III).
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
  - Krankenversicherung (`kv.json`, nur für die Karte `b_krankenversicherung`, M4): Bezugsgröße 2027 4.130 € im Monat nach der Verordnung der Bundesregierung vom 07.10.2026 (BR-Drs. 576/26, § 1; Bundesrat steht aus), `geplant` (Entscheidung von Nico am 29.10.2026). 2028 derselbe Wert fortgeschrieben, `pruefen`, weil es für 2028 noch keine Verordnung gibt. Ø-Zusatzbeitrag und Pflege-Beitragssatz 2027 und 2028 mit den Werten von 2026, `pruefen`. Mindestbeitrag damit etwa 282 € (1 Kind), 279 € (2 Kinder), 275 € (3 Kinder).
  - Wohngeld: Entwurf BT-Drs. 21/8284, `geplant`, mit neuen Mietenstufen. Der federführende Wohnungsausschuss des Bundesrates empfahl die Ablehnung (BR-Drs. 474/1/26, Ziffer 1); das Plenum ist dem am 25.09.2026 nicht gefolgt und hat Änderungen gefordert (BT-Drs. 21/8284, Anlage 3).
- **Fundstellen:** wie genannt; § 66 Abs. 1 EStG, § 6 Abs. 1 BKGG, § 9a Satz 1 Nr. 1 Buchst. a EStG, § 14 Abs. 1 WoGG; BT-Drs. 21/8235 Art. 1 Nr. 2 und 9, Art. 2 Nr. 5, Art. 4, 5 und 7; BR-Drs. 507/26(B); § 8 Abs. 1a SGB IV; § 9 Abs. 1 MiLoG.
- **Betroffene Tests:** `parameter.test.ts` (Stand 2027 und 2028, „Kindergeld: 267 € ab 2027, 272 € ab 2028“, „Arbeitnehmer-Pauschbetrag beim Wohngeld“, „Minijob-Grenze 2028“, „Stand 2028 hat dieselben Werte wie 2027“); `sgb2.test.ts` „ab 2028: eigener Stand mit Kindergeld 272 €“; `wohngeld.test.ts` Block „Geplante Fassung ab 1.1.2027“; `kiz.test.ts` „Stand 2027“; `but.test.ts` „Stand 2027“; `sgb2.test.ts` Block „Stichtag ab 1.1.2027“.

## Folgen-Katalog (M4)

Die Karten stehen in `packages/regelwerk/folgen/*.json`, je Eintrag mit Fundstelle, Status und Bedingung. Geprüft am 28.10.2026 vom rechts-pruefer.

### 19. Pflichten, wenn auf Weg A nur der Sofortzuschlag herauskommt (T09) – ruht seit Option B (28.10.2026)

- **Stand:** Die Karte `a_nur_sofortzuschlag` ist durch `a_kein_geld` ersetzt (Punkt 7). Die Frage lebt nur wieder auf, wenn die Rechtsberatung dem Wortlaut folgt.
- **Frage:** Welche Pflichten gelten für Eltern, die selbst nicht hilfebedürftig sind, wenn der Haushalt Grundsicherung beantragt und nur der Sofortzuschlag herauskommt?
- **Frühere Annahme (bis 28.10.2026):** Bis zur Entscheidung kann das Jobcenter zu Gesprächen einladen (§ 61 SGB I; Merkblatt SGB II Kap. 3.2: Meldepflicht „ab dem Tag der Antragstellung“). Danach gibt es keine Pflichten zur Arbeitssuche, weil diese nur erwerbsfähige Leistungsberechtigte treffen (§ 7 Abs. 1 Nr. 3, §§ 2, 31 SGB II). Angaben und Änderungen melden bleibt Pflicht (§ 60 SGB I). Abgeleitet, in keiner Weisung gelesen. Karte `a_nur_sofortzuschlag`, Status `pruefen`.
- **Fundstellen:** §§ 60, 61, 66 SGB I; § 7 Abs. 1, §§ 2, 31, 32, 59 SGB II i. V. m. § 309 SGB III; § 15 Abs. 4 SGB II; Merkblatt SGB II (August 2026), Kap. 3.2 und 5.
- **Betroffene Tests:** `tests/haushalte/T09.json` (soll.folgen); `folgen-bedingungen.test.ts` „a_kein_geld“.

### 20. Erweiterter Zugang: was „beantragt hat“ sperrt

- **Frage:** Sperrt auch ein abgelehnter oder zurückgenommener Antrag auf Grundsicherung den erweiterten Zugang zum Kinderzuschlag?
- **Unsere Annahme:** Es sperrt ein laufender Antrag oder Bezug zu Beginn des Bewilligungszeitraums. Die Karte `beide_reihenfolge` sagt: „Wenn jemand von euch Grundsicherung beantragt hat oder bekommt, geht das nicht.“ Die DA sagt zu abgelehnten oder zurückgenommenen Anträgen nichts.
- **Fundstellen:** § 6a Abs. 1a Nr. 3 BKGG („erhält oder beantragt hat“); DA-KiZ C.4.2 Abs. 4 („zu Beginn des BWZ“); Merkblatt KiZ Kap. 1.4 („aktuell nicht beantragt“).
- **Betroffene Tests:** `folgen-bedingungen.test.ts` „beide_reihenfolge“; T03 und T07 (soll.folgen).

### 21. Sofortzuschlag nach § 72 SGB II ab 2027

- **Frage:** Fällt der Sofortzuschlag im SGB II 2027 weg? Die Begründung zu BT-Drs. 21/7860 kündigt eine Prüfung bei der Aktualisierung des Regelbedarfsermittlungsgesetzes an. Einen Entwurf haben wir nicht gefunden.
- **Unsere Annahme:** Status `pruefen` wie bisher (Punkt 18).
- **Fundstellen:** BT-Drs. 21/7860, Begründung zu Art. 7.
- **Betroffene Tests:** wie Punkt 18.

### 22. Widersprüche in den Quellen zu § 10 SGB II

- **Frage:** Die Fachlichen Weisungen zu § 10 (Stand 01.07.2026) nennen am Rand „Kinder ab dem 15. Lebensmonat“, im Text „ab dem 14. Lebensmonat“. Das Datum des 13. SGB-II-Änderungsgesetzes steht in den FW als 16.04.2026, in der Weisung 202607004 als 22.04.2026. Die Randziffern im Abschnitt Kinderbetreuung ließen sich im Textauszug nicht sicher zuordnen.
- **Unsere Annahme:** Das Gesetz entscheidet: „den 14. Lebensmonat vollendet“, also ab 14 Monaten. Gesetzesdatum: Ausfertigung 16.04.2026, verkündet 22.04.2026 (BGBl. 2026 I Nr. 107; laut rechts-pruefer auf recht.bund.de). Wir zitieren die FW nach Kapitel und Absatz (Kap. 2.3 Abs. 3 bis 5) statt nach Randziffer.
- **Fundstellen:** § 10 Abs. 1 Nr. 3 SGB II; FW § 10 SGB II Kap. 2.3; Weisung 202607004 vom 01.07.2026.
- **Betroffene Tests:** `parameter.test.ts` „Kinderbetreuung (M4)“; `folgen-bedingungen.test.ts` „Kind unter 14 Monaten“.

### 23. Betreuung: ja oder nein reicht nicht immer

- **Frage:** Reicht die Angabe „betreut ja/nein“ je Kind für die Karten zur Kinderbetreuung?
- **Unsere Annahme:** Für Version 0 ja. Die FW verlangen eine „bedarfsgerechte“ Betreuung im zumutbaren zeitlichen Umfang (Kap. 2.3 Abs. 3 und 5); Teilzeit-Kita, Schließzeiten oder besonderer Betreuungsbedarf (Behinderung, Krankheit) bildet Version 0 nicht ab. Kinder ab 14 Jahren gelten nach den FW in der Regel als ohne Betreuungsbedarf. Ein „bloßer Rechtsanspruch“ auf einen Platz reicht laut FW nicht; das steht dort im Absatz zu Kindern unter 14 Monaten, die Karte `a_kinderbetreuung_platz_fehlt` sagt deshalb nur: „wenn die Betreuung gesichert ist“.
- **Fundstellen:** § 10 Abs. 1 Nr. 3 SGB II; FW § 10 Kap. 2.3 Abs. 3 bis 5.
- **Betroffene Tests:** `folgen-bedingungen.test.ts` Block „Fakten aus Haushalt und Ergebnis“ (Betreuungsalter, Betreuung).

### 24. Heizkosten: Merkblatt gegen Gesetz

- **Frage:** Gilt für zu hohe Heizkosten eine Übergangszeit?
- **Unsere Annahme:** Ja, nach § 22 Abs. 1 Satz 9 SGB II in der Regel bis zu 6 Monate. Das Merkblatt SGB II (Kap. 8.7.1) vereinfacht: „grundsätzlich nur in angemessener Höhe“. Die Karte `a_wohnung` folgt dem Gesetz.
- **Fundstellen:** § 22 Abs. 1 Satz 2 und 9 SGB II; Merkblatt SGB II (August 2026), Kap. 8.7.1.
- **Betroffene Tests:** keine (Text).

### 25. Wer ist ohne eigene Krankenversicherung?

- **Frage:** Wann soll die Karte zur Krankenversicherung erscheinen?
- **Unsere Annahme:** Bei jedem Erwachsenen mit Brutto höchstens bis zur Minijob-Grenze (Minijob ist versicherungsfrei). Weiteres Einkommen zählt nicht, weil Version 0 seine Art nicht kennt. Die Karte nennt deshalb selbst, wer schon versichert ist: mit Arbeitslosengeld oder Krankengeld; beim Elterngeld bleibt meist versichert und zahlt nichts, wer davor pflichtversichert war (§ 192 Abs. 1 Nr. 2, § 224 Abs. 1 Satz 1 SGB V; ergänzt nach Nico, 28.10.2026). Elterngeld ist nicht im Umfang und nicht der Grund für die Bedingung. Nicht abgebildet: die Einkommensgrenze der Familienversicherung (ein Siebtel der Bezugsgröße), privat Versicherte, Beamte. Folge: Die Karte erscheint bei allen Paaren in T01–T10 außer T03, weil dort jeweils ein Partner ohne Einkommen lebt. Seit der zweiten Runde nennt sie für Unverheiratete den Mindestbeitrag; ob der Vergleich ihn abziehen soll, steht in Punkt 30.
- **Fundstellen:** § 5 Abs. 1 Nr. 2, Nr. 2a und Abs. 5a, § 7, § 10 Abs. 1, § 188 Abs. 4, § 192 Abs. 1 Nr. 2, § 224 Abs. 1, § 240 SGB V; § 26 SGB II.
- **Betroffene Tests:** `folgen-bedingungen.test.ts` „ohne eigene Krankenversicherung“ und „weiteres Einkommen ändert daran nichts“; T01–T10 (soll.folgen). Für M5 vorgemerkt: Einkommen nach Art fragen (siehe M5-Vormerkungen).

### 26. Persönliches Erscheinen bei Kinderzuschlag und Wohngeld

- **Frage:** Können Familienkasse oder Wohngeldstelle zum persönlichen Erscheinen auffordern?
- **Unsere Annahme:** Ja, auf Verlangen (§ 61 SGB I gilt auch für BKGG und WoGG, § 68 Nr. 9 und 10 SGB I), aber es gibt keine regelmäßigen Termine. Die Karte `b_arbeit_und_betreuung` sagt: „Feste Termine wie beim Jobcenter gibt es nicht.“
- **Fundstellen:** §§ 61, 68 SGB I; Merkblatt KiZ Kap. 7.
- **Betroffene Tests:** keine (Text).

### 27. Haushalte ohne Anspruch, die doch etwas bekommen könnten

- **Frage:** Werden Ansprüche übersehen, die es auch ohne Grundsicherung gibt?
- **Unsere Annahme:** Version 0 bildet nicht ab: Bildung und Teilhabe für Haushalte, die nur deshalb hilfebedürftig wären (§ 7 Abs. 2 Satz 3, § 19 Abs. 3 SGB II), und den Sofortzuschlag nach § 72 Abs. 1 Satz 2 Nr. 1. Ergibt der Vergleich „kein Anspruch“, Weg A aber einen Sofortzuschlag (vergleich.ts), zeigt Gut Bescheid seit M4 den Schritt „Grundsicherung online beantragen“ statt „kein Antrag“. Seit Option B (Punkt 7) kommt das mit den heutigen Werten nicht mehr vor; die Bedingung bleibt für den Fall, dass sich das ändert.
- **Fundstellen:** § 7 Abs. 2 Satz 3, § 19 Abs. 3, § 72 Abs. 1 Satz 2 Nr. 1 SGB II.
- **Betroffene Tests:** `folgen-bedingungen.test.ts` „grundsicherung_online“, „kein_antrag“ und „für jedes Ergebnis passt ein nächster Schritt“.

### 28. Nichterreichbarkeit eines Elternteils: Wirkung auf die Familie

- **Frage:** Was passiert mit der Familie, wenn ein Elternteil nach drei versäumten Terminen als nicht erreichbar gilt?
- **Unsere Annahme:** Der Anspruch dieser Person entfällt (Karte `a_meldetermine`: „dein Anspruch“). Wie der Wohnkostenanteil dann auf die übrige Familie verteilt und an die Vermieterin oder den Vermieter gezahlt wird, sagt die Karte nicht.
- **Fundstellen:** § 7b Abs. 4 SGB II; § 22 Abs. 7 SGB II (laut rechts-pruefer).
- **Betroffene Tests:** keine (Text).

### 29. Karten zu den Gesetzentwürfen 2027

- **Frage:** Wann erscheinen die Karten, und wie lauten sie nach einem Beschluss?
- **Unsere Annahme:** Kinderzuschlag: Ankündigung `b_kiz_2027` ab Stichtag 01.08.2026 bis 31.12.2026, weil die Bewilligung ab dem Antragsmonat 6 Monate läuft und eine Änderung des Höchstbetrags auch laufende Bewilligungen trifft (§ 6a Abs. 7 Satz 3 BKGG). Wohngeld: Ankündigung `b_wohngeld_2027` für jeden Stichtag 2026. Ab Stichtag 2027 die Karten `b_kiz_ab_2027` und `b_wohngeld_ab_2027` („rechnet mit einem Gesetzentwurf“). Nach einem Beschluss sind alle vier neu zu fassen. Nicht im Text: § 42e Abs. 3 WoGG-E (Antrag 2026, Bescheid 2027: es bleibt beim höheren Dezember-Wohngeld).
  - **Zweite Runde (29.10.2026):** Alle vier Karten nennen statt „beim letzten Stand“ den Tag, an dem der Stand des Verfahrens geprüft wurde: „Am 28. Oktober 2026 war das noch nicht beschlossen.“ Das Datum kommt aus den Parametern `kiz.entwurfGeprueftAm` und `wohngeld.entwurfGeprueftAm` (Platzhalter gleichen Namens). Wer den Stand neu prüft, zieht das Datum dort nach. `b_wohngeld_2027` sagt jetzt „kann für viele Haushalte sinken“ statt „soll sinken“: Die Begründung nennt etwa 381.000 Haushalte weniger mit Wohngeld, aber keine Aussage für alle Haushalte (BT-Drs. 21/8284).
- **Fundstellen:** BT-Drs. 21/7860 Art. 7 und 10; BT-Drs. 21/8284 Art. 1 Nr. 25 (§ 42e WoGG-E); § 6a Abs. 7 BKGG.
- **Betroffene Tests:** `folgen-bedingungen.test.ts` „b_kiz_2027“, „b_wohngeld_2027“, „b_kiz_ab_2027“, „b_wohngeld_ab_2027“; `folgen.test.ts` „Stichtag ab 2027“; `tests/haushalte/T01.json` (soll.folgen 2027).

### 31. Familienversicherung ab 2028: Beitrag für Ehepartner

- **Frage:** Kostet die Familienversicherung für Ehepartner ab 2028 Geld, und muss die Karte `b_krankenversicherung` das ab Stichtag 2028 sagen?
- **Befund (rechts-pruefer, 29.10.2026, nicht im Original gelesen):** Das GKV-Beitragssatzstabilisierungsgesetz (BGBl. 2026 I Nr. 228 vom 29.07.2026) soll ab 01.01.2028 für mitversicherte Ehepartner einen Beitrag von 2,5 % der beitragspflichtigen Einnahmen des Mitglieds vorsehen, nicht aber, wenn Kinder bis zum vollendeten 12. Lebensjahr im Haushalt leben (Quelle: AOK-Seite). Der Entwurf des Pflegeneuordnungsgesetzes (Kabinett 30.09.2026) plant dazu 0,52 % in der Pflege. Familien mit Kindern ab 12, wie T09, wären betroffen: bei 4.500 € Lohn etwa 112,50 € im Monat.
- **Unsere Annahme:** Version 0 bildet das nicht ab. Die Karte sagt ab 2028 weiter, dass man oft über den Ehepartner oder die Ehepartnerin mitversichert ist, ohne den Beitrag zu nennen. Bis zur Bewerbung (Freeze) keine Änderung.
- **Fundstellen:** BGBl. 2026 I Nr. 228 (Verkündung auf recht.bund.de am 29.10.2026 gesehen, Wortlaut nicht gelesen); § 10 SGB V.
- **Betroffene Tests:** keine (Text). Bei einer Änderung: `folgen.test.ts`, T09 (soll.folgen mit Stichtag 2028 gibt es noch nicht).

## Kandidaten für weitere Karten (nicht umgesetzt)

Bis zur Bewerbung (30.11.2026) kommen neue Themen nur hierher. Alle stehen in einer der gelesenen Quellen, sind aber nicht im Folgen-Katalog des Fachkonzepts.

- Ortsabwesenheit braucht die Zustimmung des Jobcenters, in der Regel höchstens 3 Wochen im Jahr (§ 7b Abs. 1 bis 3 SGB II; Merkblatt SGB II Kap. 3.2).
- Unterhaltsansprüche gehen auf das Jobcenter über (§ 33 SGB II; Merkblatt SGB II Kap. 13).
- Mit Kinderzuschlag oder Grundsicherung können Kita-Gebühren erlassen werden (Merkblatt KiZ Kap. 8; § 90 Abs. 4 SGB VIII, nicht gelesen).
- Vergünstigungen mit dem Bewilligungsbescheid, zum Beispiel Sozialticket, Tafel, Museen (BA, Antrag und Bescheid; Merkblatt SGB II Kap. 16).
- Arbeitsunfähigkeit dem Jobcenter melden, Bescheinigung spätestens am 3. Tag (Merkblatt SGB II Kap. 3.3).
- Rückforderungen unter 50 € je Bedarfsgemeinschaft fordert das Jobcenter nicht zurück (Merkblatt SGB II Kap. 3.4).
- „Kinderwohngeld“ neben der Grundsicherung (Merkblatt SGB II Kap. 8.1.3).
- Studienstarthilfe für Kinder aus Familien mit Kinderzuschlag (Merkblatt KiZ Kap. 8).
- Befreiung vom Rundfunkbeitrag als Härtefall beim erweiterten Zugang (BVerwG 6 C 10.18, laut rechts-pruefer, nicht gelesen).
