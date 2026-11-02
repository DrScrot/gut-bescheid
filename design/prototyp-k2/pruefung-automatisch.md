# Automatische Prüfung der K2-Prototypen

Stand: 2026-11-02. Erzeugt mit werkzeuge/pruefen.mjs. Kontrast nach WCAG 2.2 (Text ≥ 4,5 : 1, Bedienelemente und Grafik ≥ 3 : 1). Farbsehschwäche nach Machado 2009 (Stärke 1), Abstand ΔE2000.

## Variante 1 „Skizze“

### hell: Kontrast der Token-Paare

| Vordergrund | Hintergrund | Werte | Kontrast | Soll | |
|---|---|---|---|---|---|
| text | seite | #1C2340 auf #FCFCFA | 14.99 : 1 | Text 4,5 | ok |
| text | flaeche | #1C2340 auf #FFFFFF | 15.40 : 1 | Text 4,5 | ok |
| text | tief | #1C2340 auf #EEF0F6 | 13.51 : 1 | Text 4,5 | ok |
| text-leise | seite | #4A5170 auf #FCFCFA | 7.57 : 1 | Text 4,5 | ok |
| text-leise | tief | #4A5170 auf #EEF0F6 | 6.82 : 1 | Text 4,5 | ok |
| handschrift | seite | #1E2A55 auf #FCFCFA | 13.47 : 1 | Text 4,5 | ok |
| handschrift | h-stift | #1E2A55 auf #CFDDF7 | 10.11 : 1 | Text 4,5 | ok |
| text | h-stift | #1C2340 auf #CFDDF7 | 11.25 : 1 | Text 4,5 | ok |
| text-leise | h-stift | #4A5170 auf #CFDDF7 | 5.68 : 1 | Text 4,5 | ok |
| a | seite | #7A3F8D auf #FCFCFA | 6.99 : 1 | Text 4,5 | ok |
| b | seite | #745100 auf #FCFCFA | 7.00 : 1 | Text 4,5 | ok |
| a | a-stift | #7A3F8D auf #E8D7EF | 5.27 : 1 | Text 4,5 | ok |
| b | b-stift | #745100 auf #F0DDAE | 5.36 : 1 | Text 4,5 | ok |
| text | a-stift | #1C2340 auf #E8D7EF | 11.29 : 1 | Text 4,5 | ok |
| text | b-stift | #1C2340 auf #F0DDAE | 11.48 : 1 | Text 4,5 | ok |
| text | pflicht-flaeche | #1C2340 auf #E9EBF2 | 12.93 : 1 | Text 4,5 | ok |
| auf-handlung | handlung | #FFFFFF auf #1C2340 | 15.40 : 1 | Text 4,5 | ok |
| tinte | seite | #1C2340 auf #FCFCFA | 14.99 : 1 | Grafik 3 | ok |
| stift-leise | seite | #6E7592 auf #FCFCFA | 4.42 : 1 | Grafik 3 | ok |
| rand | flaeche | #6E7592 auf #FFFFFF | 4.54 : 1 | Grafik 3 | ok |
| rand | seite | #6E7592 auf #FCFCFA | 4.42 : 1 | Grafik 3 | ok |
| handlung | seite | #1C2340 auf #FCFCFA | 14.99 : 1 | Grafik 3 | ok |
| fokus | seite | #1E2A55 auf #FCFCFA | 13.47 : 1 | Grafik 3 | ok |
| fokus | flaeche | #1E2A55 auf #FFFFFF | 13.84 : 1 | Grafik 3 | ok |

### hell: Farbsehschwäche (ΔE2000; ab etwa 10 gut unterscheidbar)

| Paar | normal | Protan | Deutan | Tritan |
|---|---|---|---|---|
| Weg A ↔ Weg B | 49.5 | 46.9 | 44.9 | 10.7 |
| Weg A ↔ Handlung | 22.8 | 17.0 | 18.6 | 35.3 |
| Weg B ↔ Handlung | 41.7 | 40.9 | 43.6 | 38.6 |
| zum Vergleich R2: Weg A ↔ Weg B | 46.1 | 36.5 | 18.9 | 15.3 |

