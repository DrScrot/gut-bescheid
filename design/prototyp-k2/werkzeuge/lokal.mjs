// Liefert design/prototyp-k2 innerhalb von Playwright aus (kein eigener Server nötig).
// Seiten öffnen unter http://k2.lokal/<variante>/index.html – Anfragen werden aus dem Ordner beantwortet,
// nichts geht ins Netz.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const BASIS = 'http://k2.lokal/';
const TYPEN = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };

export async function ausliefern(ctx) {
  await ctx.route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (u.host !== 'k2.lokal') return route.abort();
    const datei = path.join(WURZEL, decodeURIComponent(u.pathname));
    if (!datei.startsWith(WURZEL) || !fs.existsSync(datei) || fs.statSync(datei).isDirectory()) return route.fulfill({ status: 404, body: '404' });
    return route.fulfill({ status: 200, contentType: TYPEN[path.extname(datei)] || 'application/octet-stream', body: fs.readFileSync(datei) });
  });
}

export const laden = (env, fallback) => import(process.env[env] ? pathToFileURL(process.env[env]).href : fallback);
