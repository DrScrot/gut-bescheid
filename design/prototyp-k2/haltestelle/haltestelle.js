/* Variante 2 „Haltestelle“: Ihr seht euch selbst auf eurem Fahrplan.
   Die Figuren entstehen aus euren Angaben (Erwachsene, Alter der Kinder) und stehen an der
   Haltestelle, an der ihr gerade seid. Formen: einfache Holzfiguren, ohne Gesicht, ohne Geschlecht,
   in Farben der Palette statt Hautfarben. Alles von Hand gesetzte SVG-Formen. */
(function () {
  'use strict';
  const svg = (vb, inner, cls, extra = '') => `<svg class="${cls}" viewBox="${vb}" aria-hidden="true" focusable="false"${extra}>${inner}</svg>`;
  const r1 = (n) => Math.round(n * 10) / 10;
  const FRAGEN_MIT_ERWACHSENEN = ['wer', 'kinder', 'geld', 'angaben', 'ausserhalb', 'ergebnis', 'folgen', 'antrag', 'warten'];
  const FRAGEN_MIT_KINDERN = ['kinder', 'geld', 'angaben', 'ausserhalb', 'ergebnis', 'folgen', 'antrag', 'warten'];

  // Eine Figur: runder Kopf, Körper wie ein Holzkegel. h = Höhe stehend.
  function figur(x, boden, h, farbe, sitzt) {
    const kopf = h * 0.16;
    const breite = Math.max(9, h * 0.4);
    const koerper = sitzt ? h * 0.5 : h - kopf * 2 - h * 0.05;
    const oben = boden - koerper;
    const r = breite / 2;
    return `<g class="fig ${farbe}"><path d="M${r1(x - r)} ${r1(boden)}V${r1(oben + r)}A${r1(r)} ${r1(r)} 0 0 1 ${r1(x + r)} ${r1(oben + r)}V${r1(boden)}Z"/>`
      + `<circle cx="${r1(x)}" cy="${r1(oben - h * 0.05 - kopf)}" r="${r1(kopf)}"/></g>`;
  }
  function haushalt(c, screen) {
    if (!c.haushalt || !FRAGEN_MIT_ERWACHSENEN.includes(screen)) return [];
    const leute = Array.from({ length: c.haushalt.erwachsene }, () => 46);
    if (FRAGEN_MIT_KINDERN.includes(screen)) c.haushalt.kinder.forEach((j) => leute.push(Math.min(46, 22 + j * 1.6)));
    return leute;
  }
  // Gruppe an einer Haltestelle: Licht, Mast mit leuchtendem Schild, Figuren (stehend oder auf der Bank).
  function gruppe(x, boden, hoehen, sitzt, rand) {
    const farben = ['f1', 'f2', 'f3', 'f4', 'f5'];
    const breiten = hoehen.map((h) => Math.max(9, h * 0.4));
    const abstand = 5;
    const gesamt = breiten.reduce((a, b) => a + b, 0) + abstand * Math.max(0, hoehen.length - 1);
    let start = Math.min(Math.max(x - gesamt / 2, rand[0] + 26), rand[1] - gesamt - 8);
    const mast = hoehen.length ? start - 9 : x;
    let out = `<ellipse class="licht" cx="${r1(hoehen.length ? start + gesamt / 2 - 5 : x)}" cy="${boden - 32}" rx="${hoehen.length ? r1(Math.max(36, gesamt / 2 + 18)) : 30}" ry="38"/>`;
    out += `<path class="mast" d="M${r1(mast)} ${boden}V${boden - 54}"/><circle class="schild" cx="${r1(mast)}" cy="${boden - 59}" r="8.5"/>`;
    const bankY = boden - 15;
    if (sitzt && hoehen.length) out += `<path class="bank" d="M${r1(start - 4)} ${bankY}H${r1(start + gesamt + 4)}M${r1(start + 1)} ${bankY}V${boden}M${r1(start + gesamt - 1)} ${bankY}V${boden}"/>`;
    hoehen.forEach((h, i) => {
      const b = breiten[i];
      out += figur(start + b / 2, sitzt ? bankY - 1.5 : boden, h, farben[i % farben.length], sitzt);
      start += b + abstand;
    });
    return out;
  }

  const MARKER = {
    normal: svg('0 0 28 28', '<circle cx="14" cy="14" r="9" class="m-ring"/>', 'hs-m'),
    erledigt: svg('0 0 28 28', '<circle cx="14" cy="14" r="10.5" class="m-voll"/>', 'hs-m'),
    jetzt: svg('0 0 36 36', '<circle cx="18" cy="18" r="13" class="m-ring dick"/><circle cx="18" cy="18" r="8" class="m-licht"/>', 'hs-m jetzt'),
    spaeter: svg('0 0 28 28', '<circle cx="14" cy="14" r="9" class="m-ring leise"/>', 'hs-m'),
    pflicht: svg('0 0 28 28', '<rect x="5" y="5" width="18" height="18" rx="4.5" class="m-ring"/>', 'hs-m'),
    hinweis: svg('0 0 28 28', '<circle cx="14" cy="14" r="4" class="m-voll"/>', 'hs-m'),
    ziel: svg('0 0 32 32', '<rect x="4" y="4" width="24" height="24" rx="6" class="m-fenster"/><rect x="10" y="10" width="12" height="12" rx="2.5" class="m-licht"/>', 'hs-m ziel'),
  };

  window.K2_VARIANTE = {
    marke: () => 'Gut Bescheid',
    leiste(c) {
      const n = c.leiste.length;
      const kurz = c.kurz;
      const xs = c.leiste.map((_, i) => (kurz ? 60 + (270 * (i + 0.5)) / 2 : (390 * (i + 0.5)) / 5));
      const cur = Math.max(0, c.leiste.findIndex((l) => l.zustand === 'jetzt'));
      const boden = 88;
      let g = `<path class="linie" d="M${xs[0]} ${boden}H${xs[cur]}"/>`;
      if (cur < n - 1) g += `<path class="linie offen" d="M${xs[cur]} ${boden}H${xs[n - 1]}"/>`;
      c.leiste.forEach((l, i) => {
        if (i === cur) return;
        if (l.ende) g += `<rect x="${xs[i] - 8}" y="${boden - 8}" width="16" height="16" rx="3.5" class="${l.zustand === 'erledigt' ? 'stop-voll' : 'stop-ring'}"/>`;
        else g += `<circle cx="${xs[i]}" cy="${boden}" r="6.5" class="${l.zustand === 'erledigt' ? 'stop-voll' : 'stop-ring'}"/>`;
      });
      g += gruppe(xs[cur], boden, haushalt(c, c.sc), c.sc === 'warten', [0, 390]);
      return svg('0 14 390 86', g, 'hs-band')
        + `<ol>${c.leiste.map((l) => `<li class="lst ${l.zustand}"${l.zustand === 'jetzt' ? ' aria-current="step"' : ''}>${l.name}</li>`).join('')}</ol>`;
    },
    marker: (kind) => MARKER[kind] || MARKER.normal,
    segment: (art) => svg('0 0 10 100', `<path d="M5 0V100" class="seg ${art}" vector-effect="non-scaling-stroke"/>`, 'hs-seg', ' preserveAspectRatio="none"'),
    hier: (t) => `<span class="hier">${t}</span>`,
    wegZeichen: (k) => svg('0 0 16 16', '<circle cx="8" cy="8" r="6.5"/>', 'hs-weg ' + k),
    labelIcon(art) {
      if (art === 'pflicht') return svg('0 0 16 16', '<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/>', 'hs-ico');
      if (art === 'pruefung') return svg('0 0 16 16', '<circle cx="6.8" cy="6.8" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 10l3.6 3.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>', 'hs-ico');
      return svg('0 0 16 16', '<circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 7.2v4.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="4.9" r="1.2" fill="currentColor"/>', 'hs-ico');
    },
    deko(kind) {
      if (kind === 'gewaehlt') return svg('0 0 18 18', '<path d="M3.5 9.5l3.6 3.6L14.5 5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>', 'hs-haken');
      if (kind !== 'himmel') return '';
      // Start: die leere Haltestelle am Abend. Noch keine Figuren, weil wir euch noch nicht kennen.
      const boden = 66;
      const stops = [150, 215, 280].map((x) => `<circle cx="${x}" cy="${boden}" r="6" class="stop-ring"/>`).join('');
      return svg('0 0 390 80', `<path class="linie" d="M60 ${boden}H200"/><path class="linie offen" d="M200 ${boden}H350"/>`
        + `<circle class="licht" cx="86" cy="${boden - 24}" r="38"/><path class="mast" d="M56 ${boden}V${boden - 50}"/><circle class="schild" cx="56" cy="${boden - 55}" r="8.5"/>`
        + `<path class="bank" d="M70 ${boden - 15}H112M74 ${boden - 15}V${boden}M108 ${boden - 15}V${boden}M72 ${boden - 27}H110M76 ${boden - 27}V${boden - 15}M106 ${boden - 27}V${boden - 15}"/>`
        + stops + `<rect x="338" y="${boden - 13}" width="26" height="26" rx="6" class="fenster"/><rect x="345" y="${boden - 6}" width="12" height="12" rx="2.5" class="m-licht"/>`, 'hs-hero');
    },
    weiche: () => svg('0 0 388 60', '<path class="stamm" d="M194 2V18"/><path class="ast-a" d="M194 18C194 32 97 28 97 44V58"/><path class="ast-b" d="M194 18C194 32 291 28 291 44V58"/>', 'hs-weiche', ' preserveAspectRatio="none"'),
  };
})();
