// Automatische Prüfung der K2-Prototypen (WCAG 2.2 AA, hell und dunkel).
// 1. Kontrast aller relevanten Token-Paare (aus den berechneten CSS-Variablen der laufenden Seite)
// 2. Farbsehschwäche: Weg A, Weg B und Handlung unter Protan-, Deutan-, Tritan-Simulation (Machado 2009, Stärke 1), Abstand ΔE2000
// 3. axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa) je Bildschirm
// 4. kleinste sichtbare Schriftgröße und kleinste Berührfläche je Bildschirm
// Aufruf: PLAYWRIGHT=<…>/playwright/index.mjs AXE=<…>/@axe-core/playwright/dist/index.mjs node pruefen.mjs > bericht.md
import { BASIS, ausliefern, laden } from './lokal.mjs';
const { chromium } = await laden('PLAYWRIGHT', 'playwright');
const AxeBuilder = (await laden('AXE', '@axe-core/playwright')).default;
const basis = BASIS;

/* ---------- Farbe ---------- */
const hex = (h) => { h = h.trim().replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); };
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const delin = (c) => { c = Math.min(1, Math.max(0, c)); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
const lum = (rgb) => { const [r, g, b] = rgb.map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const kontrast = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const MACHADO = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};
const sim = (rgb, art) => { if (art === 'normal') return rgb; const l = rgb.map(lin); const m = MACHADO[art]; return m.map((z) => delin(z[0] * l[0] + z[1] * l[1] + z[2] * l[2])); };
const lab = (rgb) => {
  const [r, g, b] = rgb.map(lin);
  const X = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047, Y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b, Z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
};
const rad = (d) => (d * Math.PI) / 180;
function de2000([L1, a1, b1], [L2, a2, b2]) {
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cb = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2, C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const hh = (b, a) => { if (!a && !b) return 0; const x = (Math.atan2(b, a) * 180) / Math.PI; return x < 0 ? x + 360 : x; };
  const h1p = hh(b1, a1p), h2p = hh(b2, a2p);
  const dLp = L2 - L1, dCp = C2p - C1p;
  let dhp = 0; if (C1p * C2p) { dhp = h2p - h1p; if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360; }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp / 2));
  const Lbp = (L1 + L2) / 2, Cbp = (C1p + C2p) / 2;
  let hbp = h1p + h2p; if (C1p * C2p) hbp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2) : (h1p + h2p) / 2;
  const T = 1 - 0.17 * Math.cos(rad(hbp - 30)) + 0.24 * Math.cos(rad(2 * hbp)) + 0.32 * Math.cos(rad(3 * hbp + 6)) - 0.2 * Math.cos(rad(4 * hbp - 63));
  const dT = 30 * Math.exp(-(((hbp - 275) / 25) ** 2)), Rc = 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2), Sc = 1 + 0.045 * Cbp, Sh = 1 + 0.015 * Cbp * T, Rt = -Math.sin(rad(2 * dT)) * Rc;
  return Math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh));
}
const lchHue = (h) => { const [, a, b] = lab(hex(h)); const x = (Math.atan2(b, a) * 180) / Math.PI; return x < 0 ? x + 360 : x; };
const dE = (a, b, art) => de2000(lab(sim(hex(a), art)), lab(sim(hex(b), art)));

/* ---------- Paare je Variante ---------- */
const TEXT = 4.5, UI = 3;
const PAARE = {
  skizze: [
    ['text', 'seite', TEXT], ['text', 'flaeche', TEXT], ['text', 'tief', TEXT], ['text-leise', 'seite', TEXT], ['text-leise', 'tief', TEXT],
    ['handschrift', 'seite', TEXT], ['handschrift', 'h-stift', TEXT], ['text', 'h-stift', TEXT], ['text-leise', 'h-stift', TEXT],
    ['a', 'seite', TEXT], ['b', 'seite', TEXT], ['a', 'a-stift', TEXT], ['b', 'b-stift', TEXT], ['text', 'a-stift', TEXT], ['text', 'b-stift', TEXT],
    ['text', 'pflicht-flaeche', TEXT], ['auf-handlung', 'handlung', TEXT],
    ['tinte', 'seite', UI], ['stift-leise', 'seite', UI], ['rand', 'flaeche', UI], ['rand', 'seite', UI], ['handlung', 'seite', UI], ['fokus', 'seite', UI], ['fokus', 'flaeche', UI],
  ],
  haltestelle: [
    ['text', 'seite', TEXT], ['text', 'flaeche', TEXT], ['text', 'tief', TEXT], ['text-leise', 'seite', TEXT], ['text-leise', 'flaeche', TEXT], ['text-leise', 'tief', TEXT],
    ['band-text', 'band', TEXT], ['band-leise', 'band', TEXT], ['band-text', 'licht', TEXT],
    ['a', 'seite', TEXT], ['b', 'seite', TEXT], ['a', 'a-flaeche', TEXT], ['b', 'b-flaeche', TEXT], ['text', 'a-flaeche', TEXT], ['text', 'b-flaeche', TEXT],
    ['text', 'pflicht-flaeche', TEXT], ['#2A1A2F', 'honig', TEXT], ['auf-handlung', 'handlung', TEXT], ['text', 'flaeche', TEXT],
    ['linie', 'seite', UI], ['linie-leise', 'seite', UI], ['rand', 'flaeche', UI], ['rand', 'seite', UI], ['handlung', 'seite', UI], ['fokus', 'seite', UI], ['band-text', 'band', UI],
    ['band-linie', 'band', UI], ['band-leise', 'band', UI], ['honig', 'band', UI], ['b', 'b-flaeche', UI],
  ],
};
const R2 = { hell: { a: '#AD185F', b: '#745600', handlung: '#5B26C2', seite: '#FBFBF8' }, dunkel: { a: '#F6A0C7', b: '#DEB445', handlung: '#B9A0FF', seite: '#121212' } };

