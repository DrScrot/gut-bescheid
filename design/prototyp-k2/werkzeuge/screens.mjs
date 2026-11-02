// Screenshots der K2-Prototypen: 390 × 844 (CSS-Pixel, Faktor 2), hell und dunkel.
// Aufruf: PLAYWRIGHT=<pfad>/node_modules/playwright/index.mjs node screens.mjs [variante]
// Browser: installierter Microsoft Edge (BROWSER_KANAL=chrome oder chromium zum Wechseln).
import path from 'node:path';
import { WURZEL, BASIS, ausliefern, laden } from './lokal.mjs';
const { chromium } = await laden('PLAYWRIGHT', 'playwright');
const aus = path.join(WURZEL, 'screens');
const nur = process.argv[2];

const BILDER = [
  ['1-start', 'T01', 'start'],
  ['2-geldfrage', 'T01', 'geld'],
  ['3-ergebnis-t01-weg-b-deckt', 'T01', 'ergebnis'],
  ['4-ergebnis-t04-nur-weg-a', 'T04', 'ergebnis'],
  ['5-ergebnis-kein-anspruch', 'KEIN', 'ergebnis'],
  ['6-warten-t01', 'T01', 'warten'],
  ['7-warten-t04', 'T04', 'warten'],
];
const GANZ = new Set(['3-ergebnis-t01-weg-b-deckt', '4-ergebnis-t04-nur-weg-a', '5-ergebnis-kein-anspruch', '6-warten-t01', '7-warten-t04']);

const browser = await chromium.launch({ channel: process.env.BROWSER_KANAL || 'msedge' });
for (const variante of ['skizze', 'haltestelle'].filter((v) => !nur || v === nur)) {
  for (const theme of ['hell', 'dunkel']) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: theme === 'dunkel' ? 'dark' : 'light', locale: 'de-DE' });
    await ausliefern(ctx);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.error(variante, theme, 'Fehler:', e.message));
    for (const [name, fall, screen] of BILDER) {
      await page.goto(`${BASIS}${variante}/index.html?fall=${fall}&screen=${screen}&theme=${theme}`);
      await page.waitForSelector('body[data-fertig]');
      await page.screenshot({ path: path.join(aus, `${variante}-${name}-${theme}.png`) });
      if (GANZ.has(name)) {
        // Fenster auf volle Höhe ziehen, damit der klebende Fuß am Ende steht und nichts verdeckt
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.setViewportSize({ width: 390, height: Math.max(844, h) });
        await page.screenshot({ path: path.join(aus, 'ganz', `${variante}-${name}-${theme}-ganz.png`) });
        await page.setViewportSize({ width: 390, height: 844 });
      }
    }
    await ctx.close();
  }
}
await browser.close();
console.log('fertig:', aus);
