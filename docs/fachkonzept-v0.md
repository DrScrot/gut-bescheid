# Fachkonzept Version 0 – Folgen-Check

Stand: 31.10.2026 · Autor: Nico · Lebende Fassung: Claude-Doc „Fachkonzept Version 0 – Folgen-Check“. Bei Änderungen dort zuerst ändern, dann hier neu exportieren.

## Ziel und Abgrenzung

**Version 0 beantwortet einer Familie in unter 5 Minuten, anonym und ohne Gespräch, zwei Fragen: Welcher Weg bringt uns wie viel Geld? Und was folgt daraus für unseren Alltag?** Verglichen werden zwei Wege: Grundsicherung (SGB II) gegenüber Kinderzuschlag plus Wohngeld plus Bildung und Teilhabe.

**Zielgruppe:** Paare und Alleinerziehende mit mindestens einem Kind unter 18, wohnhaft in Bayern, mit Erwerbseinkommen oder vorübergehend ohne.

**Im Umfang:**

- Rechnung nach Rechtsstand 2026, und für das Wohngeld zusätzlich die *geplante* Fassung ab 1.1.2027, als solche gekennzeichnet
- Folgen-Katalog je Weg: Pflichten, Prüfungen, Kontakte mit Behörden, Fristen
- Checkliste der Unterlagen, Erinnerungen als Kalenderdatei (.ics)
- Spracheingabe für freie Angaben, alles auf dem Gerät, kein Konto

**Nicht im Umfang (bewusst):** Alleinstehende ohne Kinder, Selbstständige mit schwankendem Einkommen, Pflege, die Prüfung des Unterhaltsvorschusses selbst (wer ihn bekommt, gibt ihn als Einkommen des Kindes ein), Ausbildungsvergütung von Kindern, Kinder ab 18, Elterngeld (folgt als eigenes Feld), Eigentümer (Lastenzuschuss), Bundesländer außer Bayern, Antragstellung selbst, Post-Scanner, Erwachsene unter 18 oder ab 65 (vereinfacht, die Regelaltersgrenze nach § 7a hängt vom Geburtsjahr ab). Annahme: Bei zwei Erwachsenen sind beide Eltern aller Kinder; Patchwork-Familien (Kinder nur eines Partners) sind nicht im Umfang von Version 0; sie bekommen einen Hinweis statt eines Ergebnisses. Wer außerhalb des Umfangs liegt, bekommt einen klaren Hinweis und Verweise auf offizielle Rechner, statt eines falschen Ergebnisses. Kinder, die erst durch Kinderzuschlag oder Wohngeld aus der Bedarfsgemeinschaft fallen, erkennt Version 0 nicht.

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

Jeder Schritt besteht aus mehreren Bildschirmen mit je einer Frage. Wer außerhalb des Umfangs liegt, zum Beispiel ohne Kinder oder außerhalb Bayerns, bekommt kein falsches Ergebnis, sondern einen Hinweis mit Begründung.

## Eingaben: das Haushaltsmodell

**Gefragt wird nur, was die Rechnung oder der Folgen-Katalog wirklich braucht: 12 Pflichtangaben, jede auf einem eigenen Bildschirm.** Beträge werden auf Wunsch geschätzt („ungefähr 1.800 €“). Das Ergebnis zeigt dann an, dass es auf einer Schätzung beruht.

| Feld | Typ | Wofür | Frage im Klartext |
| --- | --- | --- | --- |
| `gemeinde` | Auswahl (Gemeinde in Bayern) | Mietstufe Wohngeld | Wo wohnt ihr? |
| `erwachsene` | 1 oder 2 | Haushaltsgröße, Regelbedarfsstufe | Wohnst du allein mit den Kindern oder mit Partner oder Partnerin? |
| `kinder[]` | Liste: Alter in Jahren und Monaten, Einkommen des Kindes (Unterhalt, Unterhaltsvorschuss); Ausbildungsvergütung als eigenes Feld, führt zu „außerhalb des Umfangs“ | Kinderzuschlag, Regelbedarf, Mehrbedarf, BuT, Zumutbarkeit (14. Lebensmonat) | Wie alt sind eure Kinder? |
| `erwachsener[].alter` | Zahl | Vermögensfreibetrag SGB II | Wie alt seid ihr? |
| `erwachsener[].brutto` | Euro pro Monat | Mindesteinkommen KiZ, Freibeträge SGB II, Wohngeld-Einkommen | Wie viel verdient ihr brutto im Monat? |
| `erwachsener[].netto` | Euro pro Monat | anrechenbares Einkommen | Und was kommt netto an? |
| `erwachsener[].sonstigesEinkommen` | Euro pro Monat (ALG I, Krankengeld, Elterngeld) | Einkommensanrechnung | Gibt es weiteres Geld, z. B. Arbeitslosengeld oder Elterngeld? |
| `kaltmiete` | Euro pro Monat | Unterkunftsbedarf, Wohngeld | Wie hoch ist eure Kaltmiete? |
| `nebenkosten` | Euro pro Monat ohne Heizung | Bruttokaltmiete (Wohngeld) | Wie hoch sind die Nebenkosten ohne Heizung? |
| `heizkosten` | Euro pro Monat | Heizbedarf SGB II | Wie viel zahlt ihr fürs Heizen? |
| `vermoegen` | Spanne (unter 10.000 / 10.000–40.000 / 40.000–70.000 / darüber) | Vermögensprüfung je Weg | Wie viel Erspartes habt ihr ungefähr zusammen? |
| `betreuung` | ja/nein je Kind (Kita, Tagespflege, Schule) | Folgen-Katalog Zumutbarkeit | Ist euer Kind tagsüber betreut? |