Gleiche Stärke der Wege: Weg A 6.99 : 1, Weg B 7.00 : 1 auf der Seite. Farbton (LCh): Weg A 320°, Weg B 80° (reines Rot etwa 40°, Magenta etwa 330°; R2 Weg A bei 359°).

### hell: axe-core, kleinste Schrift, kleinste Berührfläche

| Bildschirm | axe-Verstöße | kleinste Schrift | kleinste Berührfläche | Fokus hinter dem Fuß (2.4.11) | RDG-Satz ohne Scrollen |
|---|---|---|---|---|---|
| start | keine | 15 px („Unabhängig, kein Amt“) | 48 px („Gut Bescheid“) | keins von 2 | – |
| geldfrage | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 8 | – |
| ergebnis T01 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | ja (Unterkante 632 px, sichtbar bis 748 px) |
| ergebnis T04 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 7 | ja (Unterkante 577 px, sichtbar bis 734 px) |
| ergebnis kein | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | ja (Unterkante 478 px, sichtbar bis 748 px) |
| ergebnis T03 Wahl | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 6 | ja (Unterkante 527 px, sichtbar bis 750 px) |
| folgen T04 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 22 | – |
| antrag T01 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 5 | – |
| warten T01 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 3 | – |
| warten T04 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 3 | – |
| außerhalb | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | – |
| leitung | keine | 15 px („Unabhängig, kein Amt“) | 48 px („Gut Bescheid“) | keins von 7 | – |

### dunkel: Kontrast der Token-Paare

| Vordergrund | Hintergrund | Werte | Kontrast | Soll | |
|---|---|---|---|---|---|
| text | seite | #EEF0F8 auf #141826 | 15.53 : 1 | Text 4,5 | ok |
| text | flaeche | #EEF0F8 auf #1B2033 | 14.19 : 1 | Text 4,5 | ok |
| text | tief | #EEF0F8 auf #222842 | 12.73 : 1 | Text 4,5 | ok |
| text-leise | seite | #B7BCD3 auf #141826 | 9.38 : 1 | Text 4,5 | ok |
| text-leise | tief | #B7BCD3 auf #222842 | 7.69 : 1 | Text 4,5 | ok |
| handschrift | seite | #E6EAFF auf #141826 | 14.79 : 1 | Text 4,5 | ok |
| handschrift | h-stift | #E6EAFF auf #263457 | 10.27 : 1 | Text 4,5 | ok |
| text | h-stift | #EEF0F8 auf #263457 | 10.78 : 1 | Text 4,5 | ok |
| text-leise | h-stift | #B7BCD3 auf #263457 | 6.51 : 1 | Text 4,5 | ok |
| a | seite | #DAAAEC auf #141826 | 9.21 : 1 | Text 4,5 | ok |
| b | seite | #E1B54F auf #141826 | 9.19 : 1 | Text 4,5 | ok |
| a | a-stift | #DAAAEC auf #4B3A5C | 5.31 : 1 | Text 4,5 | ok |
| b | b-stift | #E1B54F auf #4A3D1E | 5.52 : 1 | Text 4,5 | ok |
| text | a-stift | #EEF0F8 auf #4B3A5C | 8.96 : 1 | Text 4,5 | ok |
| text | b-stift | #EEF0F8 auf #4A3D1E | 9.33 : 1 | Text 4,5 | ok |
| text | pflicht-flaeche | #EEF0F8 auf #262C45 | 12.07 : 1 | Text 4,5 | ok |
| auf-handlung | handlung | #141826 auf #EEF0F8 | 15.53 : 1 | Text 4,5 | ok |
| tinte | seite | #E4E7F5 auf #141826 | 14.35 : 1 | Grafik 3 | ok |
| stift-leise | seite | #8E95AF auf #141826 | 5.95 : 1 | Grafik 3 | ok |
| rand | flaeche | #8E95AF auf #1B2033 | 5.43 : 1 | Grafik 3 | ok |
| rand | seite | #8E95AF auf #141826 | 5.95 : 1 | Grafik 3 | ok |
| handlung | seite | #EEF0F8 auf #141826 | 15.53 : 1 | Grafik 3 | ok |
| fokus | seite | #E6EAFF auf #141826 | 14.79 : 1 | Grafik 3 | ok |
| fokus | flaeche | #E6EAFF auf #1B2033 | 13.51 : 1 | Grafik 3 | ok |

