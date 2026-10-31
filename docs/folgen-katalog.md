# Folgen-Katalog (Lesefassung)

Erzeugt aus `packages/regelwerk/folgen/*.json` mit `pnpm katalog`. Nicht von Hand ändern: Ein Test vergleicht diese Datei mit dem Katalog.

Platzhalter in geschweiften Klammern füllt das Regelwerk je Haushalt:

- `{sgb2.vermoegensfreibetrag}`: Freibetrag für Erspartes in der Grundsicherung, je Haushalt
- `{kiz.vermoegensgrenze}`: Grenze für Erspartes beim Kinderzuschlag, je Haushalt
- `{kiz.erweiterterZugangHoechstens}`: höchster Fehlbetrag beim erweiterten Zugang
- `{wohngeld.vermoegensgrenze}`: Grenze für Erspartes beim Wohngeld, je Haushalt
- `{kv.mindestbeitrag}`: Mindestbeitrag einer freiwilligen Kranken- und Pflegeversicherung, auf Euro gerundet, je Kinderzahl
- `{kiz.entwurfGeprueftAm}`: Tag, an dem der Stand des Entwurfs zum Kinderzuschlag 2027 geprüft wurde
- `{wohngeld.entwurfGeprueftAm}`: Tag, an dem der Stand des Entwurfs zum Wohngeld 2027 geprüft wurde

## Karten

### Beide Wege

**1. Reihenfolge der Anträge** · Gut zu wissen · `geprueft` · `beide_reihenfolge` · **hervorgehoben**

Bei euren Angaben ist der erweiterte Zugang möglich. Dann gibt es Kinderzuschlag, obwohl bis zur Grundsicherung noch Geld fehlt. Es dürfen bis zu {kiz.erweiterterZugangHoechstens} im Monat sein. Wenn jemand von euch Grundsicherung beantragt hat oder bekommt, geht das nicht. Umgekehrt geht es: Du kannst später noch Grundsicherung dazu beantragen. Dann gelten dafür auch die Pflichten, zum Beispiel die Arbeitssuche.

*Leichte Sprache:* Nach den Regeln könnt ihr Kinder-Zuschlag bekommen. Auch wenn euch noch etwas Geld fehlt. Aber: Jemand von euch beantragt Grund-Sicherung? Dann gibt es diesen Kinder-Zuschlag nicht. Andersherum geht es: Ihr habt Kinder-Zuschlag? Dann könnt ihr später noch Grund-Sicherung beantragen. Dann gelten auch die Pflichten der Grund-Sicherung. Zum Beispiel: Arbeit suchen.

*Fundstelle:* § 6a Abs. 1a Nr. 3 BKGG; DA-KiZ C.4.2 Abs. 4 und C.4.3 (Stand 20.02.2026); Merkblatt Kinderzuschlag der BA (Stand Juli 2026), Kap. 1.4  
*Erscheint, wenn:* Ergebnis = erweiterter_zugang

**2. Bildung und Teilhabe** · Gut zu wissen · `geprueft` · `beide_bildung_teilhabe`

Bildung und Teilhabe heißt: Geld für Schulsachen, Ausflüge und Essen in Kita und Schule. Das gibt es auf beiden Wegen gleich. In der Grundsicherung ist es meist im Antrag mit drin. Mit Kinderzuschlag oder Wohngeld stellst du dafür einen eigenen Antrag. Er geht in Bayern meist an das Landratsamt, in manchen Städten an die Stadt.

*Leichte Sprache:* Es gibt extra Geld für Kinder. Es heißt Bildung und Teilhabe. Zum Beispiel für Schul-Sachen, Ausflüge und Essen in Kita und Schule. Das Geld gibt es auf beiden Wegen. Bei der Grund-Sicherung ist es meistens im Antrag mit drin. Mit Kinder-Zuschlag oder Wohn-Geld stellst du einen eigenen Antrag. Den Antrag stellst du beim Land-Rats-Amt oder bei der Stadt.

*Fundstelle:* § 28 und § 37 Abs. 1 Satz 2 SGB II; §§ 6b und 9 Abs. 3 BKGG; Art. 109a Abs. 1 AGSG; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 4.1 und 10  
*Erscheint, wenn:* (Grundsicherungsgeld möglich oder Kinderzuschlag > 0 oder Wohngeld > 0)

### Weg A: Grundsicherung

**3. Kind unter 14 Monaten** · Gut zu wissen · `geprueft` · `a_kinderbetreuung_unter_14_monate`

In der Grundsicherung gibt es eine Regel für kleine Kinder. Ist dein Kind jünger als 14 Monate, musst du meist nicht arbeiten. Seid ihr 2 Erwachsene, gilt das nur für einen von euch zur gleichen Zeit. Wer das ist, entscheidet ihr selbst. Zu Terminen im Jobcenter musst du trotzdem kommen. Ab 14 Monaten kann das Jobcenter Arbeit verlangen, wenn dein Kind betreut ist.

*Leichte Sprache:* Dein Kind ist jünger als 14 Monate? Dann musst du meistens nicht arbeiten. Das gilt bei der Grund-Sicherung. Ihr seid 2 Erwachsene? Dann gilt das immer nur für 1 von euch. Ihr entscheidet selbst, wer das ist. Zu Terminen im Job-Center musst du trotzdem gehen. Ab 14 Monaten ist das anders. Dann kann das Job-Center Arbeit verlangen. Aber nur, wenn jemand auf dein Kind aufpasst.

*Fundstelle:* § 10 Abs. 1 Nr. 3 SGB II (Fassung ab 01.07.2026); Fachliche Weisungen der BA zu § 10 SGB II, Rz. 10.2 und Kap. 2.3 Abs. 4 (Stand 01.07.2026)  
*Erscheint, wenn:* Grundsicherungsgeld möglich und Kinder unter 14 Monaten > 0

**4. Arbeit und Kinderbetreuung** · Pflicht · `geprueft` · `a_kinderbetreuung_ab_14_monate`

In der Grundsicherung gibt es eine Regel für Eltern. Ist euer Kind 14 Monate oder älter, kann das Jobcenter Arbeit verlangen. Dafür muss jemand auf euer Kind aufpassen können. Das kann eine Kita sein, eine Tagesmutter oder der andere Elternteil. Bei Schulkindern zählen auch Hort und Ganztag. Ein passender Platz reicht schon, auch wenn ihr ihn nicht nutzt.

*Leichte Sprache:* Euer Kind ist 14 Monate oder älter? Dann kann das Job-Center Arbeit verlangen. Das gilt bei der Grund-Sicherung. Aber nur, wenn jemand auf euer Kind aufpasst. Das kann eine Kita sein. Oder eine Tages-Mutter. Oder der andere Eltern-Teil. Bei Schul-Kindern zählt auch der Hort oder die Ganztags-Schule. Es gibt einen passenden Platz für euer Kind? Dann kann das Job-Center Arbeit verlangen. Auch wenn ihr den Platz nicht nehmt.

*Fundstelle:* § 10 Abs. 1 Nr. 3 SGB II (Fassung ab 01.07.2026); Fachliche Weisungen der BA zu § 10 SGB II, Kap. 2.3 Abs. 3 und 5 (Stand 01.07.2026)  
*Erscheint, wenn:* Grundsicherungsgeld möglich und Kinder unter 14 Monaten = 0 und Kinder von 14 Monaten bis unter 14 Jahren > 0

**5. Noch kein Platz** · Prüfung · `geprueft` · `a_kinderbetreuung_platz_fehlt`

Hat dein Kind noch keinen Platz in Kita, Tagespflege oder Hort? Dann soll die Stadt oder der Landkreis helfen. Stadt und Landkreis sollen darauf achten, dass du bevorzugt einen Platz bekommst. Das Jobcenter berät dich auch dazu. Arbeit kann es erst verlangen, wenn die Betreuung gesichert ist. Das kann ein passender freier Platz sein oder der andere Elternteil.

*Leichte Sprache:* Euer Kind hat noch keinen Platz in einer Kita oder im Hort? Dann soll die Stadt helfen. Oder der Land-Kreis. Euer Kind soll dabei bevorzugt einen Platz bekommen. Das Job-Center berät euch dabei. Erst wenn jemand auf euer Kind aufpassen kann, kann das Job-Center Arbeit verlangen.

*Fundstelle:* § 10 Abs. 1 Nr. 3 Halbsatz 3 SGB II; Fachliche Weisungen der BA zu § 10 SGB II, Kap. 2.3 Abs. 4 und 5 (Stand 01.07.2026)  
*Erscheint, wenn:* Grundsicherungsgeld möglich und davon mit Angabe „nicht betreut“ > 0

**6. Ihr zählt beide** · Pflicht · `geprueft` · `a_partner`

In der Grundsicherung seid ihr eine Bedarfsgemeinschaft. Das sind alle, deren Geld zusammen zählt. Das gilt in der Regel auch, wenn ihr nicht verheiratet seid. Ihr müsst beide alles tun, was geht, damit ihr weniger oder keine Grundsicherung braucht. Das gilt auch, wenn einer von euch schon arbeitet. Dann kann das Jobcenter mehr Arbeit verlangen, auch eine Stelle in Vollzeit.

*Leichte Sprache:* Ihr seid 2 Erwachsene. Bei der Grund-Sicherung wird euer Geld zusammen gerechnet. Auch wenn ihr nicht verheiratet seid. Ihr müsst beide versuchen, mehr Geld selbst zu verdienen. Das Job-Center kann sagen: Du sollst mehr arbeiten. Das gilt auch, wenn du schon Arbeit hast. Es kann auch eine Arbeit für den ganzen Tag sein.