**Grundsatz: Wir fragen nach Lebenssituationen, nie nach Amtskategorien.** Niemand soll entscheiden müssen, ob ein Betrag „Erwerbseinkommen“ oder „sonstiges Einkommen“ ist. Die App fragt in Alltagsworten („Bekommt euer Kind Geld vom anderen Elternteil oder vom Jugendamt?“ mit den Antworten Unterhalt, Unterhaltsvorschuss, nichts) und ordnet selbst richtig zu. Bei jeder Frage steht ein kurzes „Wo finde ich das?“ mit dem Dokument, auf dem die Zahl steht. Auslöser: Beim Abgleich mit dem KiZ-Lotsen (28.10.2026) war unklar, in welches der Felder Brutto, Netto oder „sonstiges Einkommen“ der Unterhaltsvorschuss gehört. An solchen Stellen brechen Menschen ab, weil sie sonst irgendwo anrufen müssten.

**Bewusst nicht gefragt in Version 0:** Namen, Geburtsdaten (nur Alter), Adresse (nur Gemeinde), Steuer-ID, Bankdaten. Die Daten liegen nur in IndexedDB auf dem Gerät und lassen sich mit einem Klick löschen („Alles löschen“ auf jedem Bildschirm erreichbar).

**Typen im Code:** Euro werden als ganze Cent in `number` (Integer) gespeichert, nie als Kommazahl. Jede Angabe trägt das Flag `geschaetzt: boolean`.

## Regelwerk: Prüflogik und Parameter

**Jede Zahl im Regelwerk trägt drei Angaben: Fundstelle, Gültigkeitsdatum und Prüfstatus.** Die Spalte „Status“ ist ehrlich gemeint. *geprüft* heißt: am 26.10.2026 in einer Primärquelle nachgelesen. *aus Quelle laden* heißt: Die Tabelle ist zu lang für dieses Dokument und wird beim Bau 1:1 aus dem Gesetz übernommen. *prüfen* heißt: Der Wert stammt aus einer Sekundärquelle oder ist abgeleitet und muss vor dem Release bestätigt werden.

### Entscheidungslogik

1. **Bedarf nach SGB II berechnen:** Regelbedarfe + Mehrbedarfe + Kosten der Unterkunft und Heizung.
2. **Einkommen nach SGB II bereinigen:** Netto minus Freibetrag (Grundabsetzbetrag 100 € + Erwerbstätigenfreibetrag, höchstens bis zum Netto). Kindergeld zählt als Einkommen des Kindes. Deckt das eigene Einkommen eines Kindes seinen Bedarf (Regelbedarf + Kopfteil der Wohnkosten), fällt es aus der Bedarfsgemeinschaft (§ 7 Abs. 3 Nr. 4); der Überschuss zählt bis zur Höhe des Kindergelds beim kindergeldberechtigten Elternteil (§ 11 Abs. 1 Satz 5, Kindergeld-Überhang), sein Vermögensfreibetrag entfällt. Vom sonstigen Einkommen Erwachsener ohne Erwerbseinkommen, einschließlich Überhang, werden einmal 30 € Versicherungspauschale abgezogen. Daraus ergibt sich **Lücke A** = Bedarf minus Einkommen. Ist sie 0 oder kleiner, besteht kein Anspruch auf Grundsicherung.
3. **Weg B rechnen:** Kinderzuschlag (wenn das Mindesteinkommen erreicht ist) und Wohngeld (unter der Annahme, dass keine Grundsicherung bezogen wird).
4. **Vergleich:** Deckt Einkommen + Kindergeld + KiZ + Wohngeld den Bedarf, ist Weg B möglich. Das Jobcenter würde nach § 12a SGB II ohnehin auf die vorrangigen Leistungen verweisen. Fehlen höchstens 100 €, greift der erweiterte Zugang zum KiZ (§ 6a Abs. 1a BKGG), dann besteht eine echte Wahl. Fehlt mehr, deckt nur Weg A den Bedarf. Beide Beträge werden trotzdem gezeigt. Erspartes über dem Freibetrag schließt Weg A nur aus, wenn der Teil über dem Freibetrag den Fehlbetrag deckt.
5. **Bildung und Teilhabe** ist auf beiden Wegen möglich. Nur die zuständige Stelle unterscheidet sich.

### Grundsicherung (SGB II), Stand ab 1.7.2026

| Parameter | Wert | Fundstelle | Status |
| --- | --- | --- | --- |
| Regelbedarf Stufe 1 (alleinerziehend) | 563 € | RBSFV 2026 | geprüft |
| Regelbedarf Stufe 2 (je Partner) | 506 € | RBSFV 2026 | geprüft |
| Regelbedarf Kind 14–17 / 6–13 / 0–5 | 471 / 390 / 357 € | RBSFV 2026 (Nullrunde) | geprüft |
| Mehrbedarf Alleinerziehende | 36 % von Stufe 1 bei Kind unter 7 oder 2–3 Kindern unter 16, oder 12 % je Kind, wenn das mehr ergibt; höchstens 60 % (Unterschied erst ab 4 Kindern) | § 21 Abs. 3 SGB II | geprüft |
| Grundabsetzbetrag Erwerbseinkommen | 100 € | § 11b Abs. 2 SGB II | geprüft |
| Erwerbstätigenfreibetrag | 20 % auf 100–520 €, 30 % auf 520–1.000 €, 10 % auf 1.000–1.200 € (1.500 € mit minderjährigem Kind), jeweils vom Brutto | § 11b Abs. 3 SGB II | geprüft |
| Versicherungspauschale | 30 € monatlich vom Einkommen Volljähriger; bei Erwerbseinkommen schon im Grundabsetzbetrag von 100 € enthalten | § 6 Abs. 1 Nr. 1 GrusiGV; § 11b Abs. 2 SGB II | geprüft (26.10.2026); gilt auch für den Kindergeld-Überhang (BSG B 4 AS 49/13 R) |
| Stichtag ab 1.1.2027 | Regelsätze 2027 noch nicht festgelegt: gerechnet wird mit den Werten von 2026. Kindergeld nach Entwurf; ab 1.1.2028 eigener Stand mit 272 € | RBSFV 2027 noch nicht verkündet; BT-Drs. 21/8235 | prüfen; Kindergeld geplant |
| Kindergeld | 259 € je Kind; geplant 267 € ab 1.1.2027 und 272 € ab 1.1.2028 | § 66 Abs. 1 EStG; § 6 Abs. 1 BKGG; BT-Drs. 21/8235 | 2026 geprüft; 2027/2028 geplant, nicht beschlossen (Stand 28.10.2026) |
| Vermögensfreibetrag je Person | 0–29 Jahre: 5.000 €, 30–39: 10.000 €, 40–49: 12.500 €, ab 50: 20.000 € (Gesetz: „bis zur Vollendung des 30. Lebensjahres“ bzw. „ab dem 31. Lebensjahr“, das am 30. Geburtstag beginnt). Der höhere Betrag gilt ab Beginn des Monats, in dem die Altersgrenze erreicht wird (Satz 2). Nicht als Vermögen zählen u. a. ein angemessenes Auto je erwerbsfähiger Person und Altersvorsorge-Verträge (§ 12 Abs. 1). Nicht ausgeschöpfte Beträge sind innerhalb der Bedarfsgemeinschaft übertragbar, keine Karenzzeit mehr | § 12 SGB II | geprüft |
| Rundung | auf zwei Nachkommastellen, ab 5 an der dritten Stelle aufrunden; je Freibetragsstufe | § 41 Abs. 2 SGB II | prüfen |
| Sofortzuschlag Kinder | 25 € je Kind mit Anspruch; auch für Kinder leistungsbeziehender Eltern, die nur wegen des angerechneten Kindergelds keinen eigenen Anspruch haben (Satz 2 Nr. 2). Bezieht niemand im Haushalt Leistungen, rechnet Gut Bescheid keinen Sofortzuschlag (Fachliche Weisungen § 72 Rz. 72.7) | § 72 Abs. 1 SGB II | Wortlaut geprüft; ohne Leistungsbezug abgeschaltet, Parameter auf prüfen; Widerspruch Wortlaut/Weisungen in offene Rechtsfragen Punkt 7 |
| Wohnkosten | tatsächliche Kosten bis zur regionalen Angemessenheitsgrenze, im ersten Jahr höchstens 1,5-fach | § 22 SGB II | geprüft; regionale Grenzen nicht in Version 0, siehe Hinweis |
| Bewilligungszeitraum | in der Regel 12 Monate, 6 Monate bei schwankendem Einkommen | BA | geprüft |