const BILDER = [['start', 'T01', 'start'], ['geldfrage', 'T01', 'geld'], ['ergebnis T01', 'T01', 'ergebnis'], ['ergebnis T04', 'T04', 'ergebnis'], ['ergebnis kein', 'KEIN', 'ergebnis'],
  ['ergebnis T03 Wahl', 'T03', 'ergebnis'], ['folgen T04', 'T04', 'folgen'], ['antrag T01', 'T01', 'antrag'], ['warten T01', 'T01', 'warten'], ['warten T04', 'T04', 'warten'], ['außerhalb', 'AUS', 'ausserhalb'], ['leitung', 'T01', 'leitung']];

const out = [];
const p = (s = '') => out.push(s);
const browser = await chromium.launch({ channel: process.env.BROWSER_KANAL || 'msedge' });
p('# Automatische Prüfung der K2-Prototypen');
p('');
p(`Stand: ${new Date().toISOString().slice(0, 10)}. Erzeugt mit werkzeuge/pruefen.mjs. Kontrast nach WCAG 2.2 (Text ≥ 4,5 : 1, Bedienelemente und Grafik ≥ 3 : 1). Farbsehschwäche nach Machado 2009 (Stärke 1), Abstand ΔE2000.`);
for (const variante of ['skizze', 'haltestelle']) {
  p(''); p(`## Variante ${variante === 'skizze' ? '1 „Skizze“' : '2 „Haltestelle“'}`);
  for (const theme of ['hell', 'dunkel']) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: theme === 'dunkel' ? 'dark' : 'light', locale: 'de-DE' });
    await ausliefern(ctx);
    const page = await ctx.newPage();
    await page.goto(`${basis}${variante}/index.html?fall=T01&screen=start&theme=${theme}`);
    await page.waitForSelector('body[data-fertig]');
    const namen = [...new Set(PAARE[variante].flat().filter((x) => typeof x === 'string' && !x.startsWith('#')).concat(['a', 'b', 'handlung', 'linie', 'honig', 'pflicht-flaeche', 'a-flaeche', 'b-flaeche']))];
    const tok = await page.evaluate((n) => Object.fromEntries(n.map((k) => [k, getComputedStyle(document.documentElement).getPropertyValue('--' + k).trim()])), namen);
    const wert = (k) => (k.startsWith('#') ? k : tok[k]);
    p(''); p(`### ${theme}: Kontrast der Token-Paare`); p('');
    p('| Vordergrund | Hintergrund | Werte | Kontrast | Soll | |'); p('|---|---|---|---|---|---|');
    for (const [v, h, soll] of PAARE[variante]) {
      const k = kontrast(wert(v), wert(h));
      p(`| ${v} | ${h} | ${wert(v)} auf ${wert(h)} | ${k.toFixed(2)} : 1 | ${soll === TEXT ? 'Text 4,5' : 'Grafik 3'} | ${k >= soll ? 'ok' : '**zu wenig**'} |`);
    }
    p(''); p(`### ${theme}: Farbsehschwäche (ΔE2000; ab etwa 10 gut unterscheidbar)`); p('');
    p('| Paar | normal | Protan | Deutan | Tritan |'); p('|---|---|---|---|---|');
    const reihe = (name, a, b) => p(`| ${name} | ${['normal', 'protan', 'deutan', 'tritan'].map((s) => dE(a, b, s).toFixed(1)).join(' | ')} |`);
    reihe('Weg A ↔ Weg B', tok.a, tok.b); reihe('Weg A ↔ Handlung', tok.a, tok.handlung); reihe('Weg B ↔ Handlung', tok.b, tok.handlung);
    if (tok.linie) { reihe('Weg A ↔ Strecke und Pflicht-Haltestelle', tok.a, tok.linie); reihe('Weg B ↔ Strecke und Pflicht-Haltestelle', tok.b, tok.linie); }
    if (tok.honig) { reihe('Weg A ↔ Licht (Hier bist du, Ziel)', tok.a, tok.honig); reihe('Weg B ↔ Licht (Hier bist du, Ziel)', tok.b, tok.honig); }
    if (tok['a-flaeche']) { reihe('Fläche Weg A ↔ Fläche Weg B', tok['a-flaeche'], tok['b-flaeche']); reihe('Fläche Weg A ↔ Pflicht-Fläche', tok['a-flaeche'], tok['pflicht-flaeche']); reihe('Fläche Weg B ↔ Pflicht-Fläche', tok['b-flaeche'], tok['pflicht-flaeche']); }
    reihe('zum Vergleich R2: Weg A ↔ Weg B', R2[theme].a, R2[theme].b);
    p(''); p(`Gleiche Stärke der Wege: Weg A ${kontrast(tok.a, tok.seite || '#FFFFFF').toFixed(2)} : 1, Weg B ${kontrast(tok.b, tok.seite || '#FFFFFF').toFixed(2)} : 1 auf der Seite. Farbton (LCh): Weg A ${lchHue(tok.a).toFixed(0)}°, Weg B ${lchHue(tok.b).toFixed(0)}° (reines Rot etwa 40°, Magenta etwa 330°; R2 Weg A bei ${lchHue(R2[theme].a).toFixed(0)}°).`);

    p(''); p(`### ${theme}: axe-core, kleinste Schrift, kleinste Berührfläche`); p('');
    p('| Bildschirm | axe-Verstöße | kleinste Schrift | kleinste Berührfläche | Fokus hinter dem Fuß (2.4.11) | RDG-Satz ohne Scrollen |'); p('|---|---|---|---|---|---|');
    for (const [name, fall, screen] of BILDER) {
      await page.goto(`${basis}${variante}/index.html?fall=${fall}&screen=${screen}&theme=${theme}${screen === 'ergebnis' && fall === 'T04' ? '&pflicht=a_erstgespraech' : ''}`);
      await page.waitForSelector('body[data-fertig]');
      // Steht der RDG-Satz am Betrag ganz über dem klebenden Fuß, ohne zu scrollen? (Entscheidung 02.11.2026)
      const rdg = screen !== 'ergebnis' ? '–' : await page.evaluate(() => {
        const r = document.querySelector('.ergebnis-karte .rdg, .weiche .rdg'); const f = document.querySelector('.fuss');
        if (!r) return 'fehlt';
        const unten = r.getBoundingClientRect().bottom, grenze = f.getBoundingClientRect().top;
        return unten <= grenze ? `ja (Unterkante ${Math.round(unten)} px, Fuß ab ${Math.round(grenze)} px)` : `**nein** (Unterkante ${Math.round(unten)} px, Fuß ab ${Math.round(grenze)} px)`;
      });
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const v = axe.violations.map((x) => `${x.id} (${x.nodes.length}): ${x.nodes.slice(0, 2).map((n) => n.target.join(' ')).join('; ')}`);
      const mess = await page.evaluate(() => {
        let minF = 99, minFwo = '';
        const tw = document.createTreeWalker(document.getElementById('app'), NodeFilter.SHOW_TEXT);
        while (tw.nextNode()) {
          const t = tw.currentNode; if (!t.textContent.trim()) continue;
          const el = t.parentElement; const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('svg')) continue;
          const f = parseFloat(cs.fontSize); if (f < minF) { minF = f; minFwo = t.textContent.trim().slice(0, 30); }
        }
        let minT = 999, minTwo = '';
        document.querySelectorAll('#app button, #app a, #app input, #app summary').forEach((el) => {
          const r = el.getBoundingClientRect(); if (!r.width) return;
          const m = Math.min(r.width, r.height); if (m < minT) { minT = m; minTwo = (el.textContent || el.id || el.tagName).trim().slice(0, 30); }
        });
        return { minF, minFwo, minT: Math.round(minT), minTwo };
      });
      // Per Tab durch den Bildschirm: Ist ein fokussiertes Element ganz oder teilweise hinter dem klebenden Fuß?
      await page.waitForFunction(() => document.documentElement.style.scrollPaddingBottom !== '');
      await page.evaluate(() => window.scrollTo(0, 0));
      const verdeckt = [];
      let schritte = 0;
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press('Tab');
        const r = await page.evaluate(() => {
          const el = document.activeElement; const f = document.querySelector('.fuss');
          if (!el || el === document.body) return null;
          if (f.contains(el) || getComputedStyle(f).position !== 'sticky') return { ok: true };
          const a = el.getBoundingClientRect(), b = f.getBoundingClientRect();
          return { ok: a.bottom <= b.top + 0.5, wer: (el.textContent || el.id || el.tagName).trim().slice(0, 25) };
        });
        if (!r) break;
        schritte++;
        if (!r.ok) verdeckt.push(r.wer);
      }
      p(`| ${name} | ${v.length ? v.join('<br>') : 'keine'} | ${mess.minF} px („${mess.minFwo}“) | ${mess.minT} px („${mess.minTwo}“) | ${verdeckt.length ? '**' + verdeckt.length + ' von ' + schritte + '**: ' + verdeckt.join('; ') : 'keins von ' + schritte} | ${rdg} |`);
    }
    await ctx.close();
  }
}
await browser.close();
console.log(out.join('\n'));