*Fundstelle:* § 2 Abs. 1 und Abs. 2 Satz 2 und 3, § 7 Abs. 3 Nr. 3 und Abs. 3a SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 3.1 und 8.2  
*Erscheint, wenn:* Grundsicherungsgeld möglich und Erwachsene = 2

**7. Erst Kinderzuschlag und Wohngeld** · Pflicht · `geprueft` · `a_vorrang_kiz_wohngeld`

Nach den Regeln decken Kinderzuschlag und Wohngeld bei euren Angaben den Bedarf. Der Bedarf ist der Betrag, den die Grundsicherung zum Leben vorsieht. Dann müsst ihr Kinderzuschlag und Wohngeld vor der Grundsicherung beantragen. Das gilt, wenn es für alle mindestens 3 Monate am Stück reicht. Stellt ihr den Antrag trotz Aufforderung nicht, kann das Jobcenter ihn für euch stellen.

*Leichte Sprache:* Nach den Regeln reichen Kinder-Zuschlag und Wohn-Geld bei euch. Dann müsst ihr zuerst diese beiden Sachen beantragen. Das gilt, wenn das Geld für 3 Monate oder länger reicht. Ihr stellt den Antrag nicht? Dann kann das Job-Center den Antrag für euch stellen.

*Fundstelle:* § 12a Satz 1 und Satz 2 Nr. 2, § 5 Abs. 3 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 8.1.3  
*Erscheint, wenn:* Grundsicherungsgeld möglich und Ergebnis = weg_b_deckt

**8. Auf diesem Weg kein Grundsicherungsgeld** · Gut zu wissen · `geprueft` · `a_kein_geld`

Nach den Regeln gibt es auf diesem Weg bei euren Angaben kein Grundsicherungsgeld. Das ist das Geld zum Leben. Euer Geld reicht für das, was die Grundsicherung dafür vorsieht. Das Kindergeld zählt dabei mit. Verbindlich entscheidet das Jobcenter.

*Leichte Sprache:* Nach den Regeln gibt es auf diesem Weg kein Grund-Sicherungs-Geld für euch. Euer Geld reicht für das, was die Grund-Sicherung zum Leben rechnet. Das Kinder-Geld zählt mit. Das Job-Center entscheidet.

*Fundstelle:* § 7 Abs. 1 Satz 1 Nr. 3, § 9 Abs. 1, § 11 Abs. 1 Satz 5 SGB II  
*Erscheint, wenn:* Betrag Weg A = 0 und nicht Weg A wegen Erspartem ausgeschlossen

*Notiz (intern):* Ersetzt a_nur_sofortzuschlag (Entscheidung von Nico am 28.10.2026: Option B). Ob Haushalte wie T09 den Sofortzuschlag nach § 72 Abs. 1 Satz 2 Nr. 2 SGB II bekommen, regelt der Parameter sgb2.sofortzuschlagOhneAnspruch (pruefen); er steht dann in den Parameter-Hinweisen des Ergebnisses. Wortlaut gegen Weisungen: offene-rechtsfragen.md Punkt 7. Die Karte selbst nennt den Sofortzuschlag nicht. Sie sagt „kein Grundsicherungsgeld“ statt „kein Geld“, weil Bildung und Teilhabe (§ 19 Abs. 3, § 28 SGB II) und der Sofortzuschlag nach § 72 Abs. 1 Satz 2 Nr. 1 auch ohne Grundsicherungsgeld möglich sind; Version 0 rechnet das nicht (offene-rechtsfragen.md Punkt 27, rechts-pruefer 29.10.2026). Nicht bei Weg A wegen Erspartem ausgeschlossen: Dort ist der Grund das Ersparte (a_erspartes_zuerst).

**9. Erst das Ersparte** · Pflicht · `geprueft` · `a_erspartes_zuerst`

Nach euren Angaben liegt euer Erspartes über dem Freibetrag der Grundsicherung. Der Freibetrag ist der Teil, den ihr behalten dürft. Für Haushalte mit euren Angaben sind das etwa {sgb2.vermoegensfreibetrag}. Was darüber liegt, braucht ihr nach den Regeln zuerst zum Leben auf. Erst danach kann es Grundsicherung geben.

*Leichte Sprache:* Ihr habt mehr gespart, als ihr bei der Grund-Sicherung behalten dürft. Nach den Regeln dürft ihr etwa {sgb2.vermoegensfreibetrag} behalten. Vom Geld darüber lebt ihr zuerst. Erst danach kann es Grund-Sicherung geben.

*Fundstelle:* § 9 Abs. 1, § 12 Abs. 2 SGB II  
*Erscheint, wenn:* (Weg A erst nach Einsatz des Ersparten oder Weg A wegen Erspartem ausgeschlossen)

**10. Arbeit suchen** · Pflicht · `geprueft` · `a_arbeit`

Wer arbeiten kann, muss in der Grundsicherung Arbeit suchen oder mehr arbeiten. Fast jede Arbeit gilt als zumutbar. Das heißt: Das Jobcenter kann sie verlangen. Das gilt auch, wenn sie nicht zu deinem Beruf passt oder weiter weg ist. Ausnahmen gibt es zum Beispiel bei Krankheit, Pflege oder einem Kind unter 14 Monaten.

*Leichte Sprache:* Bei der Grund-Sicherung musst du Arbeit suchen. Oder du musst mehr arbeiten. Das Job-Center kann fast jede Arbeit verlangen. Auch wenn die Arbeit nicht zu deinem Beruf passt. Auch wenn die Arbeit weiter weg ist. Es gibt Ausnahmen. Zum Beispiel: Du bist krank. Du pflegst jemanden. Oder dein Kind ist jünger als 14 Monate.

*Fundstelle:* § 2 Abs. 2, § 10 Abs. 1 und 2 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 3.1 und 12.3  
*Erscheint, wenn:* Grundsicherungsgeld möglich

**11. Erstgespräch und Kooperationsplan** · Pflicht · `geprueft` · `a_erstgespraech`

Das erste Gespräch ist persönlich im Jobcenter. Dort machst du mit dem Jobcenter einen Kooperationsplan. Das ist ein Plan mit deinen Zielen und nächsten Schritten. Darin steht auch, was du selbst tun und nachweisen musst. Ein Beispiel sind Bewerbungen. Einigst du dich nicht mit dem Jobcenter, kann es die Schritte festlegen. Spätestens alle 6 Monate wird der Plan neu besprochen.

*Leichte Sprache:* Zuerst hast du ein Gespräch im Job-Center. Du musst dafür selbst hingehen. Dort machst du mit dem Job-Center einen Plan. In dem Plan steht: Was ist dein Ziel? Was sind die nächsten Schritte? Was musst du selbst tun? Zum Beispiel: Wie oft musst du dich bewerben? Du und das Job-Center werdet euch nicht einig? Dann kann das Job-Center das allein bestimmen.

*Fundstelle:* § 15 Abs. 2 bis 4, § 15a Abs. 3 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 5  
*Erscheint, wenn:* Grundsicherungsgeld möglich

**12. Termine im Jobcenter** · Pflicht · `geprueft` · `a_meldetermine`

Lädt dich das Jobcenter ein, musst du kommen. Kannst du nicht, sag sofort Bescheid und nenne den Grund. Fehlst du mehr als einmal ohne wichtigen Grund, wird gekürzt. Dann gibt es einen Monat lang 30 % weniger Regelbedarf. Das ist das Geld für den Alltag. Fehlst du 3-mal hintereinander, entfällt dein Anspruch. Im ersten Monat zahlt das Jobcenter dann nur noch Wohnkosten und Mehrbedarfe. Ein Mehrbedarf ist zum Beispiel Geld für Alleinerziehende. Danach fällt alles weg, auch deine Krankenversicherung über das Jobcenter. Meldest du dich persönlich im Jobcenter, kann es wieder Geld geben.

*Leichte Sprache:* Das Job-Center lädt dich zu einem Termin ein? Dann musst du hingehen. Du kannst nicht? Dann sag sofort Bescheid. Und sag auch, warum. Du fehlst öfter ohne guten Grund? Dann bekommst du einen Monat lang weniger Geld. Du fehlst 3-mal nacheinander? Dann bekommst du bald gar kein Geld mehr vom Job-Center. Auch deine Kranken-Versicherung über das Job-Center endet dann. Erst wenn du selbst hingehst, kann es wieder Geld geben.

*Fundstelle:* § 32 Abs. 1 und 2, § 7b Abs. 4, § 59 SGB II i. V. m. § 309 SGB III; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 3.2 und 12.2  
*Erscheint, wenn:* Grundsicherungsgeld möglich

**13. Wenn du eine Pflicht nicht erfüllst** · Pflicht · `geprueft` · `a_kuerzungen`

Erfüllst du eine Pflicht ohne wichtigen Grund nicht, gibt es weniger Geld. Pflichten sind zum Beispiel Bewerbungen nachweisen oder einen Kurs machen. In der Regel erklärt dir das Jobcenter die Folgen vorher schriftlich. Dann wird der Regelbedarf 3 Monate lang um 30 % gekürzt. Das ist das Geld für den Alltag. Holst du die Pflicht nach, endet die Kürzung früher, frühestens nach einem Monat. Mehrere solche Kürzungen sind zusammen höchstens 30 %. Die Wohnkosten werden dabei nicht gekürzt. Lehnst du Arbeit ab oder fehlst du 3-mal, gelten strengere Regeln.