*Hinweis Wohnkosten:* Version 0 rechnet mit den tatsächlichen Kosten und zeigt deutlich: „Das Jobcenter prüft, ob eure Miete angemessen ist. Die Grenze legt jedes Jobcenter selbst fest.“ Regionale Grenzen kommen später, Landkreis für Landkreis.

### Kinderzuschlag (§ 6a BKGG)

| Parameter | Wert | Fundstelle | Status |
| --- | --- | --- | --- |
| Höchstbetrag je Kind (2027 geplant: 272 €, Sofortzuschlag entfällt laut Entwurf Haushaltsbegleitgesetz 2027, BT-Drs. 21/7860 Art. 7) | 297 € | § 6a BKGG, Merkblatt KiZ 2026 | geprüft |
| Mindesteinkommen (brutto, Durchschnitt der letzten 6 Monate) | 900 € Paare, 600 € Alleinerziehende | DA-KiZ C | geprüft |
| Anrechnung Kindeseinkommen (ohne Kindergeld) | 45 % | § 6a Abs. 3 BKGG | geprüft |
| Anrechnung Elterneinkommen | 45 % des bereinigten Einkommens über dem elterlichen Bedarf; Gesamtbetrag kaufmännisch auf volle Euro (§ 11 Abs. 2 BKGG, DA-KiZ E.5 Abs. 2); 0,01–0,49 € ergibt keinen KiZ | § 6a Abs. 6 BKGG | geprüft |
| Elterlicher Bedarf | Regelbedarfe der Eltern + Mehrbedarfe + Wohnkostenanteil der Eltern | DA-KiZ | geprüft |
| Wohnkostenanteil der Eltern | Paar: 1 Kind 83 %, 2 Kinder 71 %; alleinerziehend: 1 Kind 77 %, 2 Kinder 63 %; ab 3 Kindern: Paar 62 / 55 / 50 %, alleinerziehend 53 / 46 / 40 % (3 / 4 / 5 Kinder) | 12. Existenzminimumbericht, DA-KiZ | geprüft (DA-KiZ C.3.1.2; Merkblatt KiZ, Stand Juli 2026) |
| Erhebliches Vermögen (ganze Familie) | 40.000 € für die berechtigte Person plus 15.000 € je weiteres Mitglied der Bedarfsgemeinschaft | § 6a Abs. 3 Satz 5 BKGG (seit 1.7.2026) | geprüft (Merkblatt KiZ, Stand Juli 2026) |
| Erweiterter Zugang | wenn mit KiZ und Wohngeld höchstens 100 € zum Bedarf fehlen und die Freibeträge wegen Erwerbstätigkeit mindestens 100 € betragen (§ 6a Abs. 1a Nr. 2); Erspartes über dem SGB-II-Freibetrag zählt nach DA-KiZ C.4.2 Abs. 2 mit, obwohl § 6a Abs. 1a Nr. 1 nur Einkommen, KiZ und Wohngeld nennt | § 6a Abs. 1a BKGG | geprüft |
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
| Werbungskosten ab 1.1.2027 | Arbeitnehmer-Pauschbetrag 1.430 € statt 1.230 € (119,17 € im Monat) | § 14 Abs. 1 WoGG i. V. m. § 9a EStG; BT-Drs. 21/8235, Art. 1 Nr. 2 | geplant, nicht beschlossen (Stand 28.10.2026) |
| Erhebliches Vermögen | 60.000 € für das erste, 30.000 € je weiteres Haushaltsmitglied | Wohngeld-VwV | prüfen |
| **Geplant ab 1.1.2027** | Fortschreibung ausgesetzt, Heizkostenkomponente halbiert, Parameter c erhöht, Mindestbetrag 15 € statt 10 €, Wohngeld höchstens so hoch wie die Miete (§ 19 Abs. 4 neu), Vermögensgrenze im Gesetz (60.000 € plus 30.000 € je weitere Person, höchstens 120.000 €), Minijob ohne Werbungskosten, Übergangsregel § 42e | Regierungsentwurf BT-Drs. 21/8284, 1. Lesung 8.10.2026, Anhörung im Ausschuss 4.11.2026, nicht beschlossen (Stand 28.10.2026); laut Entwurf neue Mietenstufen ab 2027 (z. B. Pocking II, Lkr. Regensburg III); der federführende Wohnungsausschuss des Bundesrates empfahl die Ablehnung (BR-Drs. 474/1/26, Ziffer 1); das Plenum ist dem am 25.09.2026 nicht gefolgt und hat Änderungen gefordert (BT-Drs. 21/8284, Anlage 3) | Status *geplant*, nicht beschlossen |

