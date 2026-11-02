/* Gut Bescheid – K2 „Fahrplan“, gemeinsamer Ablauf für beide Gestaltungsvarianten.
   Texte, Fälle und Logik 1:1 aus dem Export der Design-Fläche (K2-Klick.dc.html vom 01.11.2026, Herkunft in LIESMICH.md).
   Abweichungen auf Entscheidung vom 02.11.2026: Reihenfolge im Ergebnis und der Wegkarten, sichtbare Entwurfs-Marken.
   Nicht übernommen: der Startbildschirm K1 „Brief“ (K2 ist entschieden).
   Die Varianten liefern nur Gestaltung über window.K2_VARIANTE (Zeichen-Funktionen).

   URL-Parameter für Screenshots und Tests:
     fall=T01|T03|T04|KEIN|AUS   screen=leitung|start|ort|wer|kinder|ausserhalb|geld|angaben|ergebnis|folgen|antrag|warten
     theme=hell|dunkel   wahl=A|B   reiter=A|B   pflicht=<Karten-ID>   beleg=1   entwurf=1 (zeigt Entwurfs-Texte an) */
(function () {
  'use strict';
  const D = window.K2_DATEN;
  const V = Object.assign({
    marke: () => 'Gut Bescheid',
    leiste: (c) => c.leiste.map((l) => `<span class="lst ${l.zustand}">${l.name}</span>`).join(''),
    marker: () => '',
    segment: () => '',
    hier: (t) => `<span class="hier">${t}</span>`,
    wegZeichen: () => '',
    labelIcon: () => '',
    vorInhalt: () => '',
    deko: () => '',
    weiche: () => '',
    nachRender: () => {},
  }, window.K2_VARIANTE || {});

  const q = new URLSearchParams(location.search);
  const root = document.documentElement;
  if (q.get('theme')) root.dataset.theme = q.get('theme') === 'dunkel' ? 'dark' : 'light';
  if (q.get('entwurf') === '1') root.classList.add('zeige-entwurf');

  const st = {
    fall: D[q.get('fall')] ? q.get('fall') : 'T01',
    screen: q.get('screen') || 'leitung',
    verlauf: [], genau: 'genau', beleg: q.get('beleg') === '1',
    wahl: q.get('wahl'), reiter: q.get('reiter'), offenePflicht: q.get('pflicht'), erinnert: false,
  };

  const euro = (c) => Math.round(c / 100).toLocaleString('de-DE') + ' €'; // normales Leerzeichen wie im Export: darf bei Zoom umbrechen
  const RDG = 'So rechnet man nach den Regeln für 2026. Das gilt für Haushalte mit euren Angaben. Verbindlich ist nur der Bescheid. Das ist meist ein Brief mit der Entscheidung.';
  const DATENSCHUTZ = 'Deine Antworten verlassen dein Gerät nicht. Kein Konto, kein Name.';
  const ERINNERT = 'Die Erinnerung steht als Termin in deinem Kalender. Gut Bescheid selbst speichert nichts.';

  /* ---------- Werte je Zustand (entspricht renderVals der Quelle) ---------- */
  function ctx() {
    const d = D[st.fall]; const e = d.ein; const sc = st.screen; const art = d.art;
    const weg = art === 'weg_b_deckt' ? 'B' : art === 'nur_weg_a' ? 'A' : art === 'erweiterter_zugang' ? st.wahl : null;
    const idx = { ort: 0, wer: 0, kinder: 0, geld: 0, angaben: 0, ausserhalb: 0, ergebnis: 1, folgen: 1, antrag: 2, warten: 3 }[sc];
    const kurz = art === 'kein_anspruch' || art === 'ausserhalb';
    const namen = kurz ? ['Fragen', art === 'ausserhalb' ? 'Umsteigen' : 'Ergebnis'] : ['Fragen', 'Ergebnis', 'Antrag', 'Warten', 'Geld'];
    const leiste = namen.map((name, i) => ({ name, zustand: i < idx ? 'erledigt' : i === idx ? 'jetzt' : 'spaeter', ende: i === namen.length - 1 }));
    const wB = { key: 'B', weg: 'Weg B', name: d.kiz > 0 && d.wog > 0 ? 'Kinderzuschlag und Wohngeld' : d.wog > 0 ? 'nur Wohngeld' : d.kiz > 0 ? 'nur Kinderzuschlag' : 'Kinderzuschlag und Wohngeld', geld: (d.kiz + d.wog) > 0, betrag: euro((d.kiz || 0) + (d.wog || 0)) };
    const wA = { key: 'A', weg: 'Weg A', name: 'Grundsicherung', geld: d.a > 0, betrag: euro(d.a || 0) };
    // Feste Reihenfolge (Entscheidung 02.11.2026): Der Weg, der nach dem Regelwerk zuerst dran ist, steht links, mit Grund.
    // Ohne solche Reihenfolge (erweiterter Zugang, kein Anspruch) immer A links, B rechts.
    if (art === 'weg_b_deckt') wB.grund = 'zuerst beantragen';
    if (art === 'nur_weg_a') wA.grund = 'deckt euren Bedarf';
    let wege = art === 'weg_b_deckt' ? [wB, wA] : [wA, wB];
    if (art === 'erweiterter_zugang') wege = wege.map((w) => ({ ...w, an: st.wahl === w.key ? 'true' : 'false' }));
    const kopf = { weg_b_deckt: 'Kinderzuschlag und Wohngeld reichen für euch.', erweiterter_zugang: 'Ihr könnt zwischen zwei Wegen wählen.', nur_weg_a: 'Nur die Grundsicherung deckt euren Bedarf.', kein_anspruch: 'Gerade gibt es kein Geld jeden Monat.' }[art] || '';
    const k = d.karten || { beide: [], wegA: [], wegB: [] };
    const reihenfolge = (k.beide || []).find((x) => x.id === 'beide_reihenfolge') || { titel: '', text: '' };
    const kA = k.wegA || [];
    const wann = { a_erstgespraech: 'Nach dem Antrag', a_meldetermine: 'Immer wieder', a_arbeit: 'Die ganze Zeit' };
    const pflichtHalte = ['a_erstgespraech', 'a_meldetermine', 'a_arbeit'].map((id) => kA.find((x) => x.id === id)).filter(Boolean)
      .map((x) => ({ id: x.id, titel: x.titel, text: x.text, wann: wann[x.id], auf: st.offenePflicht === x.id }));
    const reiter = st.reiter || weg || (art === 'kein_anspruch' ? 'A' : 'B');
    const ordnung = { pflicht: 0, pruefung: 1, gut_zu_wissen: 2 };
    const karten = (reiter === 'A' ? kA : (k.wegB || [])).concat(k.beide || []).slice()
      .sort((x, y) => ordnung[x.art] - ordnung[y.art]);
    const schritt = (d.schritte && (d.schritte[weg] || d.schritte.X)) || { titel: '', text: '', stelle: '', kanal: '' };
    const unterlagen = (d.unterlagen && weg && d.unterlagen[weg]) || [];
    const haushalt = e ? { erwachsene: e.wer === 'allein' ? 1 : 2, kinder: e.kinder || [] } : null;
    return { d, e, sc, art, weg, idx, kurz, leiste, wege, kopf, reihenfolge, pflichtHalte, reiter, karten, schritt, unterlagen, haushalt,
      keinText: d.schritte && d.schritte.X ? d.schritte.X.text : '' };
  }

  /* ---------- Bausteine ---------- */
  const LABEL = { pflicht: 'Pflicht', pruefung: 'Wird geprüft', gut_zu_wissen: 'Gut zu wissen' };
  const label = (art) => `<span class="label ${art}">${V.labelIcon(art)}<span>${LABEL[art]}</span></span>`;
  const entwurf = ' data-entwurf';
  // Sichtbares Entwurfs-Zeichen für Dinge, die Regelwerk oder Rechtsprüfung noch nicht tragen (immer sichtbar).
  // Reine Textentwürfe bleiben unsichtbar markiert (data-entwurf, sichtbar mit ?entwurf=1).
  const ENTWURF = '<span class="entwurf-marke">Entwurf</span>';

  function strecke(halte) {
    return `<ol class="strecke">${halte.map((h, i) => {
      const letzte = i === halte.length - 1;
      const kind = h.ziel ? 'ziel' : h.art;
      const seg = letzte ? '' : `<span class="segment" aria-hidden="true">${V.segment(h.art === 'spaeter' ? 'offen' : 'fest', h)}</span>`;
      return `<li class="halt ${h.art}${h.ziel ? ' ziel' : ''}${letzte ? ' ende' : ''}">`
        + `<span class="halt-marke" aria-hidden="true">${V.marker(kind)}</span>${seg}`
        + (h.wann ? `<span class="wann">${h.wann}</span>` : '')
        + (h.was ? `<span class="was">${h.was}</span>` : '')
        + (h.text || '') + '</li>';
    }).join('')}</ol>`;
  }

  function wegKarte(w, alsKnopf, mitGrund) {
    const k = w.key.toLowerCase();
    const tag = alsKnopf ? 'button' : 'li';
    const attr = alsKnopf ? ` type="button" data-aktion="wahl" data-weg="${w.key}" aria-pressed="${w.an}"` : '';
    const grund = w.grund ? `<span class="weg-grund"${entwurf}>${w.grund}</span>` : mitGrund ? '<span class="weg-grund leer" aria-hidden="true"></span>' : '';
    // Beide Karten teilen ein Raster (CSS subgrid), damit Name, Betrag und „pro Monat“ auf einer Höhe stehen.
    const zeilen = (grund ? 1 : 0) + 2 + (alsKnopf ? 0 : w.geld ? 3 : 1);
    return `<${tag} class="weg ${k}${alsKnopf && w.an === 'true' ? ' an' : ''}" style="--zeilen: ${zeilen}"${attr}>${V.deko('weg-' + k)}${grund}`
      + `<span class="weg-kopf">${alsKnopf ? V.deko('gewaehlt') : ''}${V.wegZeichen(k)}<span>${w.weg}</span></span>`
      + `<span class="weg-name">${w.name}</span>`
      + (alsKnopf ? '' : w.geld ? `<span class="etwa">etwa</span><span class="betrag">${w.betrag}</span><span class="etwa">pro Monat</span>` : `<span class="betrag kein">kein Geld</span>`)
      + `</${tag}>`;
  }
  const ergebnisKarte = (c) => { const g = c.wege.some((w) => w.grund); return `<div class="ergebnis-karte">${V.deko('karte')}<ul class="wege">${c.wege.map((w) => wegKarte(w, false, g)).join('')}</ul><p class="rdg">${RDG}</p></div>`; };

  const btn = (text, aktion, extra = '') => `<button class="btn" type="button" data-aktion="${aktion}"${extra}>${text}</button>`;
  const btn2 = (text, aktion, extra = '') => `<button class="btn2" type="button" data-aktion="${aktion}"${extra}>${text}</button>`;

  /* ---------- Bildschirme ---------- */
  const SCREENS = {
    leitung(c) {
      return {
        inhalt: `<div class="tief"><p class="t fett">Für die Testleitung</p><p class="t">Diesen Bildschirm nicht zeigen. Haushalt und Start wählen, dann das Handy übergeben. Auf „Gut Bescheid“ oben tippen führt hierher zurück.</p></div>
          <p class="h2">Haushalt</p>
          <div class="wahlliste">${Object.values(D).map((f) => `<button type="button" class="${f.key === st.fall ? 'an' : ''}" aria-pressed="${f.key === st.fall}" data-aktion="fall" data-fall="${f.key}"><b>${f.label}</b><span class="leise">${{ weg_b_deckt: 'weg_b_deckt', erweiterter_zugang: 'erweiterter_zugang', nur_weg_a: 'nur_weg_a', kein_anspruch: 'kein_anspruch', ausserhalb: 'außerhalb des Umfangs' }[f.art]}</span></button>`).join('')}</div>
          <div class="tief"><p class="t fett">Nach fünf Sekunden fragen</p><p class="t">„Wer hat das gemacht? Eine Behörde?“ Antwort wörtlich notieren.</p></div>`,
        fuss: btn('Test starten', 'starten'),
      };
    },
    start() {
      return {
        inhalt: `<div class="start-kopf">${V.deko('himmel')}<h1 class="titel gross">Auch wenn ihr arbeitet, kann euch Geld zustehen.</h1>
          <p class="tg"${entwurf}>Gut Bescheid rechnet aus, was euch zusteht. Und zeigt den Weg bis zum ersten Geld.</p></div>`
          + strecke([
            { art: 'jetzt', wann: 'Heute', was: `<span>Rund 12 Fragen</span> ${V.hier('Hier startest du')}` },
            { art: 'normal', wann: 'Heute', was: 'Was euch zusteht und was daraus folgt' },
            { art: 'normal', wann: 'Danach', was: 'Anträge stellen' },
            { art: 'spaeter', wann: 'Danach', was: 'Auf den Bescheid warten' },
            { art: 'normal', ziel: true, wann: 'Ziel', was: 'Erstes Geld' },
          ]),
        fuss: `<p class="rdg">${DATENSCHUTZ}</p>${btn('Mit der ersten Frage anfangen', 'go', ' data-ziel="ort"')}`,
      };
    },
    ort(c) {
      return {
        inhalt: `<p class="wann">Wohnort · Frage 1 von rund 12</p>
          <h1 class="frage-kopf"><label class="frage" for="ort">Wo wohnt ihr?</label></h1>
          <input class="feld" id="ort" value="${c.e.ort}" autocomplete="off">
          <p class="t leise">Wohngeld hängt davon ab, wo ihr wohnt.</p>`,
        fuss: btn('Weiter zum Haushalt', 'go', ' data-ziel="wer"'),
      };
    },
    wer(c) {
      const an = (x) => (c.e.wer === x ? ' class="an" aria-pressed="true"' : ' aria-pressed="false"');
      return {
        inhalt: `<p class="wann">Haushalt · Frage 2 von rund 12</p>
          <h1 class="frage">Wie viele Erwachsene leben bei euch?</h1>
          <div class="zwei"><button type="button"${an('allein')}>${V.deko('gewaehlt')}Ich allein</button><button type="button"${an('zwei')}>${V.deko('gewaehlt')}Wir zu zweit</button></div>
          <p class="t leise">Gemeint sind alle, die bei euch wohnen und mit euch wirtschaften.</p>`,
        fuss: btn('Weiter zu den Kindern', 'go', ' data-ziel="kinder"'),
      };
    },
    kinder(c) {
      const an = (x) => (c.e.ausb === x ? ' class="an" aria-pressed="true"' : ' aria-pressed="false"');
      return {
        inhalt: `<p class="wann">Kinder · Frage 3 von rund 12</p>
          <h1 class="frage">Wie alt sind eure Kinder?</h1>
          <div class="chips">${c.e.kinder.map((j) => `<span class="chip">${j}${j === 1 ? ' Jahr' : ' Jahre'}</span>`).join('')}</div>
          <p class="h2 frage-klein">Bekommt ein Kind Geld aus einer Ausbildung?</p>
          <div class="zwei"><button type="button"${an(false)}>${V.deko('gewaehlt')}Nein</button><button type="button"${an(true)}>${V.deko('gewaehlt')}Ja</button></div>`,
        fuss: btn('Weiter zum Einkommen', 'nachKindern'),
      };
    },
    ausserhalb() {
      return {
        inhalt: `<h1 class="titel"${entwurf}>Für euch rechnet Gut Bescheid noch nicht genau.</h1>
          <p class="tg"${entwurf}>Ein Kind bekommt Geld aus einer Ausbildung. Diesen Fall rechnen wir noch nicht. Darum sagen wir es dir jetzt, nicht erst nach allen Fragen.</p>`
          + strecke([
            { art: 'erledigt', wann: 'Erledigt', was: '3 Fragen beantwortet' },
            { art: 'normal', ziel: true, wann: 'Ziel', was: 'Umsteigen: Beratung vor Ort', text: `<p class="halt-text"${entwurf}>Eine Beratungsstelle kann euren Fall genau rechnen. Nimm eine Lohnabrechnung und den Ausbildungsvertrag mit.</p>` },
          ]),
        fuss: btn('Beratungsstellen in Bayern ansehen', 'nichts') + btn2('Angabe zu den Kindern ändern', 'zurueck'),
      };
    },
    geld(c) {
      const genau = [['genau', 'Genau'], ['geschaetzt', 'Geschätzt'], ['weissnicht', 'Weiß ich nicht']];
      return {
        inhalt: `<p class="wann">Einkommen · Frage 4 von rund 12</p>
          <h1 class="frage-kopf"><label class="frage" for="brutto">Wie viel verdienst du in einem normalen Monat, vor Abzügen?</label></h1>
          <div class="feld feld-euro"><input id="brutto" inputmode="numeric" value="${c.e.brutto}" autocomplete="off"><span aria-hidden="true">€</span></div>
          <div class="wahl" role="group" aria-label="Wie genau ist der Betrag?">${genau.map(([id, txt]) => `<button type="button" class="${st.genau === id ? 'an' : ''}" aria-pressed="${st.genau === id}" data-aktion="genau" data-id="${id}">${V.deko('gewaehlt')}${txt}${id === 'weissnicht' ? ENTWURF : ''}</button>`).join('')}</div>
          <button class="link" type="button" data-aktion="beleg" aria-expanded="${st.beleg}">Wo finde ich das?</button>
          ${st.beleg ? `<div class="tief beleg-hilfe"><p class="t">Auf deiner Lohnabrechnung, als Gesamt-Brutto.</p>
            <div class="beleg"><span class="beleg-kopf">Lohnabrechnung · Muster</span><div class="zeile"><span>Gesamt-Brutto</span><span>2.400,00</span></div><div><span>Steuern und Abgaben</span><span>−650,00</span></div><div><span>Netto</span><span>1.750,00</span></div></div>
            <p class="rdg">Das ist ein Muster. Deine Abrechnung kann anders aussehen.</p></div>` : ''}
          <div class="hinweis-box">${V.deko('hinweis')}<p class="t"${entwurf}>Schwankt dein Lohn? Nimm den Durchschnitt der letzten 6 Monate.</p></div>`,
        fuss: btn('Weiter zum Netto', 'go', ' data-ziel="angaben"'),
      };
    },
    angaben(c) {
      const e = c.e;
      const zeilen = [['Wohnort', e.ort], ['Erwachsene', e.wer === 'allein' ? '1' : '2'], ['Kinder', e.kinder.join(' und ') + ' Jahre'], ['Brutto im Monat', e.brutto + ' €'], ['Netto im Monat', e.netto + ' €'], ['Kaltmiete', e.miete + ' €'], ['Nebenkosten', e.nk + ' €'], ['Heizung', e.heiz + ' €']]
        .concat(e.uv ? [['Unterhaltsvorschuss', e.uv + ' €']] : []).concat([['Erspartes', e.erspart]]);
      return {
        inhalt: `<h1 class="titel">Das habt ihr angegeben</h1>
          <div class="tief"><p class="t fett">Für den Test</p><p class="t">Die übrigen Fragen sind schon ausgefüllt.</p></div>
          <dl class="angaben">${zeilen.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
          <p class="rdg">Deine Antworten verlassen dein Gerät nicht. Gerechnet wird hier auf dem Handy.</p>`,
        fuss: btn('Ergebnis ansehen', 'go', ' data-ziel="ergebnis"'),
      };
    },
    ergebnis(c) {
      // Reihenfolge (02.11.2026): Kopfzeile, gleich danach Beträge mit RDG-Satz (ohne Scrollen sichtbar), dann Einordnung.
      const art = c.art;
      let h = `<h1 class="titel"${entwurf}>${c.kopf}</h1>`;
      const einordnung = `<p class="t einordnung">${c.d.einordnung}</p>`;
      if (art === 'kein_anspruch') {
        h += ergebnisKarte(c) + strecke([
          { art: 'erledigt', wann: 'Erledigt', was: 'Fragen beantwortet' },
          { art: 'normal', ziel: true, wann: 'Ziel', was: 'Gerade kein Geld jeden Monat', text: `<p class="halt-text">${c.keinText}</p>` },
        ]) + einordnung;
      }
      if (art === 'weg_b_deckt') {
        h += ergebnisKarte(c) + einordnung + `<div class="monate-block">
          <p class="t fett">Wenn die Anträge im November ankommen</p>
          <div class="monate"><span>Nov</span><span>Jan</span><span>Mär</span><span>Mai</span><span>Jul</span><span>Sep</span></div>
          <span class="spur-name">Kinderzuschlag</span>
          <div class="spur"><div class="balken" style="grid-column: 1 / span 6;">${V.deko('balken')}<span>6 Monate</span></div></div>
          <span class="spur-name">Wohngeld</span>
          <div class="spur"><div class="balken" style="grid-column: 1 / span 12;">${V.deko('balken')}<span>meist 12 Monate</span></div></div>
        </div>`;
      }
      if (art === 'erweiterter_zugang') {
        // Entscheidung 02.11.2026: Die Reihenfolge-Karte steht VOR der Wahl, weil sie vor der Wahl gelesen werden muss.
        // Die Wahlknöpfe tragen keine Beträge; die stehen mit dem RDG-Satz auf der Karte oben.
        h += ergebnisKarte(c) + einordnung
          + `<details class="folge" open><summary>${label('gut_zu_wissen')}<span class="folge-titel">${c.reihenfolge.titel}</span></summary><p class="folge-text">${c.reihenfolge.text}</p></details>`
          + `<div class="weiche"><h2 class="h2">Welchen Weg willst du gehen?</h2>${V.weiche()}
          <div class="gleise">${c.wege.map((w) => wegKarte(w, true)).join('')}</div></div>`;
      }
      if (art === 'nur_weg_a') {
        h += ergebnisKarte(c) + einordnung + `<h2 class="h2">Was auf diesem Weg dazugehört</h2>
          <p class="t"${entwurf}>Diese Pflichten kennst du schon vor dem Antrag. Tippe eine an, dann steht dort, was sie heißt.</p>`
          + strecke([{ art: 'normal', wann: 'Zuerst', was: 'Antrag stellen' }]
            .concat(c.pflichtHalte.map((p) => ({
              art: 'pflicht', wann: p.wann,
              was: `<button class="was-knopf" type="button" data-aktion="pflicht" data-id="${p.id}" aria-expanded="${p.auf}"><span>${p.titel}</span> ${label('pflicht')}</button>`,
              text: p.auf ? `<p class="halt-text">${p.text}</p>` : '',
            })))
            .concat([{ art: 'normal', ziel: true, wann: 'Ziel', was: 'Bescheid und erstes Geld' }]));
      }
      h += `<button class="link" type="button" data-aktion="go" data-ziel="folgen">Was das für euren Alltag heißt</button>`;
      let f = '';
      if (art === 'weg_b_deckt') f = btn('Anträge im November stellen', 'go', ' data-ziel="antrag"');
      if (art === 'nur_weg_a') f = btn('Grundsicherung im November beantragen', 'go', ' data-ziel="antrag"');
      if (art === 'erweiterter_zugang' && !st.wahl) f = '<p class="t mitte wahl-offen">Wähle oben einen Weg. Dann geht es weiter.</p>';
      if (art === 'erweiterter_zugang' && st.wahl === 'B') f = btn('Mit Weg B die Anträge stellen', 'go', ' data-ziel="antrag"');
      if (art === 'erweiterter_zugang' && st.wahl === 'A') f = btn('Mit Weg A den Antrag stellen', 'go', ' data-ziel="antrag"');
      if (art === 'kein_anspruch') f = st.erinnert ? `<p class="t erinnert"${entwurf}>${ERINNERT}</p>` : btn('In 6 Monaten erinnern', 'erinnern');
      return { inhalt: h, fuss: f };
    },
    folgen(c) {
      const r = c.reiter;
      return {
        inhalt: `<h1 class="titel">Was das für euren Alltag heißt</h1>
          <div class="reiter">${(c.art === 'weg_b_deckt' ? ['B', 'A'] : ['A', 'B']).map((w) => `<button type="button" class="${w.toLowerCase()}${r === w ? ' an' : ''}" aria-pressed="${r === w}" data-aktion="reiter" data-weg="${w}">${V.deko('gewaehlt')}${V.wegZeichen(w.toLowerCase())}Weg ${w}</button>`).join('')}</div>
          <p class="t leise">${r === 'A' ? 'Grundsicherung' : 'Kinderzuschlag und Wohngeld'}</p>
          ${c.karten.length === 0 ? '<p class="t">Für diesen Weg gibt es bei euren Angaben keine Folgen-Karten.</p>' : ''}
          <div class="folgen-liste">${c.karten.map((k) => `<details class="folge"${k.hervor ? ' open' : ''}><summary>${label(k.art)}<span class="folge-titel">${k.titel}</span></summary><p class="folge-text">${k.text}</p></details>`).join('')}</div>`,
        fuss: btn2('Zurück zum Ergebnis', 'zurueck'),
      };
    },
    antrag(c) {
      let h = '';
      if (c.weg === 'B') {
        h += `<h1 class="titel"${entwurf}>Zwei Anträge, beide im November</h1>
          <div class="stellen"><div class="stelle b">${V.wegZeichen('b')}<span class="wann">Kinderzuschlag</span><span class="was">${c.schritt.stelle}</span><span class="t">${c.schritt.kanal}</span></div>
          <div class="stelle b">${V.wegZeichen('b')}<span class="wann">Wohngeld</span><span class="was">Wohngeldstelle</span><span class="t">online über das BayernPortal</span></div></div>`;
      }
      if (c.weg === 'A') {
        h += `<h1 class="titel">${c.schritt.titel}</h1>
          <div class="stellen"><div class="stelle a">${V.wegZeichen('a')}<span class="wann">Grundsicherung</span><span class="was">${c.schritt.stelle}</span><span class="t">${c.schritt.kanal}</span></div></div>`;
      }
      h += `<p class="t">${c.schritt.text}</p><h2 class="h2">Das brauchst du</h2>`
        + c.unterlagen.map((u) => `<details class="folge"><summary><span class="folge-titel">${u.leistung}: ${u.n} Unterlagen</span></summary><ul class="liste">${u.items.map((x) => `<li>${x}</li>`).join('')}</ul></details>`).join('');
      return { inhalt: h, fuss: btn(c.weg === 'B' ? 'Ich habe die Anträge gestellt' : 'Ich habe den Antrag gestellt', 'go', ' data-ziel="warten"') };
    },
    warten(c) {
      const B = c.weg === 'B';
      const halte = [{ art: 'erledigt', wann: 'November', was: B ? 'Anträge gestellt' : 'Antrag gestellt', text: `<p class="halt-text">${B ? 'Beides gibt es meist erst ab dem Monat des Antrags.' : 'Geld gibt es ab dem Ersten des Monats, in dem du den Antrag stellst.'}</p>` }];
      if (c.weg === 'A') halte.push({ art: 'pflicht', wann: 'Danach', was: `<span>Gespräch im Jobcenter</span> ${label('pflicht')}`, text: '<p class="halt-text">Danach lädt dich das Jobcenter zu einem Gespräch ein.</p>' });
      halte.push(
        { art: 'jetzt', wann: 'Jetzt', was: `<span>Warten</span> ${V.hier('Hier bist du')}`, text: `<div class="stimme">${V.deko('stimme')}<p${entwurf}>Wie lange, sagt euch vorher niemand. Das liegt nicht an euch.</p></div>` },
        { art: 'hinweis', text: '<p class="halt-text hinweis-text">Fehlende Nachweise kannst du später schicken.</p>' },
        { art: 'spaeter', wann: `Nach 4 Wochen ohne Bescheid ${ENTWURF}`, text: `<div class="vorschuss"${entwurf}><p class="t fett">Vorschuss beantragen</p><p class="t">Das ist Geld vorab, das später verrechnet wird.</p></div>` },
        { art: 'normal', ziel: true, wann: 'Ziel', was: 'Bescheid und erstes Geld' },
      );
      return {
        inhalt: `<h1 class="titel">So geht euer Weg nach dem Antrag weiter</h1>` + strecke(halte),
        fuss: st.erinnert ? `<p class="t erinnert"${entwurf}>${ERINNERT}</p>` : btn('Nach 4 Wochen erinnern', 'erinnern'),
      };
    },
  };

  /* ---------- Ablauf ---------- */
  const app = document.getElementById('app');
  function go(screen) { st.verlauf.push(st.screen); st.screen = screen; st.erinnert = false; render(true); }
  const AKTIONEN = {
    go: (el) => go(el.dataset.ziel),
    zurueck: () => { const z = st.verlauf.pop() || 'leitung'; st.screen = z; st.reiter = null; render(true); },
    zurLeitung: () => { st.screen = 'leitung'; st.verlauf = []; render(true); },
    starten: () => { Object.assign(st, { screen: 'start', verlauf: [], wahl: null, reiter: null, offenePflicht: null, beleg: false, genau: 'genau', erinnert: false }); render(true); },
    fall: (el) => { Object.assign(st, { fall: el.dataset.fall, wahl: null, reiter: null, offenePflicht: null }); render(); },
    nachKindern: () => go(D[st.fall].art === 'ausserhalb' ? 'ausserhalb' : 'geld'),
    genau: (el) => { st.genau = el.dataset.id; render(); },
    beleg: () => { st.beleg = !st.beleg; render(); },
    wahl: (el) => { st.wahl = el.dataset.weg; render(); },
    reiter: (el) => { st.reiter = el.dataset.weg; render(); },
    pflicht: (el) => { st.offenePflicht = st.offenePflicht === el.dataset.id ? null : el.dataset.id; render(); },
    erinnern: () => { st.erinnert = true; render(); },
    nichts: () => {},
  };
  app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-aktion]');
    if (el && AKTIONEN[el.dataset.aktion]) AKTIONEN[el.dataset.aktion](el);
  });

  function render(neu) {
    const scroll = neu ? 0 : window.scrollY;
    const c = ctx();
    const s = SCREENS[st.screen](c);
    const zeigLeiste = !['leitung', 'start'].includes(st.screen);
    app.dataset.screen = st.screen;
    app.dataset.art = c.art;
    app.innerHTML = `<header class="bar">
        <button class="marke" type="button" data-aktion="zurLeitung" aria-label="Gut Bescheid">${V.marke()}</button>
        ${zeigLeiste ? '<button class="zurueck" type="button" data-aktion="zurueck">Zurück</button>' : '<span class="unab">Unabhängig, kein Amt</span>'}
      </header>
      ${zeigLeiste ? `<nav class="leiste${c.kurz ? ' kurz' : ''}" aria-label="Wo du stehst">${V.leiste(c)}</nav>` : ''}
      <main class="inhalt" id="inhalt">${V.vorInhalt(st.screen, c)}${s.inhalt}</main>
      <footer class="fuss">${s.fuss}</footer>`;
    window.scrollTo(0, scroll);
    fussBeobachter.disconnect();
    fussBeobachter.observe(app.querySelector('.fuss'));
    V.nachRender(app, c);
  }

  // Fokus nie hinter dem klebenden Fuß (WCAG 2.4.11): Abstand beim Scrollen = Fußhöhe + 16 px
  function fussAbstand() {
    const f = app.querySelector('.fuss'); if (!f) return;
    root.style.scrollPaddingBottom = getComputedStyle(f).position === 'sticky' ? (f.offsetHeight + 16) + 'px' : '0px';
  }
  const fussBeobachter = new ResizeObserver(fussAbstand);
  window.addEventListener('resize', fussAbstand);

  render(true);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { document.body.dataset.fertig = '1'; });
})();