*Leichte Sprache:* Das Job-Center gibt dir Aufgaben. Zum Beispiel: Du sollst dich bewerben. Oder du sollst einen Kurs machen. Das Job-Center sagt dir meistens vorher schriftlich, was dann passiert. Du machst die Aufgabe nicht und hast keinen guten Grund? Dann bekommst du 3 Monate lang weniger Geld. Es gibt 30 % weniger Geld für den Alltag. Du machst die Aufgabe doch noch? Dann endet das früher. Das Geld für die Wohnung wird dabei nicht gekürzt.

*Fundstelle:* § 31 Abs. 1, § 31a Abs. 1 und 4, § 31b Abs. 2 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 12.1 und 12.4  
*Erscheint, wenn:* Grundsicherungsgeld möglich

**14. Wenn du Arbeit ablehnst** · Pflicht · `geprueft` · `a_arbeit_abgelehnt`

Lehnst du ohne wichtigen Grund eine Arbeit ab, entfällt dein Regelbedarf ganz. Das ist das Geld für den Alltag. Das gilt nur für Arbeit, die das Jobcenter verlangen darf. Und nur, wenn du sofort anfangen könntest. Das Geld fällt dann bis zu 2 Monate weg. Die Miete zahlt das Jobcenter dann meist direkt an die Vermieterin oder den Vermieter. Die Krankenversicherung bleibt.

*Leichte Sprache:* Das Job-Center bietet dir eine Arbeit an. Du könntest sofort anfangen. Du sagst ohne guten Grund nein? Dann bekommst du bis zu 2 Monate kein Geld für deinen Alltag. Die Miete zahlt das Job-Center dann meistens direkt an den Vermieter. Du bleibst kranken-versichert.

*Fundstelle:* § 31a Abs. 7, § 31b Abs. 3 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 12.1.3  
*Erscheint, wenn:* Grundsicherungsgeld möglich

**15. Miete wird geprüft** · Prüfung · `geprueft` · `a_wohnung`

Das Jobcenter prüft, ob eure Miete angemessen ist, also nicht zu hoch. Die Grenze gilt je Ort, dein Jobcenter nennt sie dir. Im ersten Jahr mit Grundsicherung zahlt es die Miete meist voll. Es zahlt aber höchstens das 1,5-Fache der Grenze. Ist die Grenze 800 € im Monat, sind das höchstens 1.200 € im Monat. Für Familien mit Kindern kann es im Einzelfall mehr sein. Nach dem ersten Jahr kann es verlangen, dass ihr die Kosten senkt. Das geht zum Beispiel durch einen Umzug. Dafür habt ihr meist bis zu 6 Monate Zeit. Für die Heizung gilt das erste Jahr nicht. Sind die Heizkosten zu hoch, zahlt es sie meist noch bis zu 6 Monate.

*Leichte Sprache:* Das Job-Center prüft: Ist eure Miete zu hoch? Die Grenze ist an jedem Ort anders. Im 1. Jahr zahlt das Job-Center die Miete meistens ganz. Danach kann es sagen: Eure Miete ist zu hoch. Ihr müsst sie senken. Zum Beispiel mit einem Umzug. Dafür habt ihr meistens bis zu 6 Monate Zeit. Bei den Heiz-Kosten gilt das auch schon im 1. Jahr.

*Fundstelle:* § 22 Abs. 1 Satz 1, 2, 6, 7 und 9 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 8.7.1  
*Erscheint, wenn:* Grundsicherungsgeld möglich

*Notiz (intern):* Heizung: Das Merkblatt sagt vereinfacht „grundsätzlich nur in angemessener Höhe“. Die Karte folgt § 22 Abs. 1 Satz 9 SGB II (Senkung in der Regel innerhalb von 6 Monaten). Siehe offene-rechtsfragen.md Punkt 24.

**16. Erspartes wird geprüft** · Prüfung · `geprueft` · `a_erspartes`

In der Grundsicherung prüft das Jobcenter euer Erspartes gleich am Anfang. Einen Teil dürft ihr behalten. Wie viel, hängt vom Alter ab. Für Haushalte mit euren Angaben sind das zusammen etwa {sgb2.vermoegensfreibetrag}. Was darüber liegt, braucht ihr zuerst zum Leben auf. Ein Auto, das nicht zu viel wert ist, zählt meist nicht mit. Verträge für die Rente auch nicht.

*Leichte Sprache:* Das Job-Center prüft euer Erspartes. Ein Teil davon darf bleiben. Nach den Regeln sind das bei euch zusammen etwa {sgb2.vermoegensfreibetrag}. Ihr habt mehr gespart? Dann lebt ihr zuerst vom Geld, das mehr ist. Ein Auto, das nicht zu viel wert ist, dürft ihr meistens behalten. Bestimmte Verträge für die Rente auch.

*Fundstelle:* § 12 Abs. 1 und 2 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 9.4 bis 9.6  
*Erscheint, wenn:* Grundsicherungsgeld möglich und nicht Weg A erst nach Einsatz des Ersparten

**17. Kontoauszüge** · Prüfung · `geprueft` · `a_kontoauszuege`

Das Jobcenter kann Kontoauszüge der letzten 3 Monate sehen wollen. Das gilt für jedes Konto in der Familie. Bei Ausgaben darfst du manchmal den Empfänger schwärzen, also unlesbar machen. Zum Beispiel bei einer Spende an eine Partei. Der Betrag muss lesbar bleiben. Geld, das auf dein Konto kommt, musst du zeigen. Fehlt ein Nachweis, gibt dir das Jobcenter zuerst eine Frist. Danach kann es das Geld ablehnen.

*Leichte Sprache:* Das Job-Center kann eure Konto-Auszüge sehen wollen. Das sind die Auszüge der letzten 3 Monate. Von jedem Konto. Manche Ausgaben dürft ihr schwärzen. Das heißt: unlesbar machen. Geld, das ihr bekommt, dürft ihr nicht schwärzen. Fehlt ein Papier? Dann bekommt ihr zuerst eine Frist. Das heißt: Ihr habt Zeit bis zu einem Datum. Danach kann das Job-Center das Geld ablehnen.

*Fundstelle:* Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 14; BA: Grundsicherungsgeld – Antrag und Bescheid, Beispiele für wichtige Nachweise (abgerufen 28.10.2026); §§ 60 und 66 SGB I  
*Erscheint, wenn:* Grundsicherungsgeld möglich

**18. Krankenversicherung** · Gut zu wissen · `geprueft` · `a_krankenversicherung`

Mit Grundsicherung bist du in der Regel auch krankenversichert. Das Jobcenter zahlt dafür. Das gilt auch, wenn du kein eigenes Geld verdienst. Warst du vorher privat versichert, bleibst du meist privat versichert. Das Jobcenter zahlt dann einen Zuschuss zum Beitrag.

*Leichte Sprache:* Ihr bekommt Grund-Sicherung? Dann seid ihr meistens auch kranken-versichert. Das Job-Center bezahlt das. Das gilt auch, wenn du kein eigenes Geld verdienst.

*Fundstelle:* § 5 Abs. 1 Nr. 2a und Abs. 5a SGB V; § 26 Abs. 1 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 11.1  
*Erscheint, wenn:* Grundsicherungsgeld möglich und Erwachsene mit Brutto höchstens an der Minijob-Grenze > 0

**19. Ab wann es Geld gibt** · Gut zu wissen · `geprueft` · `a_ab_wann_geld`

Grundsicherung gibt es ab dem Ersten des Monats, in dem du sie beantragst. Stellst du den Antrag mitten im Monat, zählt trotzdem der ganze Monat. Für frühere Monate gibt es nichts. Stell den Antrag deshalb rechtzeitig. Nachweise kannst du später nachreichen.

*Leichte Sprache:* Du stellst den Antrag auf Grund-Sicherung. Dann gibt es Geld für den ganzen Monat. Auch wenn du den Antrag erst später im Monat stellst. Für die Monate davor gibt es kein Geld.

*Fundstelle:* § 37 Abs. 2 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 4.1  
*Erscheint, wenn:* Grundsicherungsgeld möglich

**20. Grundsicherung für 12 Monate** · Gut zu wissen · `geprueft` · `a_bewilligung`

Grundsicherung gibt es meist für 12 Monate. Schwankt der Lohn oder ist die Miete zu hoch, sind es oft 6 Monate. Danach musst du sie neu beantragen. Das Jobcenter nennt das Weiterbewilligungsantrag.

*Leichte Sprache:* Die Grund-Sicherung gibt es meistens für 12 Monate. Manchmal nur für 6 Monate. Danach musst du einen neuen Antrag stellen.

*Fundstelle:* § 41 Abs. 3 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 8.9.3  
*Erscheint, wenn:* Grundsicherungsgeld möglich

**21. Änderungen melden** · Pflicht · `geprueft` · `a_aenderungen`

Jede Änderung, die das Geld beeinflussen kann, musst du dem Jobcenter sofort melden. Zum Beispiel eine neue Arbeit, mehr Lohn oder einen Umzug. Das gilt auch für Änderungen bei den anderen, deren Geld mitzählt. Wurde zu viel gezahlt, kann das Jobcenter das Geld zurückfordern.

*Leichte Sprache:* Bei euch ändert sich etwas? Dann musst du das sofort dem Job-Center sagen. Zum Beispiel: Du hast eine neue Arbeit. Du verdienst mehr. Oder ihr zieht um. Das Job-Center hat euch zu viel Geld gezahlt? Dann kann es das Geld zurück-verlangen.

*Fundstelle:* § 60 Abs. 1 Nr. 2 SGB I; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 3.3 und 3.4  
*Erscheint, wenn:* Grundsicherungsgeld möglich