### Bildung und Teilhabe

| Leistung | Wert | Status |
| --- | --- | --- |
| Schulbedarf | 130 € im 1., 65 € im 2. Schulhalbjahr | geprüft (BMBFSFJ-Einlegeblatt 2026) |
| Soziale und kulturelle Teilhabe | 15 € im Monat | geprüft (§ 28 Abs. 7 SGB II) |
| Mittagessen in Kita und Schule, Ausflüge, Schülerbeförderung, Lernförderung | tatsächliche Kosten | geprüft (§ 28 Abs. 2, 4–6 SGB II) |
| Zuständig | Weg A: Jobcenter. Weg B: Kommune (Landratsamt oder kreisfreie Stadt) | Weg B geprüft; Weg A (Jobcenter) prüfen |

**Abgleich:** GETTSIM (Open-Source-Modell für Steuern und Transfers) dient als zweite Referenz neben den offiziellen Rechnern. Lizenz und Rechtsstand prüfen, bevor Code übernommen wird.

## Folgen-Katalog: was jeder Weg für den Alltag bedeutet

**Dieser Katalog ist der Kern des Produkts, denn kein offizieller Rechner zeigt ihn.** Er wird genauso gepflegt wie das Regelwerk: Jede Aussage hat eine Fundstelle und einen Status. Formuliert wird neutral. Die App rät von keinem Weg ab. Je Ergebnisart ordnet ein Satz ein, was gilt: Beim erweiterten Zugang sind beide Wege ein Recht. Deckt Weg B den Bedarf, müssen Kinderzuschlag und Wohngeld zuerst beantragt werden (§ 12a SGB II). Deckt nur die Grundsicherung den Bedarf, sagt die App das klar. Die Tabelle fasst den Stand nach M4 zusammen; jede Abweichung vom ersten Entwurf folgt der Primärquelle.