### dunkel: Farbsehschwäche (ΔE2000; ab etwa 10 gut unterscheidbar)

| Paar | normal | Protan | Deutan | Tritan |
|---|---|---|---|---|
| Weg A ↔ Weg B | 50.8 | 47.7 | 44.9 | 12.3 |
| Weg A ↔ Handlung | 23.0 | 19.8 | 17.3 | 22.4 |
| Weg B ↔ Handlung | 31.9 | 33.3 | 31.8 | 25.9 |
| zum Vergleich R2: Weg A ↔ Weg B | 47.0 | 38.7 | 29.3 | 8.4 |

Gleiche Stärke der Wege: Weg A 9.21 : 1, Weg B 9.19 : 1 auf der Seite. Farbton (LCh): Weg A 318°, Weg B 85° (reines Rot etwa 40°, Magenta etwa 330°; R2 Weg A bei 350°).

### dunkel: axe-core, kleinste Schrift, kleinste Berührfläche

| Bildschirm | axe-Verstöße | kleinste Schrift | kleinste Berührfläche | Fokus hinter dem Fuß (2.4.11) | RDG-Satz ohne Scrollen |
|---|---|---|---|---|---|
| start | keine | 15 px („Unabhängig, kein Amt“) | 48 px („Gut Bescheid“) | keins von 2 | – |
| geldfrage | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 8 | – |
| ergebnis T01 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | ja (Unterkante 632 px, sichtbar bis 748 px) |
| ergebnis T04 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 7 | ja (Unterkante 577 px, sichtbar bis 734 px) |
| ergebnis kein | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | ja (Unterkante 478 px, sichtbar bis 748 px) |
| ergebnis T03 Wahl | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 6 | ja (Unterkante 527 px, sichtbar bis 750 px) |
| folgen T04 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 22 | – |
| antrag T01 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 5 | – |
| warten T01 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 3 | – |
| warten T04 | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 3 | – |
| außerhalb | keine | 14 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | – |
| leitung | keine | 15 px („Unabhängig, kein Amt“) | 48 px („Gut Bescheid“) | keins von 7 | – |

## Variante 2 „Haltestelle“

### hell: Kontrast der Token-Paare

| Vordergrund | Hintergrund | Werte | Kontrast | Soll | |
|---|---|---|---|---|---|
| text | seite | #2A1A2F auf #F8F4F7 | 14.97 : 1 | Text 4,5 | ok |
| text | flaeche | #2A1A2F auf #FFFFFF | 16.31 : 1 | Text 4,5 | ok |
| text | tief | #2A1A2F auf #EFE6EE | 13.38 : 1 | Text 4,5 | ok |
| text-leise | seite | #5E4A63 auf #F8F4F7 | 7.31 : 1 | Text 4,5 | ok |
| text-leise | flaeche | #5E4A63 auf #FFFFFF | 7.97 : 1 | Text 4,5 | ok |
| text-leise | tief | #5E4A63 auf #EFE6EE | 6.53 : 1 | Text 4,5 | ok |
| band-text | band | #F7ECF5 auf #3B2142 | 12.33 : 1 | Text 4,5 | ok |
| band-leise | band | #D5C0D9 auf #3B2142 | 8.35 : 1 | Text 4,5 | ok |
| band-text | licht | #F7ECF5 auf #4D2C57 | 10.08 : 1 | Text 4,5 | ok |
| a | seite | #0E6673 auf #F8F4F7 | 6.09 : 1 | Text 4,5 | ok |
| b | seite | #7D5500 auf #F8F4F7 | 6.08 : 1 | Text 4,5 | ok |
| a | a-flaeche | #0E6673 auf #DDEEF0 | 5.55 : 1 | Text 4,5 | ok |
| b | b-flaeche | #7D5500 auf #F7EBD2 | 5.60 : 1 | Text 4,5 | ok |
| text | a-flaeche | #2A1A2F auf #DDEEF0 | 13.64 : 1 | Text 4,5 | ok |
| text | b-flaeche | #2A1A2F auf #F7EBD2 | 13.80 : 1 | Text 4,5 | ok |
| text | pflicht-flaeche | #2A1A2F auf #ECDFEE | 12.71 : 1 | Text 4,5 | ok |
| #2A1A2F | honig | #2A1A2F auf #F2B84B | 9.11 : 1 | Text 4,5 | ok |
| auf-handlung | handlung | #FFFFFF auf #3B2142 | 14.17 : 1 | Text 4,5 | ok |
| text | flaeche | #2A1A2F auf #FFFFFF | 16.31 : 1 | Text 4,5 | ok |
| linie | seite | #3B2142 auf #F8F4F7 | 13.00 : 1 | Grafik 3 | ok |
| linie-leise | seite | #85718A auf #F8F4F7 | 4.08 : 1 | Grafik 3 | ok |
| rand | flaeche | #85718A auf #FFFFFF | 4.44 : 1 | Grafik 3 | ok |
| rand | seite | #85718A auf #F8F4F7 | 4.08 : 1 | Grafik 3 | ok |
| handlung | seite | #3B2142 auf #F8F4F7 | 13.00 : 1 | Grafik 3 | ok |
| fokus | seite | #3B2142 auf #F8F4F7 | 13.00 : 1 | Grafik 3 | ok |
| band-text | band | #F7ECF5 auf #3B2142 | 12.33 : 1 | Grafik 3 | ok |
| band-linie | band | #D9BCE0 auf #3B2142 | 8.24 : 1 | Grafik 3 | ok |
| band-leise | band | #D5C0D9 auf #3B2142 | 8.35 : 1 | Grafik 3 | ok |
| honig | band | #F2B84B auf #3B2142 | 7.92 : 1 | Grafik 3 | ok |
| b | b-flaeche | #7D5500 auf #F7EBD2 | 5.60 : 1 | Grafik 3 | ok |