**22. Wessen Geld zählt** · Gut zu wissen · `geprueft` · `a_einkommen_zaehlt`

In der Grundsicherung zählt das Geld von allen in der Bedarfsgemeinschaft. Das sind die Eltern und die Kinder unter 25 Jahren im Haushalt. Auch das Kindergeld und Unterhalt zählen mit.

*Leichte Sprache:* Bei der Grund-Sicherung wird das Geld von allen zusammen gerechnet. Von den Erwachsenen. Und von den Kindern unter 25 Jahren. Auch das Kinder-Geld zählt mit.

*Fundstelle:* § 7 Abs. 3, § 9 Abs. 2, § 11 Abs. 1 Satz 5 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 8.2  
*Erscheint, wenn:* Grundsicherungsgeld möglich

**23. Zuständig: das Jobcenter** · Gut zu wissen · `geprueft` · `a_zustaendig`

Zuständig ist das Jobcenter an deinem Wohnort. Dort beantragst du Geld zum Leben und für die Wohnung. Das Jobcenter hilft auch bei der Suche nach Arbeit.

*Leichte Sprache:* Für die Grund-Sicherung ist das Job-Center zuständig. Es ist in deiner Stadt oder in deinem Land-Kreis.

*Fundstelle:* § 36 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 2 und 4  
*Erscheint, wenn:* immer

### Weg B: Kinderzuschlag und Wohngeld

**24. Keine Vorgaben zu Arbeit und Betreuung** · Gut zu wissen · `geprueft` · `b_arbeit_und_betreuung`

Für Kinderzuschlag und Wohngeld musst du keine Arbeit suchen. Feste Termine wie beim Jobcenter gibt es nicht. Wie viel ihr arbeitet und wer die Kinder betreut, entscheidet ihr selbst. Für den Kinderzuschlag braucht ihr aber genug eigenes Geld. Das prüft die Familienkasse bei jedem Antrag.

*Leichte Sprache:* Beim Kinder-Zuschlag und beim Wohn-Geld musst du keine Arbeit suchen. Du musst nicht regelmäßig zu Terminen gehen. Ihr entscheidet selbst: Wer arbeitet wie viel? Wer passt auf die Kinder auf? Für den Kinder-Zuschlag braucht ihr aber genug eigenes Geld.

*Fundstelle:* § 6a Abs. 1 Nr. 2 BKGG; Wohngeldgesetz; Merkblatt Kinderzuschlag der BA (Stand Juli 2026), Kap. 1.2 und 7 (nur Mitteilungspflichten); § 61 SGB I (persönliches Erscheinen nur auf Verlangen)  
*Erscheint, wenn:* (Kinderzuschlag > 0 oder Wohngeld > 0)

**25. Krankenversicherung klären** · Pflicht · `geprueft` · `b_krankenversicherung`

Kinderzuschlag und Wohngeld zahlen nicht für die Krankenkasse. Das ist wichtig, wenn du keinen Job hast oder nur einen Minijob. Mit Arbeitslosengeld oder Krankengeld bist du schon versichert. Bekommst du Elterngeld? Warst du davor pflichtversichert, zum Beispiel über den Job? Dann bleibst du meist in der Kasse und zahlst nichts. Bist du verheiratet? Dann kannst du oft über deinen Ehepartner oder deine Ehepartnerin mit in die Kasse. Das heißt Familienversicherung. Das geht auch in einer eingetragenen Lebenspartnerschaft. Sonst zahlst du den Beitrag selbst. Ohne Einkommen sind das nach den Regeln etwa {kv.mindestbeitrag} im Monat oder mehr. Frag am besten bei deiner Kasse nach. Dort erfährst du, was für dich gilt.

*Leichte Sprache:* Kinder-Zuschlag und Wohn-Geld zahlen nicht für die Kranken-Kasse. Du hast keine Arbeit? Oder du hast nur einen Mini-Job? Dann musst du dich selbst um die Kranken-Kasse kümmern. Du bekommst Arbeitslosen-Geld oder Kranken-Geld? Dann bist du schon versichert. Du bekommst Eltern-Geld? Und davor warst du über deine Arbeit versichert? Dann bleibst du meistens versichert. Du zahlst dafür nichts. Ihr seid verheiratet? Dann kannst du oft bei deinem Ehe-Partner oder deiner Ehe-Partnerin mit in die Kasse. Das geht auch in einer eingetragenen Lebens-Partnerschaft. Nichts davon passt? Dann musst du selbst für die Kranken-Kasse zahlen. Nach den Regeln sind das etwa {kv.mindestbeitrag} im Monat oder mehr. Frag bei der Kasse nach.

*Fundstelle:* § 5 Abs. 1 Nr. 2, § 10 Abs. 1, § 188 Abs. 4, § 192 Abs. 1 Nr. 2, § 224 Abs. 1 Satz 1, § 240 Abs. 4 Satz 1, § 242a, § 243 SGB V; § 55 Abs. 1 und 3, § 57 Abs. 4 SGB XI  
*Erscheint, wenn:* (Kinderzuschlag > 0 oder Wohngeld > 0) und Erwachsene mit Brutto höchstens an der Minijob-Grenze > 0

**26. Weniger Vergünstigungen** · Gut zu wissen · `geprueft` · `b_erweiterter_zugang_verguenstigungen`

Erweiterter Zugang heißt: Es gibt Kinderzuschlag, obwohl bis zur Grundsicherung noch Geld fehlt. Dann fallen ein paar Vorteile weg, die es mit Grundsicherung gibt. Ein Beispiel ist der Rundfunkbeitrag. Mit Grundsicherung kannst du dich davon befreien lassen. Mit diesem Kinderzuschlag geht das nicht.

*Leichte Sprache:* Nach den Regeln fehlt euch auch mit Kinder-Zuschlag noch etwas Geld. Ihr könnt den Kinder-Zuschlag trotzdem bekommen. Dann gibt es aber manche Vorteile nicht. Zum Beispiel: Mit Grund-Sicherung kannst du einen Antrag stellen. Dann musst du keinen Rund-Funk-Beitrag zahlen. Mit diesem Kinder-Zuschlag musst du ihn meistens zahlen.

*Fundstelle:* Merkblatt Kinderzuschlag der BA (Stand Juli 2026), Kap. 1.4; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 15; § 6a Abs. 1a BKGG  
*Erscheint, wenn:* Anspruch Kinderzuschlag = erweiterter_zugang und Kinderzuschlag > 0

**27. Wenn das Ersparte aufgebraucht ist** · Prüfung · `geprueft` · `b_erweiterter_zugang_erspartes`

Bei euren Angaben ist Kinderzuschlag nur möglich, weil euer Erspartes mitzählt. Nach den Regeln deckt der Teil über dem Freibetrag einen Teil der Lücke. Der Kinderzuschlag gilt dann fest für 6 Monate. Ist das Ersparte vorher aufgebraucht, kann wieder Geld fehlen. Dann kannst du zusätzlich Grundsicherung beantragen. Das geht auch während der 6 Monate. Dafür gelten dann die Regeln der Grundsicherung.

*Leichte Sprache:* Nach den Regeln zählt bei euch das Ersparte mit. Nur deshalb ist Kinder-Zuschlag möglich. Der Kinder-Zuschlag gilt dann für 6 Monate. Euer Erspartes ist vorher aufgebraucht? Dann fehlt euch vielleicht wieder Geld. Dann könnt ihr auch Grund-Sicherung beantragen. Das geht auch, wenn die 6 Monate noch laufen.

*Fundstelle:* § 6a Abs. 1a und Abs. 7 BKGG; DA-KiZ C.4.2 Abs. 2 und C.4.3 (Stand 20.02.2026)  
*Erscheint, wenn:* erweiterter Zugang nur dank Erspartem

*Notiz (intern):* offene-rechtsfragen.md Punkte 2 und 3. Dass Erspartes beim erweiterten Zugang mitzählt, folgt der DA-KiZ, nicht dem Wortlaut von § 6a Abs. 1a Nr. 1 BKGG.

**28. Den Rest aus dem Ersparten** · Prüfung · `geprueft` · `b_rest_aus_erspartem`

Auch mit Kinderzuschlag und Wohngeld fehlt bei euren Angaben noch etwas Geld. Grundsicherung gibt es trotzdem nicht. Euer Erspartes liegt über dem Freibetrag. Der Freibetrag ist der Teil, den ihr behalten dürft. Das fehlende Geld nehmt ihr nach den Regeln aus dem Ersparten.

*Leichte Sprache:* Nach den Regeln fehlt euch auch mit Kinder-Zuschlag und Wohn-Geld noch etwas Geld. Ihr habt aber mehr gespart, als ihr bei der Grund-Sicherung behalten dürft. Deshalb gibt es keine Grund-Sicherung. Das fehlende Geld nehmt ihr von eurem Ersparten.

*Fundstelle:* § 9 Abs. 1, § 12 SGB II; DA-KiZ C.4.1 (Stand 20.02.2026)  
*Erscheint, wenn:* Rest aus dem Ersparten

**29. Kinderzuschlag gilt 6 Monate** · Gut zu wissen · `geprueft` · `b_kiz_6_monate`

Den Kinderzuschlag gibt es meist für 6 Monate fest. Ändern sich in der Zeit Einkommen oder Miete, bleibt der Betrag gleich. Das musst du der Familienkasse nicht melden. Manches musst du der Familienkasse aber sofort melden. Zum Beispiel: Jemand zieht ein oder aus. Ein Kind wird geboren. Ihr zieht ins Ausland. Auch eine neue Adresse oder ein neues Konto meldest du. Diese Regeln gelten nur für den Kinderzuschlag. Beim Wohngeld musst du auch manche Änderungen bei Einkommen und Miete melden. Nach den 6 Monaten stellst du einen neuen Antrag. Oft reicht dann ein kürzerer Antrag, der Kurzantrag.