| Thema | Weg A: Grundsicherung | Weg B: Kinderzuschlag + Wohngeld | Fundstelle / Status |
| --- | --- | --- | --- |
| Zuständig | Jobcenter am Wohnort | Familienkasse (KiZ). Wohngeldstelle: meist das Landratsamt, in manchen Städten die Stadt. Bildung und Teilhabe: Landratsamt oder kreisfreie Stadt | § 36 SGB II; §§ 9, 13 BKGG; § 24 WoGG; Art. 109a AGSG; geprüft; ob Große Kreisstädte Wohngeld bearbeiten: prüfen |
| Vorrang | Deckt Weg B den Bedarf aller für mindestens 3 Monate, müssen KiZ und Wohngeld zuerst beantragt werden. Sonst kann das Jobcenter den Antrag selbst stellen | – | § 12a Satz 2 Nr. 2, § 5 Abs. 3 SGB II; geprüft |
| Kein Grundsicherungsgeld | Reicht das Einkommen mit Kindergeld für den Bedarf, gibt es auf Weg A kein Grundsicherungsgeld. Ohne Leistungsbezug im Haushalt rechnet Gut Bescheid auch keinen Sofortzuschlag (z. B. T09) | – | § 72 Abs. 1 SGB II; Fachliche Weisungen § 72 Rz. 72.7; Parameter prüfen (offene Rechtsfragen Punkt 7) |
| Reihenfolge der Anträge | Wer Grundsicherung beantragt hat oder bekommt, verliert den erweiterten Zugang. Später dazu beantragen geht | erweiterter Zugang nur ohne Grundsicherung im Haushalt | § 6a Abs. 1a Nr. 3 BKGG; DA-KiZ C.4.2, C.4.3; geprüft; offen: ob ein abgelehnter oder zurückgenommener Antrag sperrt (offene Rechtsfragen Punkt 20) und der Antrag auf den Zuschuss nach § 26 SGB II (Punkt 30); Karte wird hervorgehoben |
| Wessen Einkommen zählt | alle in der Bedarfsgemeinschaft: Partner, auch unverheiratet, und Kinder unter 25 | Eltern und Kinder (KiZ), alle Haushaltsmitglieder (Wohngeld) | § 7, § 9 SGB II; § 6a BKGG; §§ 5, 13 WoGG; geprüft |
| Pflicht zur Arbeitssuche | ja, für alle Erwerbsfähigen; fast jede Arbeit gilt als zumutbar | keine | § 2, § 10 SGB II; geprüft |
| Partner oder Partnerin | Beide müssen die Hilfebedürftigkeit verringern. Das Jobcenter kann auch von der Person, die schon arbeitet, mehr Arbeit verlangen, bis Vollzeit | keine Vorgaben | § 2 Abs. 1 und 2, § 7 Abs. 3 und 3a SGB II; geprüft |
| Kinderbetreuung | Ab dem vollendeten 14. Lebensmonat kann Arbeit verlangt werden, wenn die Betreuung gesichert ist (Kita, Tagespflege, Hort, anderer Elternteil). Ein passender Platz reicht, auch ungenutzt. Vorher kann sich nur ein Elternteil zur gleichen Zeit auf das Kind berufen. Die Kommune soll bevorzugt einen Platz anbieten | keine Vorgaben | § 10 Abs. 1 Nr. 3 SGB II; Weisungen § 10 Kap. 2.3; geprüft; Widerspruch in den Weisungen in offene-rechtsfragen.md |
| Termine und Gespräche | Erstgespräch persönlich im Jobcenter, Kooperationsplan (spätestens alle 6 Monate neu). Ab dem zweiten Meldeversäumnis 30 % weniger Regelbedarf für einen Monat. Drei Termine hintereinander versäumt: Anspruch entfällt, im ersten Monat nur Wohnkosten und Mehrbedarfe | keine festen Termine; Erscheinen auf Verlangen möglich. KiZ-Antrag online (KiZ Digital) | § 15 Abs. 2–4, § 15a, § 32, § 7b Abs. 4 SGB II; § 61 SGB I; geprüft |
| Pflicht nicht erfüllt | 30 % des Regelbedarfs für 3 Monate. Endet beim Nachholen, frühestens nach 1 Monat. Zusammen höchstens 30 %. Wohnkosten werden dabei nicht gekürzt | – | §§ 31, 31a Abs. 1 und 4, 31b Abs. 2 SGB II; geprüft |
| Arbeit abgelehnt | Regelbedarf entfällt bis zu 2 Monate. Miete meist direkt an den Vermieter, Krankenversicherung bleibt | – | § 31a Abs. 7, § 31b Abs. 3 SGB II; geprüft |
| Erspartes | Freibetrag nach Alter (5.000–20.000 € je Person), Prüfung sofort; was darüber liegt, zuerst verbrauchen | KiZ: über 40.000 € plus 15.000 € je weitere Person. Wohngeld: in der Regel 60.000 € plus 30.000 € je weitere Person | § 12 SGB II, § 6a Abs. 3 Satz 5 BKGG geprüft; Wohngeld (§ 21 Nr. 3 WoGG) prüfen |
| Kontoauszüge | können für 3 Monate verlangt werden; Ausgaben teils schwärzbar; Ablehnung erst nach Frist | als Beleg für Miete und Erspartes | §§ 60, 66 SGB I; Merkblatt SGB II Kap. 14; geprüft |
| Wohnung | Angemessenheit wird geprüft. Im ersten Jahr volle Miete, höchstens das 1,5-Fache der Grenze (Familien im Einzelfall mehr). Danach Kostensenkung, meist bis zu 6 Monate Zeit. Heizung ohne Karenzjahr, meist 6 Monate Übergang | keine Pflicht zum Umzug; die Miete zählt bis zum Höchstbetrag | § 22 Abs. 1 SGB II; §§ 11, 12 WoGG; geprüft (Merkblatt SGB II vereinfacht) |
| Krankenversicherung | über den Bezug versichert, das Jobcenter zahlt | **keine Absicherung durch die Leistung.** Ohne Job oder mit Minijob: Familienversicherung nur für Verheiratete und eingetragene Lebenspartner; nach Pflichtversicherung beitragsfrei während Elterngeld; sonst eigener Beitrag, etwa {kv.mindestbeitrag} im Monat oder mehr | § 5, §§ 10, 192, 240 SGB V; § 26 SGB II; geprüft. Der Vergleich zieht den Beitrag noch nicht ab: offene Rechtsfragen Punkt 30, Umfang von M5 |
| Ab wann Geld kommt | Der Antrag wirkt auf den Monatsersten zurück | ab dem Antragsmonat, in der Regel keine Rückwirkung. **Früh beantragen, Nachweise nachreichen** | § 37 SGB II; § 5 Abs. 3 BKGG mit § 28 SGB X; § 25 WoGG; geprüft |
| Bewilligung | meist 12 Monate; 6 Monate bei schwankendem Einkommen oder zu hoher Miete | KiZ meist fest für 6 Monate (bei Ein- oder Auszug beginnt ein neuer Zeitraum), Wohngeld meist 12 Monate | § 41 Abs. 3 SGB II; § 6a Abs. 7 BKGG; § 25 WoGG; geprüft |
| Änderungen melden | jede Änderung sofort | KiZ: Einkommen und Miete in den 6 Monaten nicht, wohl aber Ein- und Auszug, Geburt, Umzug ins Ausland, Adresse, Konto. Wohngeld: Einkommen +15 %, Miete −15 %, Auszug, Grundsicherungsantrag; bei −10 % Einkommen mehr Wohngeld auf Antrag | § 60 SGB I; § 6a Abs. 7 BKGG; §§ 27, 28 WoGG; geprüft |

**Stand M4:** 42 Karten, 7 Einordnungen (eine je Ergebnisart), 5 nächste Schritte und 25 Unterlagen, jeweils mit Fundstelle, Status und Bedingung als Daten. Die Lesefassung erzeugt `pnpm katalog` nach `docs/folgen-katalog.md`; ein Test hält sie mit dem Katalog gleich. Karten zu Gesetzentwürfen nennen das Prüfdatum aus den Parametern statt „beim letzten Stand“. Der Mindestbeitrag zur freiwilligen Krankenversicherung ist ein Parameter, ab 2027 mit der Bezugsgröße 4.130 € (BR-Drs. 576/26, Status geplant).

### Darstellung in der App

Die Tabelle fasst die Themen zusammen. Der Katalog im Code hat mehr Karten als Zeilen, zum Beispiel zum erweiterten Zugang, zu den Gesetzentwürfen 2027 und zu Bildung und Teilhabe. Jede Karte hat eine von drei Markierungen: **Pflicht** (Handeln nötig, sonst drohen Kürzungen), **Prüfung** (die Behörde schaut genauer hin) oder **Gut zu wissen**. Jede Karte hat einen Link „Warum?“ zur Fundstelle in einfacher Sprache. Die Karten zu Kinderbetreuung und Partnerin stehen bei Familien ganz oben, weil genau dort die größte Angst sitzt.

## Ergebnis-Bildschirm, Texte und Barrierefreiheit

**Das Ergebnis passt auf einen Handybildschirm und beantwortet erst „Wie viel?“, dann „Was heißt das?“, dann „Was jetzt?“.**

1. **Kopfzeile:** „Für euch kommen zwei Wege infrage.“ Oder: „Nur ein Weg deckt euren Bedarf.“
2. **Zwei Karten nebeneinander** (auf dem Handy untereinander): Weg A und Weg B, jeweils Euro pro Monat und pro Jahr, Spanne bei geschätzten Angaben, Status-Label *Rechtsstand 2026*. Beim Wohngeld zusätzlich: „Ab Januar 2027 voraussichtlich ca. X € (Gesetz noch nicht beschlossen).“
3. **Folgen je Weg:** die Karten aus dem Folgen-Katalog, die drei wichtigsten zuerst.
4. **Nächster Schritt, genau einer:** zum Beispiel „Kinderzuschlag online beantragen, etwa 20 Minuten. Diese 4 Unterlagen brauchst du.“ Mit Link zum offiziellen Antrag und Kalenderdatei für die Erinnerung.
5. **Fußzeile:** Stand-Datum des Regelwerks, Hinweis „Keine Rechtsberatung“, Link zu Beratungsstellen, „Alles löschen“.