### hell: Farbsehschwäche (ΔE2000; ab etwa 10 gut unterscheidbar)

| Paar | normal | Protan | Deutan | Tritan |
|---|---|---|---|---|
| Weg A ↔ Weg B | 37.6 | 33.4 | 37.9 | 43.1 |
| Weg A ↔ Handlung | 37.5 | 19.5 | 14.9 | 46.7 |
| Weg B ↔ Handlung | 43.2 | 41.1 | 40.6 | 20.3 |
| Weg A ↔ Strecke und Pflicht-Haltestelle | 37.5 | 19.5 | 14.9 | 46.7 |
| Weg B ↔ Strecke und Pflicht-Haltestelle | 43.2 | 41.1 | 40.6 | 20.3 |
| Weg A ↔ Licht (Hier bist du, Ziel) | 53.1 | 47.8 | 56.0 | 55.3 |
| Weg B ↔ Licht (Hier bist du, Ziel) | 35.1 | 36.0 | 34.6 | 34.4 |
| Fläche Weg A ↔ Fläche Weg B | 14.6 | 12.6 | 14.5 | 20.7 |
| Fläche Weg A ↔ Pflicht-Fläche | 16.3 | 4.5 | 2.0 | 17.5 |
| Fläche Weg B ↔ Pflicht-Fläche | 19.1 | 17.1 | 16.3 | 4.8 |
| zum Vergleich R2: Weg A ↔ Weg B | 46.1 | 36.5 | 18.9 | 15.3 |

Gleiche Stärke der Wege: Weg A 6.09 : 1, Weg B 6.08 : 1 auf der Seite. Farbton (LCh): Weg A 217°, Weg B 78° (reines Rot etwa 40°, Magenta etwa 330°; R2 Weg A bei 359°).

### hell: axe-core, kleinste Schrift, kleinste Berührfläche

| Bildschirm | axe-Verstöße | kleinste Schrift | kleinste Berührfläche | Fokus hinter dem Fuß (2.4.11) | RDG-Satz ohne Scrollen |
|---|---|---|---|---|---|
| start | keine | 16 px („Unabhängig, kein Amt“) | 48 px („Gut Bescheid“) | keins von 2 | – |
| geldfrage | keine | 14 px („Entwurf“) | 48 px („Gut Bescheid“) | keins von 8 | – |
| ergebnis T01 | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | ja (Unterkante 717 px, sichtbar bis 752 px) |
| ergebnis T04 | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 7 | ja (Unterkante 662 px, sichtbar bis 738 px) |
| ergebnis kein | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | ja (Unterkante 562 px, sichtbar bis 752 px) |
| ergebnis T03 Wahl | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 6 | ja (Unterkante 612 px, sichtbar bis 754 px) |
| folgen T04 | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 22 | – |
| antrag T01 | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 5 | – |
| warten T01 | keine | 14 px („Entwurf“) | 48 px („Gut Bescheid“) | keins von 3 | – |
| warten T04 | keine | 14 px („Entwurf“) | 48 px („Gut Bescheid“) | keins von 3 | – |
| außerhalb | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | – |
| leitung | keine | 16 px („Unabhängig, kein Amt“) | 48 px („Gut Bescheid“) | keins von 7 | – |