*Leichte Sprache:* Den Kinder-Zuschlag gibt es meistens für 6 Monate. Du verdienst in der Zeit mehr oder weniger? Dann bleibt der Kinder-Zuschlag gleich. Du musst das der Familien-Kasse nicht melden. Aber: Jemand zieht ein oder aus? Ein Kind wird geboren? Ihr zieht in ein anderes Land? Dann musst du das der Familien-Kasse sofort melden. Auch eine neue Adresse oder ein neues Konto musst du melden. Das gilt für den Kinder-Zuschlag. Beim Wohn-Geld gelten andere Regeln. Nach 6 Monaten stellst du einen neuen Antrag.

*Fundstelle:* § 6a Abs. 7 BKGG; § 60 Abs. 1 Satz 1 Nr. 2 SGB I; Merkblatt Kinderzuschlag der BA (Stand Juli 2026), Kap. 4, 6 und 7; Hinweise zum Kinderzuschlag, KiZ 1-H (Stand Juli 2026); für das Wohngeld § 27 Abs. 3 WoGG  
*Erscheint, wenn:* Kinderzuschlag > 0

**30. Kinderzuschlag erst ab dem Antrag** · Gut zu wissen · `geprueft` · `b_kiz_ab_antragsmonat`

Kinderzuschlag gibt es meist erst ab dem Monat, in dem du ihn beantragst. Für frühere Monate gibt es in der Regel nichts. Stell den Antrag deshalb früh. Fehlende Nachweise kannst du später nachreichen.

*Leichte Sprache:* Du stellst einen Antrag für den Kinder-Zuschlag. Ab diesem Monat gibt es meistens Geld. Für die Monate davor gibt es meistens nichts. Stell den Antrag deshalb schnell. Fehlende Papiere kannst du später schicken.

*Fundstelle:* § 5 Abs. 3, § 6a Abs. 7 Satz 2 BKGG (Ausnahme nach § 5 Abs. 3 Satz 2 BKGG i. V. m. § 28 SGB X); Merkblatt Kinderzuschlag der BA (Stand Juli 2026), Kap. 6  
*Erscheint, wenn:* Kinderzuschlag > 0

**31. Wohngeld gilt meist 12 Monate** · Gut zu wissen · `geprueft` · `b_wohngeld_12_monate`

Wohngeld gibt es meist ab dem Monat, in dem dein Antrag ankommt. Es wird meist für 12 Monate bewilligt, also genehmigt. Danach stellst du einen neuen Antrag.

*Leichte Sprache:* Wohn-Geld gibt es meistens ab dem Monat, in dem dein Antrag beim Amt ankommt. Meistens gibt es das Wohn-Geld dann für 12 Monate. Danach stellst du einen neuen Antrag.

*Fundstelle:* § 25 Abs. 1 bis 3 WoGG; Bayerisches Staatsministerium für Wohnen, Bau und Verkehr: Wohngeld (abgerufen 28.10.2026)  
*Erscheint, wenn:* Wohngeld > 0

**32. Änderungen beim Wohngeld melden** · Pflicht · `geprueft` · `b_wohngeld_aenderungen`

Beim Wohngeld musst du manche Änderungen sofort melden. Zum Beispiel, wenn euer Einkommen um mehr als 15 % steigt. Bei 2.000 € im Monat sind das mehr als 300 € im Monat. Oder wenn die Miete um mehr als 15 % sinkt. Oder wenn jemand auszieht oder Grundsicherung beantragt. Sinkt euer Einkommen um mehr als 10 %, kannst du mehr Wohngeld beantragen.

*Leichte Sprache:* Beim Wohn-Geld musst du manche Änderungen sofort melden. Zum Beispiel: Ihr verdient mehr als 15 Prozent mehr. Bei 2.000 € im Monat sind das mehr als 300 € mehr. Eure Miete wird viel kleiner. Jemand zieht aus. Jemand beantragt Grund-Sicherung. Ihr verdient viel weniger? Dann kannst du mehr Wohn-Geld beantragen.

*Fundstelle:* § 27 Abs. 1 und 3, § 28 Abs. 4 WoGG  
*Erscheint, wenn:* Wohngeld > 0

**33. Erspartes beim Kinderzuschlag** · Prüfung · `geprueft` · `b_erspartes_kiz`

Beim Kinderzuschlag zählt Erspartes erst ab einer Grenze. Bei euren Angaben liegt sie bei {kiz.vermoegensgrenze}. Habt ihr weniger als das, müsst ihr es nicht angeben.

*Leichte Sprache:* Beim Kinder-Zuschlag darfst du viel Erspartes haben. Nach den Regeln sind das bei euch bis zu {kiz.vermoegensgrenze}. Ihr habt weniger gespart? Dann müsst ihr das nicht angeben.

*Fundstelle:* § 6a Abs. 3 Satz 5 BKGG; Merkblatt Kinderzuschlag der BA (Stand Juli 2026), Kap. 3.2; Hinweise zum Kinderzuschlag, KiZ 1-H (Stand Juli 2026), Nr. 6  
*Erscheint, wenn:* Kinderzuschlag > 0

**34. Erspartes beim Wohngeld** · Prüfung · `pruefen` · `b_erspartes_wohngeld`

Beim Wohngeld gibt es eine Grenze für Erspartes. Bei euren Angaben liegt sie bei etwa {wohngeld.vermoegensgrenze}. Habt ihr mehr, gibt es meist kein Wohngeld.

*Leichte Sprache:* Beim Wohn-Geld gibt es eine Grenze für Erspartes. Nach den Regeln sind das bei euch etwa {wohngeld.vermoegensgrenze}. Ihr habt mehr gespart? Dann gibt es meistens kein Wohn-Geld.

*Fundstelle:* § 21 Nr. 3 WoGG; Wohngeld-Verwaltungsvorschrift Nr. 21.37 (nicht im Original gelesen)  
*Erscheint, wenn:* Wohngeld > 0

*Notiz (intern):* offene-rechtsfragen.md Punkt 14a. Grenze aus dem Parameter wohngeld.vermoegensgrenze.

**35. Keine Pflicht zum Umzug** · Gut zu wissen · `geprueft` · `b_wohnung`

Beim Wohngeld musst du nicht umziehen. Wohngeld ist ein Zuschuss zur Miete. Es rechnet nur mit einer Miete bis zu einem Höchstbetrag. Der hängt vom Ort und von der Zahl der Personen ab. Den Rest der Miete zahlt ihr selbst.

*Leichte Sprache:* Beim Wohn-Geld musst du nicht umziehen. Wohn-Geld ist ein Zuschuss. Das heißt: Ihr bekommt etwas Geld zur Miete dazu. Den Rest der Miete zahlt ihr selbst.

*Fundstelle:* § 1 Abs. 2, §§ 11 und 12 WoGG  
*Erscheint, wenn:* Wohngeld > 0

**36. Nachweise und Kontoauszüge** · Prüfung · `geprueft` · `b_kontoauszuege`

Für Kinderzuschlag und Wohngeld brauchst du vor allem Belege zu Lohn und Miete. Auch Kontoauszüge zählen als Beleg. Zum Beispiel für die Miete oder das Ersparte. Bei Ausgaben darfst du manchmal den Empfänger schwärzen, also unlesbar machen. Der Betrag muss lesbar bleiben. Geld, das auf dein Konto kommt, musst du zeigen.

*Leichte Sprache:* Für Kinder-Zuschlag und Wohn-Geld brauchst du vor allem deine Lohn-Zettel. Und Papiere zur Miete. Manchmal brauchst du auch Konto-Auszüge. Manches darfst du dort schwärzen. Das Geld, das du bekommst, musst du zeigen.

*Fundstelle:* Hinweise zum Kinderzuschlag, KiZ 1-H (Stand Juli 2026), Nr. 8 und Datenschutz; StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026  
*Erscheint, wenn:* (Kinderzuschlag > 0 oder Wohngeld > 0)

**37. Kinderzuschlag 2027: Änderung geplant** · Gut zu wissen · `geplant` · `b_kiz_2027`

Ab Januar 2027 soll sich der Kinderzuschlag ändern. Am {kiz.entwurfGeprueftAm} war das noch nicht beschlossen. An diesem Tag hat Gut Bescheid das geprüft. Nach dem Plan fallen 25 € Zuschlag je Kind im Monat weg. Wie hoch der Kinderzuschlag dann ist, stand noch nicht fest. Kommt die Änderung, gilt sie auch, wenn du ihn schon bekommst.

*Leichte Sprache:* Ab 2027 soll sich beim Kinder-Zuschlag etwas ändern. Das ist ein Plan. Am {kiz.entwurfGeprueftAm} war er noch nicht fest. So war es, als Gut Bescheid das geprüft hat. Vielleicht gibt es dann weniger Geld. Das kann auch sein, wenn du schon Geld bekommst.

*Fundstelle:* Regierungsentwurf Haushaltsbegleitgesetz 2027, BT-Drs. 21/7860, Art. 7 (nicht beschlossen, Stand 28.10.2026); § 6a Abs. 2 Satz 4 und Abs. 7 Satz 3 BKGG  
*Erscheint, wenn:* Kinderzuschlag > 0 und Stichtag ab 2026-08-01 und Stichtag vor 2027-01-01