### Texte

- Messbar einfach: Standardtexte auf Sprachniveau B1, Lesbarkeitswert nach Amstad (deutsche Flesch-Formel) mindestens 70 je Text, automatisch geprüft in den Tests; dazu eine Ebene in Leichter Sprache für Ergebnis und Folgen-Karten. Du-Form, Sätze unter 15 Wörter, keine Amtssprache ohne Übersetzung („Bedarfsgemeinschaft = alle, deren Geld zusammengerechnet wird“).
- Kein Wort, das bewertet: nicht „Sozialleistung beziehen“, sondern „Geld, das euch zusteht“. Nicht „Sanktion“ ohne Erklärung, sondern „Kürzung um 30 %, wenn …“.
- Jeder Bildschirm zeigt, wie viel noch fehlt („Noch 4 Fragen, etwa 2 Minuten“).
- Spracheingabe: ein Mikrofon-Knopf bei jeder Zahl und jedem Freitext. Nach dem Sprechen kommt eine Rückfrage: „Ich habe verstanden: Kaltmiete 680 €. Stimmt das?“ Vor der ersten Nutzung wird einmal erklärt, dass der Browser das Audio an Google oder Apple sendet, mit Alternative Tastatur.

### Barrierefreiheit (Ziel: WCAG 2.2 AA)

- Kontrast mindestens 4,5:1, Schrift skalierbar bis 200 %, Berührflächen mindestens 44 × 44 px
- vollständig per Tastatur und Screenreader bedienbar, Fortschritt per `aria-live` angesagt
- Vorlesefunktion für Ergebnis und Folgen-Karten (Sprachausgabe des Browsers, läuft lokal)
- Leichte Sprache als zweite Textebene: in Version 0 für Ergebnis und Folgen-Karten, später für alles
- Sprachen: Version 0 nur Deutsch, die Textschlüssel sind aber von Anfang an übersetzbar angelegt (i18n)

## Testhaushalte

**Zehn Haushalte decken die wichtigsten Fälle und Randfälle ab. Bedarf und Freibetrag sind aus den geprüften Parametern vorgerechnet. Die Sollwerte für KiZ und Wohngeld trägst du beim Bau aus den offiziellen Rechnern ein, mit Datum.** Erst wenn alle zehn auf 1 € genau stimmen, gilt das Regelwerk als fertig.

Wohnkosten = Kaltmiete + Nebenkosten + Heizung. Freibetrag = Grundabsetzbetrag 100 € (§ 11b Abs. 2) + Erwerbstätigenfreibetrag (§ 11b Abs. 3) auf das Brutto der erwerbstätigen Person, höchstens bis zum Netto.

| ID | Haushalt | Einkommen (brutto / netto) | Wohnkosten | Prüft vor allem | SGB-II-Bedarf | Freibetrag | Erwartung |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T01 | Paar, Kinder 4 und 8, Nürnberg | 2.400 / 1.750 € | 750 + 180 + 110 = 1.040 € | Standardfall Weg B | 1.759 + 1.040 = 2.799 € | 378 € | Weg B deckt den Bedarf |
| T02 | wie T01 | 1.400 / 1.120 € | 1.040 € | niedriges Einkommen | 2.799 € | 368 € | Weg B deckt knapp (5 € übrig); KiZ-Lotse: ja |
| T03 | alleinerziehend, Kind 3, Erlangen, Unterhaltsvorschuss 227 € | 1.300 / 1.000 € | 550 + 120 + 80 = 750 € | Mehrbedarf 36 %, Kindeseinkommen 45 % | 563 + 357 + 202,68 + 750 = 1.872,68 € | 358 € | erweiterter Zugang (es fehlen 18,68 €); KiZ 195 €, weil der UV zu 45 % angerechnet wird |
| T04 | Paar, Kinder 6 und 9, Landkreis Passau | 850 / 680 € | 620 + 150 + 90 = 860 € | Mindesteinkommen 900 € nicht erreicht | 1.792 + 860 = 2.652 € | 283 € | kein KiZ, nur Weg A |
| T05 | Paar, Kinder 1, 5 und 12, Augsburg | 2.900 / 2.050 € | 900 + 200 + 130 = 1.230 € | Kind unter 14 Monaten (Folgen-Karte), 3 Kinder | 2.116 + 1.230 = 3.346 € | 378 € | Grenzfall, Wohnkostenanteil für 3 Kinder nötig |
| T06 | Paar (35 und 38), Kind 7, Würzburg, Erspartes 60.000 € | 2.200 / 1.650 € | 650 + 150 + 90 = 890 € | Vermögen: SGB II ausgeschlossen (Freibetrag 25.000 €), KiZ möglich (Grenze 70.000 €) | 1.402 + 890 = 2.292 € | 378 € | nur Weg B, Hinweis Vermögen |
| T07 | Paar, Kinder 4 und 8, Nürnberg | 1.300 / 1.040 € | wie T01: 1.040 € | erweiterter Zugang KiZ | 1.759 + 1.040 = 2.799 € | 358 € | erweiterter Zugang (es fehlen 65 €); Wohngeld 940 € |
| T08 | Paar, Kind 4, München | 3.200 / 2.300 € | 1.400 + 250 + 120 = 1.770 € | Miete über dem Wohngeld-Höchstbetrag (Mietstufe VII) | 1.369 + 1.770 = 3.139 € | 378 € | nur Weg A (es fehlen 347 €); Wohngeld 314 €, Miete gedeckelt. Der KiZ-Lotse sagt „ja“, Abweichung in der Testdatei dokumentiert |
| T09 | Paar, Kinder 14 und 16, Regensburg (1.000 € als Kaltmiete, Aufteilung in M3 nachtragen) | 4.500 / 3.100 € | 1.000 € | kein Anspruch | – | 378 € | kein Anspruch auf Weg A, aber Weg B deckt: KiZ 144 €, Wohngeld 225 € |
| T10 | Paar, Kinder 2 und 5, Landkreis Regensburg, eine Person ohne Einkommen und ohne ALG I | 2.800 / 2.000 € | 780 + 170 + 100 = 1.050 € | Krankenversicherungs-Karte, Partner-Karte | 1.726 + 1.050 = 2.776 € | 378 € | Weg B wahrscheinlich |