### dunkel: Kontrast der Token-Paare

| Vordergrund | Hintergrund | Werte | Kontrast | Soll | |
|---|---|---|---|---|---|
| text | seite | #F4EAF3 auf #17111B | 15.82 : 1 | Text 4,5 | ok |
| text | flaeche | #F4EAF3 auf #221A27 | 14.38 : 1 | Text 4,5 | ok |
| text | tief | #F4EAF3 auf #2B2131 | 13.12 : 1 | Text 4,5 | ok |
| text-leise | seite | #CDBBD0 auf #17111B | 10.26 : 1 | Text 4,5 | ok |
| text-leise | flaeche | #CDBBD0 auf #221A27 | 9.33 : 1 | Text 4,5 | ok |
| text-leise | tief | #CDBBD0 auf #2B2131 | 8.51 : 1 | Text 4,5 | ok |
| band-text | band | #F7ECF5 auf #301B37 | 13.66 : 1 | Text 4,5 | ok |
| band-leise | band | #CDB7D2 auf #301B37 | 8.45 : 1 | Text 4,5 | ok |
| band-text | licht | #F7ECF5 auf #45284F | 10.94 : 1 | Text 4,5 | ok |
| a | seite | #3EACC4 auf #17111B | 6.98 : 1 | Text 4,5 | ok |
| b | seite | #CA9624 auf #17111B | 6.98 : 1 | Text 4,5 | ok |
| a | a-flaeche | #3EACC4 auf #16303A | 5.21 : 1 | Text 4,5 | ok |
| b | b-flaeche | #CA9624 auf #33281A | 5.41 : 1 | Text 4,5 | ok |
| text | a-flaeche | #F4EAF3 auf #16303A | 11.80 : 1 | Text 4,5 | ok |
| text | b-flaeche | #F4EAF3 auf #33281A | 12.27 : 1 | Text 4,5 | ok |
| text | pflicht-flaeche | #F4EAF3 auf #382741 | 11.67 : 1 | Text 4,5 | ok |
| #2A1A2F | honig | #2A1A2F auf #F7D9C4 | 12.18 : 1 | Text 4,5 | ok |
| auf-handlung | handlung | #1E1323 auf #F6E2EE | 14.52 : 1 | Text 4,5 | ok |
| text | flaeche | #F4EAF3 auf #221A27 | 14.38 : 1 | Text 4,5 | ok |
| linie | seite | #EBC7D9 auf #17111B | 12.10 : 1 | Grafik 3 | ok |
| linie-leise | seite | #93809A auf #17111B | 5.12 : 1 | Grafik 3 | ok |
| rand | flaeche | #93809A auf #221A27 | 4.65 : 1 | Grafik 3 | ok |
| rand | seite | #93809A auf #17111B | 5.12 : 1 | Grafik 3 | ok |
| handlung | seite | #F6E2EE auf #17111B | 15.04 : 1 | Grafik 3 | ok |
| fokus | seite | #F6E2EE auf #17111B | 15.04 : 1 | Grafik 3 | ok |
| band-text | band | #F7ECF5 auf #301B37 | 13.66 : 1 | Grafik 3 | ok |
| band-linie | band | #C9A6D2 auf #301B37 | 7.38 : 1 | Grafik 3 | ok |
| band-leise | band | #CDB7D2 auf #301B37 | 8.45 : 1 | Grafik 3 | ok |
| honig | band | #F7D9C4 auf #301B37 | 11.72 : 1 | Grafik 3 | ok |
| b | b-flaeche | #CA9624 auf #33281A | 5.41 : 1 | Grafik 3 | ok |

### dunkel: Farbsehschwäche (ΔE2000; ab etwa 10 gut unterscheidbar)

