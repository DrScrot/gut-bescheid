// Schreibt die Lesefassung des Folgen-Katalogs nach docs/folgen-katalog.md. Aufruf: pnpm katalog
import { writeFileSync } from "node:fs";
import { lesefassung } from "./lesefassung.ts";

const ziel = new URL("../../../docs/folgen-katalog.md", import.meta.url);
writeFileSync(ziel, lesefassung());
console.log(`geschrieben: ${ziel.pathname}`);