*Notiz (intern):* Erscheint, wenn die Bewilligung ab dem Stichtag (6 Monate) ins Jahr 2027 reicht, also ab Stichtag 01.08.2026. Höchstbetrag 2027: offene-rechtsfragen.md Punkt 6.

**38. Kinderzuschlag ab 2027: Gesetz geplant** · Gut zu wissen · `geplant` · `b_kiz_ab_2027`

Ab 2027 rechnet Gut Bescheid beim Kinderzuschlag mit einem Plan für ein Gesetz. Nach dem Plan fallen 25 € Zuschlag je Kind im Monat weg. Am {kiz.entwurfGeprueftAm} war das noch nicht beschlossen. An diesem Tag hat Gut Bescheid das geprüft. Auch der neue Betrag stand da noch nicht fest. Er kann sich also noch ändern.

*Leichte Sprache:* Ab 2027 rechnet Gut Bescheid mit einem Plan. Der Plan ist für ein neues Gesetz zum Kinder-Zuschlag. Am {kiz.entwurfGeprueftAm} war es noch nicht fertig. So war es, als Gut Bescheid das geprüft hat. Der Betrag kann sich also noch ändern. Was gilt, steht dann im Bescheid.

*Fundstelle:* Regierungsentwurf Haushaltsbegleitgesetz 2027, BT-Drs. 21/7860, Art. 7 und 10 (nicht beschlossen, Stand 28.10.2026); § 6a Abs. 2 BKGG  
*Erscheint, wenn:* Kinderzuschlag > 0 und Stichtag ab 2027-01-01

*Notiz (intern):* Für Stichtage ab 01.01.2027 (Hinweis des rechts-pruefer vom 28.10.2026: die Fassung für 2026 passt dann nicht mehr). Höchstbetrag 2027/2028: offene-rechtsfragen.md Punkt 6. Text anpassen, sobald das Gesetz beschlossen ist.

**39. Wohngeld 2027: neues Gesetz geplant** · Gut zu wissen · `geplant` · `b_wohngeld_2027`

Ab Januar 2027 soll es neue Regeln für das Wohngeld geben. Am {wohngeld.entwurfGeprueftAm} war das Gesetz noch nicht beschlossen. An diesem Tag hat Gut Bescheid das geprüft. Nach dem Plan kann das Wohngeld für viele Haushalte sinken. Hast du schon Wohngeld, soll es gleich bleiben, bis die Zeit im Bescheid endet. Wird es vorher neu berechnet, sollen die neuen Regeln gelten.

*Leichte Sprache:* Ab 2027 soll es neue Regeln für das Wohn-Geld geben. Am {wohngeld.entwurfGeprueftAm} war das noch nicht fest. Gut Bescheid hat das an diesem Tag geprüft. Vielleicht gibt es dann weniger Wohn-Geld. Du bekommst schon Wohn-Geld? Dann soll es erst mal so bleiben. Ändert sich vorher etwas? Dann gelten vielleicht schon die neuen Regeln.

*Fundstelle:* Regierungsentwurf, BT-Drs. 21/8284, Abschnitte A und B, Art. 1 Nr. 25 (§ 42e Abs. 1 und 2 WoGG-E), nicht beschlossen (Stand 28.10.2026)  
*Erscheint, wenn:* Wohngeld > 0 und Stichtag ab 2026-02-01 und Stichtag vor 2027-01-01

*Notiz (intern):* Wohngeld wird meist für 12 Monate bewilligt. Ab Stichtag 01.02.2026 reicht die Bewilligung ins Jahr 2027, also bei jedem Stand von Gut Bescheid vor 2027. Ab Stichtag 01.01.2027 gilt b_wohngeld_ab_2027.

**40. Wohngeld ab 2027: Gesetz geplant** · Gut zu wissen · `geplant` · `b_wohngeld_ab_2027`

Ab 2027 rechnet Gut Bescheid beim Wohngeld mit einem Plan für ein Gesetz. Am {wohngeld.entwurfGeprueftAm} war das noch nicht beschlossen. An diesem Tag hat Gut Bescheid das geprüft. Der Betrag kann sich also noch ändern. Hattest du schon vorher Wohngeld? Dann soll es so bleiben, bis die Zeit im Bescheid endet. Wird es vorher neu berechnet, sollen die neuen Regeln gelten.

*Leichte Sprache:* Ab 2027 rechnet Gut Bescheid beim Wohn-Geld mit einem Plan. Er ist für ein neues Gesetz. Am {wohngeld.entwurfGeprueftAm} war das Gesetz noch nicht fertig. So war es, als Gut Bescheid das geprüft hat. Das Wohn-Geld kann sich also noch ändern.

*Fundstelle:* Regierungsentwurf, BT-Drs. 21/8284, Art. 1 Nr. 25 (§ 42e Abs. 1 WoGG-E), nicht beschlossen (Stand 28.10.2026)  
*Erscheint, wenn:* Wohngeld > 0 und Stichtag ab 2027-01-01

*Notiz (intern):* Für Stichtage ab 01.01.2027. Text anpassen, sobald das Gesetz beschlossen ist.

**41. Wessen Geld zählt** · Gut zu wissen · `geprueft` · `b_einkommen_zaehlt`

Beim Kinderzuschlag zählt das Einkommen der Eltern und der Kinder. Beim Wohngeld zählt das Einkommen aller, die zum Haushalt gehören.

*Leichte Sprache:* Beim Kinder-Zuschlag zählt das Geld von den Eltern und von den Kindern. Beim Wohn-Geld zählt das Geld von allen, die als Familie mit euch zusammen-leben.

*Fundstelle:* § 6a Abs. 3 bis 6 BKGG; §§ 5 und 13 Abs. 1 WoGG  
*Erscheint, wenn:* (Kinderzuschlag > 0 oder Wohngeld > 0)

**42. Wo du was beantragst** · Gut zu wissen · `geprueft` · `b_zustaendig`

Kinderzuschlag gibt es bei der Familienkasse. Wohngeld gibt es bei der Wohngeldstelle. In Bayern ist das meist das Landratsamt. In manchen Städten ist es die Stadt selbst. Dort beantragst du auch Bildung und Teilhabe. Welche Stelle für dich zuständig ist, zeigt das BayernPortal.

*Leichte Sprache:* Den Kinder-Zuschlag gibt die Familien-Kasse. Das Wohn-Geld gibt meistens das Land-Rats-Amt. In manchen Städten gibt es die Stadt selbst. Welches Amt das bei dir ist, steht im Bayern-Portal.

*Fundstelle:* §§ 9 und 13 BKGG; § 24 Abs. 1 WoGG; StMB Bayern: Wohngeld (abgerufen 28.10.2026); Art. 109a Abs. 1 AGSG  
*Erscheint, wenn:* (Kinderzuschlag > 0 oder Wohngeld > 0)

## Einordnung je Ergebnis

`einordnung_erspartes` · `geprueft`

Nach euren Angaben habt ihr mehr gespart, als ihr in der Grundsicherung behalten dürft. Deshalb gibt es sie nach den Regeln erst einmal nicht. Kinderzuschlag oder Wohngeld sind aber möglich.

*Leichte Sprache:* Nach den Regeln gibt es für euch erst mal keine Grund-Sicherung. Der Grund ist euer Erspartes. Aber ihr könnt Kinder-Zuschlag oder Wohn-Geld beantragen.

*Fundstelle:* § 9 Abs. 1, § 12 Abs. 2 SGB II; DA-KiZ C.4.1 (Stand 20.02.2026)  
*Erscheint, wenn:* Ergebnis = weg_b_deckt und Weg A wegen Erspartem ausgeschlossen

`einordnung_ohne_grundsicherung` · `geprueft`

Bei euren Angaben gibt es nach den Regeln kein Grundsicherungsgeld. Euer Geld liegt mit dem Kindergeld über dem, was die Grundsicherung zum Leben vorsieht. Möglich sind aber Kinderzuschlag oder Wohngeld. Die gibt es mit eigenem Antrag.

*Leichte Sprache:* Nach den Regeln gibt es für euch kein Grund-Sicherungs-Geld. Euer Geld liegt mit dem Kinder-Geld über dem, was die Grund-Sicherung zum Leben rechnet. Aber ihr könnt Kinder-Zuschlag oder Wohn-Geld beantragen.

*Fundstelle:* § 9 Abs. 1 SGB II; § 6a Abs. 1 BKGG; Wohngeldgesetz  
*Erscheint, wenn:* Ergebnis = weg_b_deckt und nicht Grundsicherungsgeld möglich

`einordnung_weg_b_deckt` · `geprueft`

Nach den Regeln reichen Kinderzuschlag und Wohngeld bei euren Angaben für den Bedarf. Der Bedarf ist der Betrag, den die Grundsicherung zum Leben vorsieht. Dann müsst ihr diese beiden zuerst beantragen. Grundsicherung gibt es dann meist nicht.

*Leichte Sprache:* Nach den Regeln reichen Kinder-Zuschlag und Wohn-Geld bei euch zum Leben. Darum gibt es meistens keine Grund-Sicherung. Diese beiden Anträge stellt ihr zuerst.

*Fundstelle:* § 12a Satz 1 und Satz 2 Nr. 2, § 5 Abs. 3 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 8.1.3  
*Erscheint, wenn:* Ergebnis = weg_b_deckt

`einordnung_erweiterter_zugang` · `geprueft`

Bei euren Angaben könnt ihr nach den Regeln wählen. Beide Wege sind ein Recht. Mit Weg B fehlt euch etwas zu dem, was die Grundsicherung zum Leben vorsieht. Das sind höchstens {kiz.erweiterterZugangHoechstens} im Monat. Dafür gibt es auf Weg B keine Pflicht zur Arbeitssuche.