| Paar | normal | Protan | Deutan | Tritan |
|---|---|---|---|---|
| Weg A ↔ Weg B | 44.0 | 42.3 | 45.9 | 49.8 |
| Weg A ↔ Handlung | 43.9 | 17.9 | 24.7 | 51.0 |
| Weg B ↔ Handlung | 38.2 | 38.0 | 33.8 | 24.5 |
| Weg A ↔ Strecke und Pflicht-Haltestelle | 46.5 | 12.4 | 20.8 | 55.1 |
| Weg B ↔ Strecke und Pflicht-Haltestelle | 39.1 | 37.1 | 31.8 | 17.7 |
| Weg A ↔ Licht (Hier bist du, Ziel) | 36.1 | 27.5 | 35.1 | 43.9 |
| Weg B ↔ Licht (Hier bist du, Ziel) | 24.9 | 26.4 | 23.2 | 19.4 |
| Fläche Weg A ↔ Fläche Weg B | 19.5 | 16.5 | 18.8 | 28.5 |
| Fläche Weg A ↔ Pflicht-Fläche | 22.4 | 4.7 | 1.8 | 28.5 |
| Fläche Weg B ↔ Pflicht-Fläche | 22.1 | 21.4 | 20.5 | 4.9 |
| zum Vergleich R2: Weg A ↔ Weg B | 47.0 | 38.7 | 29.3 | 8.4 |

Gleiche Stärke der Wege: Weg A 6.98 : 1, Weg B 6.98 : 1 auf der Seite. Farbton (LCh): Weg A 223°, Weg B 81° (reines Rot etwa 40°, Magenta etwa 330°; R2 Weg A bei 350°).

### dunkel: axe-core, kleinste Schrift, kleinste Berührfläche

| Bildschirm | axe-Verstöße | kleinste Schrift | kleinste Berührfläche | Fokus hinter dem Fuß (2.4.11) | RDG-Satz ohne Scrollen |
|---|---|---|---|---|---|
| start | keine | 16 px („Unabhängig, kein Amt“) | 48 px („Gut Bescheid“) | keins von 2 | – |
| geldfrage | keine | 14 px („Entwurf“) | 48 px („Gut Bescheid“) | keins von 8 | – |
| ergebnis T01 | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | ja (Unterkante 717 px, sichtbar bis 752 px) |
| ergebnis T04 | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 7 | ja (Unterkante 662 px, sichtbar bis 738 px) |
| ergebnis kein | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | ja (Unterkante 562 px, sichtbar bis 752 px) |
| ergebnis T03 Wahl | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 6 | ja (Unterkante 612 px, sichtbar bis 754 px) |
| folgen T04 | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 22 | – |
| antrag T01 | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 5 | – |
| warten T01 | keine | 14 px („Entwurf“) | 48 px („Gut Bescheid“) | keins von 3 | – |
| warten T04 | keine | 14 px („Entwurf“) | 48 px („Gut Bescheid“) | keins von 3 | – |
| außerhalb | keine | 15 px („Fragen“) | 48 px („Gut Bescheid“) | keins von 4 | – |
| leitung | keine | 16 px („Unabhängig, kein Amt“) | 48 px („Gut Bescheid“) | keins von 7 | – |

## RDG-Satz ohne Scrollen auf mehreren Größen

| Variante | Größe | T01 | T04 | kein Anspruch | T03 |
|---|---|---|---|---|---|
| skizze | 390 × 844 | ja | ja | ja | ja |
| skizze | 360 × 740 | **nein** (fehlen 20 px) | ja | ja | ja |
| skizze | 375 × 667 | **nein** (fehlen 60 px) | **nein** (fehlen 19 px) | ja | ja |
| skizze | 320 × 568 | **nein** (fehlen 285 px) | **nein** (fehlen 154 px) | **nein** (fehlen 81 px) | **nein** (fehlen 140 px) |
| haltestelle | 390 × 844 | ja | ja | ja | ja |
| haltestelle | 360 × 740 | ja | ja | ja | ja |
| haltestelle | 375 × 667 | ja | ja | ja | ja |
| haltestelle | 320 × 568 | **nein** (fehlen 125 px) | **nein** (fehlen 52 px) | **nein** (fehlen 16 px) | **nein** (fehlen 25 px) |
