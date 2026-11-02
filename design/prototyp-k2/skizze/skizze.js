/* Variante 1 „Skizze“: Der Fahrplan, aufgezeichnet von jemandem, der sich auskennt.
   Alle Zeichen sind von Hand gesetzte Pfade (keine Bibliothek, keine Stock-Grafik).
   Farbe kommt über CSS-Variablen (currentColor), damit hell und dunkel stimmen. */
(function () {
  'use strict';
  const svg = (vb, inner, cls, extra = '') => `<svg class="${cls}" viewBox="${vb}" aria-hidden="true" focusable="false"${extra}>${inner}</svg>`;
  const strich = (d, w = 2.6, extra = '') => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  const flaeche = (d) => `<path d="${d}" fill="currentColor"/>`;
  const NS = ' vector-effect="non-scaling-stroke"';

  // Haltestellen, mit dem Stift gezogen: Schleifen schließen nicht ganz, Kanten sind leicht schief.
  const SCHLEIFE = 'M6.2 10.6C7.9 6.4 12.2 4.4 16.3 5.3C20.6 6.2 23.4 10.3 22.7 14.6C22 19.1 17.9 22.4 13.4 22C8.9 21.6 5.4 17.7 5.6 13.2C5.7 11.4 6.4 9.6 7.6 8.3';
  const PUNKT = 'M8.3 13.6C8.4 10.2 11.3 7.9 14.6 8.2C17.9 8.5 20.1 11.3 19.8 14.5C19.5 17.7 16.7 20 13.5 19.7C10.4 19.4 8.2 16.8 8.3 13.6Z';
  const JETZT_AUSSEN = 'M7.5 12C10 6.2 16.6 3.6 22.4 5.6C28.4 7.7 31.8 14.3 29.9 20.4C28 26.6 21.4 30.4 15.1 28.8C8.7 27.2 4.7 20.6 6.3 14.2C7 11.4 8.6 9 10.8 7.4';
  const JETZT_INNEN = 'M11.6 17.4C11.8 13.6 15.1 10.9 18.7 11.3C22.3 11.7 24.8 15 24.3 18.6C23.8 22.2 20.6 24.6 17 24.1C13.6 23.7 11.4 20.7 11.6 17.4Z';
  const KASTEN = 'M6.4 6.9L21.6 6.2L21.9 21.5L6.2 21.8L6 5.4';
  const ZIEL_AUSSEN = 'M5.6 6.2L26.4 5.4L26.8 26.3L5.4 26.7L5.2 4.4';
  const ZIEL_INNEN = 'M10.4 10.6L21.7 10.2L21.9 21.6L10.3 21.9Z';
  const WELLE = 'M8.5 15C10.5 12.6 12.6 16.8 14.6 14.2S18.6 12.4 20 14';
  const KRITZELKREIS = 'M10 24C7 12 38 4 60 5.5C84 7 97 15 93 25C88 35 44 38 20 34C7 31 4 21 15 13';
  const RAHMEN = 'M3.2 7C3 3.8 4.6 2.6 8.4 2.7L91.5 2.1C95.6 2.3 97.4 3.6 97.3 7.4L97.9 92.6C97.8 96.4 96.2 97.5 92.2 97.6L7.8 98C4.2 97.8 2.6 96.5 2.8 92.8Z';

  const kritzelkreis = (cls) => svg('0 0 100 40', strich(KRITZELKREIS, 2.4, NS), 'sk-kreis ' + cls, ' preserveAspectRatio="none"');
  const schraffur = (farbe, cls) => `<svg class="sk-schraffur ${cls}" aria-hidden="true" focusable="false"><rect x="0" y="0" width="100%" height="100%" fill="url(#sk-sch-${farbe})" filter="url(#sk-rau)"/></svg>`;

  const mini = (l) => {
    if (l.ende) return svg('0 0 28 28', l.zustand === 'spaeter' ? strich(KASTEN, 2.8) : flaeche(ZIEL_INNEN) + strich(KASTEN, 2.8), 'sk-mini');
    if (l.zustand === 'erledigt') return svg('0 0 28 28', flaeche(PUNKT) + strich(SCHLEIFE, 2.8), 'sk-mini');
    if (l.zustand === 'jetzt') return svg('0 0 36 36', flaeche(JETZT_INNEN) + strich(JETZT_AUSSEN, 3), 'sk-mini jetzt');
    return svg('0 0 28 28', strich(SCHLEIFE, 2.8), 'sk-mini');
  };

  // Pinsel und Schraffuren einmal für das Dokument anlegen.
  document.body.insertAdjacentHTML('afterbegin', `<svg class="sk-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
    <filter id="sk-rau" x="-3%" y="-6%" width="106%" height="112%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter>
    ${['a', 'b', 'h'].map((f) => `<pattern id="sk-sch-${f}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-50)"><line x1="-1" y1="1.6" x2="9" y2="1.6" class="sk-st ${f}" stroke-width="2.4"/><line x1="-1" y1="5.6" x2="9" y2="5.6" class="sk-st ${f} duenn" stroke-width="1.4"/></pattern>`).join('')}
  </defs></svg>`);

  window.K2_VARIANTE = {
    marke: () => 'Gut Bescheid',
    leiste(c) {
      const n = c.leiste.length;
      const xs = c.leiste.map((_, i) => (100 * (i + 0.5)) / n);
      const cur = Math.max(0, c.leiste.findIndex((l) => l.zustand === 'jetzt'));
      const linie = (a, b, offen) => (a === b ? '' : `<path d="M${a} 5C${a + (b - a) * 0.33} 3.6 ${a + (b - a) * 0.66} 6.4 ${b} 5" fill="none" stroke="currentColor" stroke-width="${offen ? 2.6 : 2.6}" stroke-linecap="round"${NS}${offen ? ' stroke-dasharray="0.5 7" class="offen"' : ''}/>`);
      return `<svg class="sk-leiste-linie" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false">${linie(xs[0], xs[cur], false)}${linie(xs[cur], xs[n - 1], true)}</svg>
        <ol>${c.leiste.map((l) => `<li class="lst ${l.zustand}${l.ende ? ' ende' : ''}"${l.zustand === 'jetzt' ? ' aria-current="step"' : ''}><span class="lst-marke" aria-hidden="true">${mini(l)}</span><span class="lst-name">${l.name}${l.zustand === 'jetzt' ? kritzelkreis('lst-kreis') : ''}</span></li>`).join('')}</ol>`;
    },
    marker(kind) {
      if (kind === 'jetzt') return svg('0 0 36 36', flaeche(JETZT_INNEN) + strich(JETZT_AUSSEN, 2.8), 'sk-m jetzt');
      if (kind === 'erledigt') return svg('0 0 28 28', flaeche(PUNKT) + strich(SCHLEIFE), 'sk-m');
      if (kind === 'pflicht') return svg('0 0 28 28', strich(KASTEN, 2.8), 'sk-m pflicht');
      if (kind === 'hinweis') return svg('0 0 28 28', strich(WELLE, 2.4), 'sk-m');
      if (kind === 'ziel') return svg('0 0 32 32', flaeche(ZIEL_INNEN) + strich(ZIEL_AUSSEN, 2.8), 'sk-m ziel');
      return svg('0 0 28 28', strich(SCHLEIFE), 'sk-m');
    },
    segment: (art) => svg('0 0 12 100', strich('M6 0C4.6 20 7.4 38 6 58C4.9 76 7 88 6 100', 2.6, NS + (art === 'offen' ? ' stroke-dasharray="0.5 8"' : '')), 'sk-seg ' + art, ' preserveAspectRatio="none"'),
    hier: (t) => `<span class="notiz">${svg('0 0 34 18', strich('M31 10C24 4.6 14 5.2 5 10M5 10L11.4 11.8M5 10L9.6 4.8', 2.2), 'sk-pfeil')}<span>${t}</span></span>`,
    wegZeichen: (k) => svg('0 0 28 12', strich('M2.5 7.5C6.5 3.2 10 10.4 14.2 6.6S21.8 3.6 25.5 6.2', 3.6), 'sk-weg ' + k),
    labelIcon(art) {
      if (art === 'pflicht') return svg('0 0 16 16', strich('M3.2 3.6L12.8 3.1L13 12.9L3.1 13.1L2.9 2.6', 1.9), 'sk-ico');
      if (art === 'pruefung') return svg('0 0 16 16', strich('M9.6 6.6C9.8 4.6 8.2 2.8 6.2 2.8C4.1 2.8 2.6 4.5 2.7 6.5C2.8 8.5 4.5 10 6.4 9.9C8.2 9.8 9.5 8.4 9.6 6.6M8.9 9.2L13.2 13.4', 1.9), 'sk-ico');
      return svg('0 0 16 16', strich('M8 3.2L8.05 3.5M7.9 6.6C8.1 8.8 7.8 10.9 8.1 13', 2.2), 'sk-ico');
    },
    deko(kind) {
      if (kind === 'weg-a') return schraffur('a', 'weg-sch');
      if (kind === 'weg-b' || kind === 'balken') return schraffur('b', kind === 'balken' ? 'balken-sch' : 'weg-sch');
      if (kind === 'himmel' || kind === 'hinweis') return schraffur('h', kind + '-sch');
      if (kind === 'karte') return svg('0 0 100 100', strich(RAHMEN, 1.8, NS), 'sk-rahmen', ' preserveAspectRatio="none"');
      if (kind === 'gewaehlt') return kritzelkreis('wahl-kreis');
      return '';
    },
    weiche: () => svg('0 0 388 56', strich('M194 3C193 9 195 13 194 18', 3, NS) + `<path class="ast-a" d="M194 18C160 24 120 30 98 40C96 45 98 49 97 53" fill="none" stroke-width="3.4" stroke-linecap="round"${NS}/><path class="ast-b" d="M194 18C228 25 266 30 290 40C292 45 290 49 291 53" fill="none" stroke-width="3.4" stroke-linecap="round"${NS}/>`, 'sk-weiche', ' preserveAspectRatio="none"'),
    nachRender(app) {
      const z = app.querySelector('.beleg .zeile');
      if (z) z.insertAdjacentHTML('beforeend', kritzelkreis('beleg-kreis'));
    },
  };
})();