*Leichte Sprache:* Nach den Regeln könnt ihr wählen. Beide Wege sind euer Recht. Bei Weg B fehlt euch etwas Geld. So rechnet die Grund-Sicherung. Es fehlen höchstens {kiz.erweiterterZugangHoechstens} im Monat. Bei Weg B müsst ihr aber keine Arbeit suchen.

*Fundstelle:* § 6a Abs. 1a BKGG; DA-KiZ C.4.2 (Stand 20.02.2026)  
*Erscheint, wenn:* Ergebnis = erweiterter_zugang

`einordnung_nur_weg_a_erspartes` · `geprueft`

Nach den Regeln reichen Kinderzuschlag und Wohngeld bei euren Angaben nicht. Grundsicherung gibt es erst, wenn ein Teil vom Ersparten verbraucht ist. Sie ist ein Recht, wenn die Bedingungen erfüllt sind. Verbindlich entscheidet das Jobcenter.

*Leichte Sprache:* Nach den Regeln reichen Kinder-Zuschlag und Wohn-Geld bei euch nicht. Ihr habt aber Erspartes. Einen Teil davon müsst ihr zuerst aufbrauchen. Danach kann es Grund-Sicherung geben. Das Job-Center entscheidet.

*Fundstelle:* § 9 Abs. 1, § 12 Abs. 2 SGB II; § 6a Abs. 1 Nr. 3 und Abs. 1a BKGG  
*Erscheint, wenn:* Ergebnis = nur_weg_a und Weg A erst nach Einsatz des Ersparten

*Notiz (intern):* Hinweis des rechts-pruefer vom 28.10.2026: nur_weg_a gibt es auch, wenn erst das Ersparte eingesetzt wird (vergleich.ts, nachEinsatzDesErsparten).

`einordnung_nur_weg_a` · `geprueft`

Mit Kinderzuschlag und Wohngeld würde euch bei euren Angaben Geld fehlen. Es fehlt zu dem Betrag, den die Grundsicherung zum Leben vorsieht. Nach den Regeln reicht nur die Grundsicherung. Sie ist ein Recht, wenn die Bedingungen erfüllt sind. Verbindlich entscheidet das Jobcenter.

*Leichte Sprache:* Nach den Regeln reichen Kinder-Zuschlag und Wohn-Geld bei euch nicht. Nur mit Grund-Sicherung reicht das Geld. Grund-Sicherung ist ein Recht. Das Job-Center entscheidet.

*Fundstelle:* § 6a Abs. 1 Nr. 3 und Abs. 1a BKGG; § 9 Abs. 1, § 19 SGB II  
*Erscheint, wenn:* Ergebnis = nur_weg_a

`einordnung_kein_anspruch` · `geprueft`

Bei euren Angaben gibt es nach den Regeln keinen Kinderzuschlag und kein Wohngeld. Es gibt auch kein Grundsicherungsgeld. Euer Geld oder Erspartes liegt über den Grenzen dafür.

*Leichte Sprache:* Nach den Regeln gibt es für euch gerade keinen Kinder-Zuschlag. Es gibt auch kein Wohn-Geld und keine Grund-Sicherung. Euer Geld oder Erspartes liegt über den Grenzen.

*Fundstelle:* § 9 Abs. 1, § 12 SGB II; § 6a Abs. 1 BKGG; §§ 19 und 21 WoGG  
*Erscheint, wenn:* Ergebnis = kein_anspruch

## Nächster Schritt

**Kinderzuschlag online beantragen** · Weg B: Kinderzuschlag und Wohngeld · `geprueft` · `kiz_und_wohngeld_online`

Stelle: Familienkasse der Bundesagentur für Arbeit · Weg: online mit KiZ Digital · Link: https://www.kiz-digital.de · Dauer: offen (`pruefen`)

Stell den Antrag online bei der Familienkasse. Das geht mit KiZ Digital. Hast du eine BundID, musst du nichts drucken. Die BundID ist ein Konto für Anträge bei Ämtern im Internet. Fehlende Nachweise kannst du später schicken. Wohngeld beantragst du getrennt bei der Wohngeldstelle. Das geht online über das BayernPortal. Beides gibt es meist erst ab dem Monat des Antrags.

*Leichte Sprache:* Stell den Antrag für den Kinder-Zuschlag im Internet. Das geht bei der Familien-Kasse. Die Seite heißt KiZ Digital. Fehlende Papiere kannst du später schicken. Den Antrag für das Wohn-Geld stellst du im Bayern-Portal. Beides gibt es meistens erst ab dem Monat, in dem du den Antrag stellst.

*Fundstelle:* § 5 Abs. 3, § 9 Abs. 1 BKGG; § 25 Abs. 2 WoGG; Merkblatt Kinderzuschlag der BA (Stand Juli 2026), Kap. 6; StMB Bayern: Wohngeld (abgerufen 28.10.2026)  
*Erscheint, wenn:* Ergebnis: weg_b_deckt oder erweiterter_zugang und Kinderzuschlag > 0 und Wohngeld > 0

*Notiz (intern):* Keine amtliche Angabe zur Dauer gefunden (Suche am 28.10.2026). Nico misst beim Test mit der Zielgruppe.

**Kinderzuschlag online beantragen** · Weg B: Kinderzuschlag und Wohngeld · `geprueft` · `kiz_online`

Stelle: Familienkasse der Bundesagentur für Arbeit · Weg: online mit KiZ Digital · Link: https://www.kiz-digital.de · Dauer: offen (`pruefen`)

Stell den Antrag online bei der Familienkasse. Das geht mit KiZ Digital. Hast du eine BundID, musst du nichts drucken. Die BundID ist ein Konto für Anträge bei Ämtern im Internet. Fehlende Nachweise kannst du später schicken. Geld gibt es meist erst ab dem Monat des Antrags.

*Leichte Sprache:* Stell den Antrag für den Kinder-Zuschlag im Internet. Das geht bei der Familien-Kasse. Die Seite heißt KiZ Digital. Fehlende Papiere kannst du später schicken. Geld gibt es meistens erst ab dem Monat, in dem du den Antrag stellst.

*Fundstelle:* § 5 Abs. 3, § 9 Abs. 1 BKGG; Merkblatt Kinderzuschlag der BA (Stand Juli 2026), Kap. 6  
*Erscheint, wenn:* Ergebnis: weg_b_deckt oder erweiterter_zugang und Kinderzuschlag > 0 und Wohngeld = 0

*Notiz (intern):* Keine amtliche Angabe zur Dauer gefunden (Suche am 28.10.2026).

**Wohngeld online beantragen** · Weg B: Kinderzuschlag und Wohngeld · `geprueft` · `wohngeld_online`

Stelle: Wohngeldstelle im Landratsamt, in manchen Städten bei der Stadt · Weg: online über das BayernPortal · Link: https://www.bayernportal.de/dokumente/onlineservice/41887779239 · Dauer: offen (`pruefen`)

Beantrage Wohngeld online über das BayernPortal. Wähle dort deinen Ort. Dann kommst du zu deiner Wohngeldstelle. Wohngeld gibt es meist ab dem Monat, in dem dein Antrag ankommt. Nachweise kannst du später nachreichen.

*Leichte Sprache:* Stell den Antrag für das Wohn-Geld im Internet. Die Seite heißt Bayern-Portal. Dort wählst du deinen Wohn-Ort. Wohn-Geld gibt es meistens ab dem Monat, in dem dein Antrag ankommt. Fehlende Papiere kannst du später schicken.

*Fundstelle:* § 22 Abs. 1, § 25 Abs. 2 WoGG; Bayerisches Staatsministerium für Wohnen, Bau und Verkehr: Wohngeld (abgerufen 28.10.2026)  
*Erscheint, wenn:* Ergebnis: weg_b_deckt oder erweiterter_zugang und Kinderzuschlag = 0 und Wohngeld > 0

*Notiz (intern):* Keine amtliche Angabe zur Dauer gefunden (Suche am 28.10.2026).

**Grundsicherung online beantragen** · Weg A: Grundsicherung · `geprueft` · `grundsicherung_online`

Stelle: Jobcenter an deinem Wohnort · Weg: online über jobcenter.digital · Link: https://www.jobcenter.digital · Dauer: offen (`pruefen`)

Stell den Antrag am besten online über jobcenter.digital. Es geht auch vor Ort, per Telefon oder per Brief. Geld gibt es ab dem Ersten des Monats, in dem du den Antrag stellst. Nachweise kannst du später schicken. Danach lädt dich das Jobcenter zu einem Gespräch ein.

*Leichte Sprache:* Stell den Antrag für die Grund-Sicherung im Internet. Die Seite heißt jobcenter.digital. Du kannst auch zum Job-Center gehen. Oder anrufen. Das Geld gibt es für den ganzen Monat, in dem du den Antrag stellst. Fehlende Papiere kannst du später schicken. Danach lädt dich das Job-Center zu einem Gespräch ein.

*Fundstelle:* § 37 Abs. 2, § 15 Abs. 4 SGB II; Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 2.3 und 4.3; BA: Grundsicherungsgeld – Antrag und Bescheid (abgerufen 28.10.2026)  
*Erscheint, wenn:* (Ergebnis: nur_weg_a oder erweiterter_zugang oder Ergebnis = kein_anspruch und Betrag Weg A > 0)

*Notiz (intern):* Keine amtliche Angabe zur Dauer gefunden (Suche am 28.10.2026). Auch für den Randfall „kein Anspruch, nur Sofortzuschlag“ (Hinweis des rechts-pruefer vom 28.10.2026).