**So werden die Sollwerte erfasst:** je Haushalt eine Datei `packages/regelwerk/tests/haushalte/T01.json` mit Eingaben, Sollwerten, Quelle („KiZ-Lotse, 28.10.2026“) und Rechtsstand. Weicht ein offizieller Rechner von der Gesetzesrechnung ab, wird das notiert und nicht stillschweigend angeglichen. Die Mietstufen der Orte stammen aus der WoGV-Anlage, nicht aus Annahmen.

## Architektur und Bau-Reihenfolge für Claude Code

**Zwei Teile, streng getrennt: Das Regelwerk ist ein reines TypeScript-Paket ohne Oberfläche. Die App ist eine PWA, die das Regelwerk nur aufruft.** So lässt sich das Regelwerk ohne Klicken testen, später von Kommunen nachnutzen, und es ist der Teil, der beim Prototype Fund gefördert wird.

### Projektstruktur

```
gut-bescheid/
  CLAUDE.md                     Arbeitsregeln für Claude Code (siehe unten)
  LICENSE                       EUPL-1.2 (entschieden)
  docs/fachkonzept-v0.md        dieses Dokument als Export
  packages/regelwerk/
    parameter/2026-07-01/       sgb2.json, kiz.json, wohngeld.json, but.json
    parameter/2027-01-01/       sgb2.json (Werte 2026 fortgeschrieben, status: pruefen), wohngeld.json (status: geplant)
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

- **Jeder Parameter** ist ein Objekt `{ wert, fundstelle, gueltigAb, status }` mit `status` aus „geprueft“, „aus\_quelle“, „pruefen“, „geplant“. Das Ergebnis meldet, wenn ein Wert mit Status „pruefen“ oder „geplant“ eingeflossen ist.
- **Geld:** intern ganze Cent. Die Wohngeldformel rechnet mit Festkomma und 10 Nachkommastellen (decimal.js oder BigInt), genau wie Anlage 3 WoGG.
- **Rechtsstand wählbar:** `berechne(haushalt, { stichtag })`. Ein Test prüft, dass ein Stichtag 2027 die geplanten Werte nimmt und das Ergebnis als „geplant“ markiert.
- **Keine Netzwerkaufrufe** im Regelwerk. Die App funktioniert offline.
- **Stack:** aktuelle Node-LTS, pnpm-Workspaces, Vite, React, TypeScript (strict), Vitest, Playwright für einen End-to-End-Test, Hosting über GitHub Pages.

### Bau-Reihenfolge (Meilensteine)

| # | Meilenstein | Fertig, wenn | Aufwand (Vollzeit, Schätzung) |
| --- | --- | --- | --- |
| M1 | Gerüst: Repository, Lizenz, Workspaces, CLAUDE.md, CI mit Tests | `pnpm test` läuft grün auf GitHub | 0,5 Tage |
| M2 | SGB II: Bedarf, Freibetrag, Lücke A | T01–T10: Bedarf und Freibetrag stimmen auf den Cent | 2–3 Tage |
| M3 | KiZ, Wohngeld, BuT, Vergleichslogik | Sollwerte aus den offiziellen Rechnern eingetragen, alle Tests grün (± 1 €) | 4–6 Tage |
| M4 | Folgen-Katalog als Daten, Auswahl der Karten je Haushalt | Snapshot-Test je Testhaushalt | 1–2 Tage |
| M5 | Oberfläche: Fragebogen, Ergebnis, Speicher, Löschen, Kalenderdatei | Durchlauf T01 im Browser unter 5 Minuten | 4–5 Tage |
| M6 | Spracheingabe, Barrierefreiheit, Veröffentlichung | axe-Check ohne Fehler, Demo-Link online | 2–3 Tage |

Das sind rund drei Wochen Vollzeit. Bis zum 23.11. ist das knapp, aber machbar. Falls es eng wird: M6 auf Spracheingabe beschränken, die Barrierefreiheit kommt dann nach der Bewerbung.

### Arbeitsregeln für Claude Code

Die Arbeitsregeln stehen nur noch in `CLAUDE.md` im Repository. Dieses Dokument wiederholt sie nicht, damit es keine zwei Fassungen gibt.

**So arbeitest du mit Claude Code:** Pro Sitzung genau einen Meilenstein beginnen, zum Beispiel: „Lies CLAUDE.md und docs/fachkonzept-v0.md. Setze M2 um. Schreibe zuerst die Tests aus T01–T10.“ Nach jedem Meilenstein einen Commit machen und das Ergebnis selbst im Browser oder in der Testausgabe ansehen.

## Rechtliche Leitplanken und Akzeptanzkriterien

**Version 0 bleibt allgemeine Information über Regeln. Sie trifft keine rechtliche Bewertung eines Einzelfalls (§ 2 RDG) und speichert keine Daten außerhalb des Geräts.** Daraus folgen feste Formulierungen:

- Statt „Du bekommst 412 €“ heißt es: „Nach den Regeln für 2026 ergibt sich für Haushalte mit euren Angaben etwa 412 €. Verbindlich entscheidet die Behörde.“
- Statt „Das Jobcenter wird verlangen, dass deine Partnerin mehr arbeitet“ heißt es: „In der Grundsicherung kann das Jobcenter alle Erwachsenen im Haushalt in die Arbeitssuche einbeziehen.“
- Jede Folgen-Karte nennt ihre Fundstelle. Jede Seite hat einen Link zu kostenloser Beratung (Sozialberatung der Wohlfahrtsverbände, Verbraucherzentrale).
- Impressum und Datenschutzerklärung gibt es ab dem ersten öffentlichen Link. Die Datenschutzerklärung ist kurz, weil kaum Daten anfallen. Nur der Spracheingabe-Abschnitt braucht Sorgfalt.
- Die rechtliche Ersteinschätzung (IHK-Gründungsberatung oder Law Clinic) prüft genau diese Formulierungen, bevor der Link geteilt wird.

### Akzeptanzkriterien Version 0

- [ ] T01–T10 grün: Abweichung höchstens 1 € pro Monat zu den dokumentierten Sollwerten
- [ ] Kein Parameter mit Status „pruefen“ fließt ohne sichtbaren Hinweis ins Ergebnis ein
- [ ] Wohngeld zeigt Rechtsstand 2026 und daneben, als *geplant* markiert, den Wert ab 2027
- [ ] Haushalte außerhalb des Umfangs bekommen einen klaren Hinweis statt eines Ergebnisses
- [ ] Die App funktioniert offline, im Netzwerk-Tab gibt es keine Anfragen außer dem Laden der App (und der Spracheingabe nach Zustimmung)
- [ ] „Alles löschen“ entfernt die IndexedDB vollständig, geprüft per Test
- [ ] Lighthouse Barrierefreiheit mindestens 95, axe ohne kritische Fehler
- [ ] 3 Personen außerhalb deines Umfelds kommen ohne Hilfe vom Start bis zum Ergebnis und können danach in eigenen Worten sagen, was jeder Weg für sie bedeutet
- [ ] Alle sichtbaren Texte erreichen Amstad ≥ 70 (Test in apps/web)
- [ ] Rechtliche Ersteinschätzung liegt vor

## Quellen

**Gesetze**

- [§ 10 SGB II Zumutbarkeit](https://www.gesetze-im-internet.de/sgb_2/__10.html), [§ 11b SGB II Absetzbeträge](https://www.gesetze-im-internet.de/sgb_2/__11b.html), [§ 12 SGB II Vermögen](https://www.gesetze-im-internet.de/sgb_2/__12.html), [§ 31a SGB II Minderungen](https://www.gesetze-im-internet.de/sgb_2/__31a.html)
- [Anlage 2 WoGG (a, b, c)](https://www.gesetze-im-internet.de/wogg/anlage_2.html), [§ 12 WoGG Höchstbeträge](https://www.gesetze-im-internet.de/wogg/__12.html), [Anlage 3 WoGG Rechenschritte](https://www.sozialgesetzbuch-sgb.de/wogg/anlage-3.html), [Anlage WoGV Mietstufen](https://www.gesetze-im-internet.de/wogv/anlage.html), [§ 27 WoGG](https://www.gesetze-im-internet.de/wogg/__27.html)
- [§ 6a BKGG Kinderzuschlag](https://www.gesetze-im-internet.de/bkgg_1996/__6a.html)
- [Verordnung Regelbedarfsstufen 2026 (BGBl. 2025 I Nr. 243)](https://www.recht.bund.de/bgbl/1/2025/243/regelungstext.pdf?__blob=publicationFile)

**Verwaltungsanweisungen und Merkblätter**

- [Durchführungsanweisung Kinderzuschlag (DA-KiZ)](https://www.arbeitsagentur.de/datei/fw-bkgg_ba023130.pdf), [KiZ-1-Hinweisblatt 2026](https://www.arbeitsagentur.de/datei/kiz1-hinweise_ba036545.pdf), [Merkblatt Kinderzuschlag, Stand Juli 2026](https://www.arbeitsagentur.de/datei/kiz2-merkblattkinderzuschlag_ba034485.pdf)
- [Merkblatt SGB II (BA, 2026)](https://www.arbeitsagentur.de/datei/merkblatt-sgb2_ba043375.pdf), [Fachliche Weisungen § 12 SGB II](https://www.arbeitsagentur.de/datei/fw-zu-par-12-sgb2-beruecksichtigung-von-vermoegen_ba058027.pdf)
- [BA: Grundsicherungsgeld löst Bürgergeld ab](https://www.arbeitsagentur.de/grundsicherung-loest-buergergeld-ab), [BA: Rechte, Pflichten, Minderungen](https://www.arbeitsagentur.de/grundsicherung/pflichten-verstehen-und-beachten/rechte-pflichten-minderungen), [BA: Auszahlung und Dauer](https://www.arbeitsagentur.de/grundsicherung/finanziell-absichern/auszahlung-dauer), [BA: Unterstützung für Familien](https://www.arbeitsagentur.de/grundsicherung/unterstuetzung-fuer-familien)
- [BMBFSFJ: Einlegeblatt Leistungen für Alleinerziehende 2026](https://www.bmbfsfj.bund.de/resource/blob/256052/2b19e389612f4244069d5b1a686e82f8/einlegeblatt-leistungen-fuer-alleinerziehende-2026-data.pdf)

**Gesetzgebung (geplant)**

- [Regierungsentwurf Wohngeldgesetz, BT-Drs. 21/8284](https://dserver.bundestag.de/btd/21/082/2108284.pdf), [Bundestag: 1. Lesung 8.10.2026](https://www.bundestag.de/dokumente/textarchiv/2026/kw41-de-wohngeldgesetz-1217564)

**Sekundärquellen (nur zur Orientierung)**

- [Haufe: Zumutbarkeit und Kinderbetreuung (2026)](https://www.haufe.de/id/beitrag/zumutbarkeit-bei-bezug-von-grundsicherungsgeld-12-kinderbetreuung-HI11443764.html), [Bundesregierung: Regelbedarfe 2026](https://www.bundesregierung.de/breg-de/aktuelles/nullrunde-buergergeld-2383676), [wohngeld.org: Mietstufen Bayern](https://www.wohngeld.org/mietstufe/bayern)

**Offizielle Rechner für Sollwerte:** [KiZ-Lotse](https://www.arbeitsagentur.de/familie-und-kinder/kiz-lotse), Wohngeldrechner des Freistaats Bayern bzw. des BMWSB (aktuellen Link beim Bau prüfen).