**Nach den Regeln gerade kein Geld** · Beide Wege · `geprueft` · `kein_antrag`

Stelle: – · Weg: – · Link: – · Dauer: –

Nach den Regeln gibt es bei euren Angaben auf keinem der beiden Wege Geld. Einen Antrag stellen darfst du trotzdem. Verbindlich entscheidet die Behörde. Ändern sich Einkommen, Miete oder Familie, mach den Check noch einmal.

*Leichte Sprache:* Nach den Regeln gibt es für euch gerade kein Geld. Ihr dürft trotzdem einen Antrag stellen. Das Amt entscheidet. Bei euch ändert sich etwas? Zum Beispiel beim Geld, bei der Miete oder in der Familie? Dann macht den Check noch einmal.

*Fundstelle:* § 9 Abs. 1 SGB II; § 6a Abs. 1 BKGG; § 21 WoGG  
*Erscheint, wenn:* Ergebnis = kein_anspruch und Betrag Weg A = 0

## Unterlagen

### Weg A: Grundsicherung

- **Personalausweis oder Reisepass mit Meldebescheinigung (Nachweis, wo du wohnst) oder Aufenthaltstitel** (Grundsicherung) · `geprueft` · `sgb2_ausweis` · wenn: Betrag Weg A > 0 · *BA: Grundsicherungsgeld – Antrag und Bescheid, Beispiele für wichtige Nachweise (abgerufen 28.10.2026); Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 2.2*
- **Kontoauszüge der letzten 3 Monate von jedem Konto in der Familie** (Grundsicherung) · `geprueft` · `sgb2_kontoauszuege` · wenn: Betrag Weg A > 0 · *BA: Grundsicherungsgeld – Antrag und Bescheid, Beispiele für wichtige Nachweise (abgerufen 28.10.2026); Merkblatt Grundsicherung für Arbeitsuchende der BA (August 2026), Kap. 14*
- **Lohnbescheinigung** (Grundsicherung) · `geprueft` · `sgb2_lohn` · wenn: Betrag Weg A > 0 und Erwachsene mit Lohn > 0 · *BA: Grundsicherungsgeld – Antrag und Bescheid, Beispiele für wichtige Nachweise (abgerufen 28.10.2026)*
- **Mietvertrag** (Grundsicherung) · `geprueft` · `sgb2_mietvertrag` · wenn: Betrag Weg A > 0 · *BA: Grundsicherungsgeld – Antrag und Bescheid, Beispiele für wichtige Nachweise (abgerufen 28.10.2026)*
- **Letzte Abrechnung für Heizung und Nebenkosten** (Grundsicherung) · `geprueft` · `sgb2_nebenkosten` · wenn: Betrag Weg A > 0 · *BA: Grundsicherungsgeld – Antrag und Bescheid, Beispiele für wichtige Nachweise (abgerufen 28.10.2026)*
- **Belege, dass ihr die Miete zahlt, zum Beispiel Mietquittungen** (Grundsicherung) · `geprueft` · `sgb2_mietquittungen` · wenn: Betrag Weg A > 0 · *BA: Grundsicherungsgeld – Antrag und Bescheid, Beispiele für wichtige Nachweise (abgerufen 28.10.2026)*
- **Belege für weitere Ausgaben, zum Beispiel Beiträge für Versicherungen** (Grundsicherung) · `geprueft` · `sgb2_ausgaben` · wenn: Betrag Weg A > 0 · *BA: Grundsicherungsgeld – Antrag und Bescheid, Beispiele für wichtige Nachweise (abgerufen 28.10.2026)*
- **Belege zum Ersparten, wenn das Jobcenter danach fragt** (Grundsicherung) · `geprueft` · `sgb2_vermoegen` · wenn: Betrag Weg A > 0 · *BA: Grundsicherungsgeld – Antrag und Bescheid, Beispiele für wichtige Nachweise, Hinweis zum Vermögen (abgerufen 28.10.2026)*

### Weg B: Kinderzuschlag und Wohngeld

- **Lohnabrechnungen der letzten 6 Monate vor dem Antrag** (Kinderzuschlag) · `geprueft` · `kiz_lohn` · wenn: Kinderzuschlag > 0 und Erwachsene mit Lohn > 0 · *Hinweise zum Kinderzuschlag, KiZ 1-H (Stand Juli 2026), Nr. 8*
- **Bescheide über anderes Geld vom Amt, zum Beispiel Unterhaltsvorschuss, und ein Beleg der Zahlung** (Kinderzuschlag) · `geprueft` · `kiz_bescheide` · wenn: Kinderzuschlag > 0 und (Kinder mit Unterhalt oder Unterhaltsvorschuss > 0 oder Erwachsene mit weiterem Einkommen > 0) · *Hinweise zum Kinderzuschlag, KiZ 1-H (Stand Juli 2026), Nr. 8*
- **Belege für Miete, Heizung und Nebenkosten im Monat des Antrags** (Kinderzuschlag) · `geprueft` · `kiz_wohnkosten` · wenn: Kinderzuschlag > 0 · *Hinweise zum Kinderzuschlag, KiZ 1-H (Stand Juli 2026), Nr. 5*
- **Fahrtkosten: Monatskarte oder beim Auto die Kilometer zur Arbeit und die Arbeitstage** (Kinderzuschlag) · `geprueft` · `kiz_fahrtkosten` · wenn: Kinderzuschlag > 0 und Erwachsene mit Lohn > 0 · *Hinweise zum Kinderzuschlag, KiZ 1-H (Stand Juli 2026), Nr. 8*
- **Belege über Beiträge für Pflichtversicherungen, zum Beispiel die Haftpflicht fürs Auto** (Kinderzuschlag) · `geprueft` · `kiz_versicherungen` · wenn: Kinderzuschlag > 0 · *Hinweise zum Kinderzuschlag, KiZ 1-H (Stand Juli 2026), Nr. 8*
- **Belege über Kosten für Kita oder Tagesmutter, ohne das Essensgeld** (Kinderzuschlag) · `geprueft` · `kiz_betreuungskosten` · wenn: Kinderzuschlag > 0 und Kinder mit Angabe „betreut“ > 0 · *Hinweise zum Kinderzuschlag, KiZ 1-H (Stand Juli 2026), Nr. 8*
- **Ohne deutsche, EU-, EWR- oder Schweizer Staatsangehörigkeit: Kopie des Aufenthaltstitels** (Kinderzuschlag) · `geprueft` · `kiz_aufenthaltstitel` · wenn: Kinderzuschlag > 0 · *Hinweise zum Kinderzuschlag, KiZ 1-H (Stand Juli 2026), Nr. 1, 2 und 4*
- **Mietvertrag** (Wohngeld) · `geprueft` · `wohngeld_mietvertrag` · wenn: Wohngeld > 0 · *StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026*
- **Letztes Mietänderungsschreiben oder eine Mietbescheinigung vom Vermieter oder von der Vermieterin** (Wohngeld) · `geprueft` · `wohngeld_mietbescheinigung` · wenn: Wohngeld > 0 · *StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026*
- **Beleg, dass ihr die Miete zahlt, zum Beispiel ein Kontoauszug** (Wohngeld) · `geprueft` · `wohngeld_mietzahlung` · wenn: Wohngeld > 0 · *StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026*
- **Verdienstbescheinigung vom Arbeitgeber und letzte Lohnabrechnung, oder die Lohnabrechnungen der letzten 12 Monate** (Wohngeld) · `geprueft` · `wohngeld_verdienst` · wenn: Wohngeld > 0 und Erwachsene mit Lohn > 0 · *StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026*
- **Aktuelle Bescheide über anderes Geld vom Amt, zum Beispiel Kinderzuschlag, Elterngeld oder Unterhaltsvorschuss** (Wohngeld) · `geprueft` · `wohngeld_bescheide` · wenn: Wohngeld > 0 und (Kinderzuschlag > 0 oder Erwachsene mit weiterem Einkommen > 0 oder Kinder mit Unterhalt oder Unterhaltsvorschuss > 0) · *StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026*
- **Belege über Unterhalt: Kontoauszüge oder ein Unterhaltstitel (Urteil oder Urkunde)** (Wohngeld) · `geprueft` · `wohngeld_unterhalt` · wenn: Wohngeld > 0 und Kinder mit Unterhalt oder Unterhaltsvorschuss > 0 · *StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026*
- **Beiträge zu Kranken-, Renten- und Pflegeversicherung, wenn sie nicht auf der Lohnabrechnung stehen** (Wohngeld) · `geprueft` · `wohngeld_versicherung` · wenn: Wohngeld > 0 · *StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026*
- **Belege zum Ersparten von allen im Haushalt, zum Beispiel Kontoauszüge oder ein Depotauszug** (Wohngeld) · `geprueft` · `wohngeld_vermoegen` · wenn: Wohngeld > 0 · *StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026*
- **Für Kinder ab 16 Jahren: aktuelle Schulbescheinigung** (Wohngeld) · `geprueft` · `wohngeld_schulbescheinigung` · wenn: Wohngeld > 0 und Alter des ältesten Kindes (Jahre) ab 16 · *StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026*
- **Wenn du keine Staatsangehörigkeit eines EU-Landes hast: Aufenthaltstitel, Fiktionsbescheinigung, Duldung oder Aufenthaltsgestattung** (Wohngeld) · `geprueft` · `wohngeld_aufenthaltstitel` · wenn: Wohngeld > 0 · *StMB: Nachweise zum Wohngeldantrag (Mietzuschuss), Stand 07/2026*
