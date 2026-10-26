// PostToolUse-Hook: Nach Edit/Write in packages/regelwerk laufen die Regelwerk-Tests.
// Grün: Exit 0 mit kurzem Hinweis. Rot: Exit 2, die Ausgabe geht über stderr an Claude.
import { spawnSync } from "node:child_process";
import path from "node:path";

const ZEILEN = 60;

let roh = "";
for await (const teil of process.stdin) roh += teil;

const eingabe = JSON.parse(roh);
const datei = eingabe.tool_input?.file_path;
const projekt = process.env.CLAUDE_PROJECT_DIR || eingabe.cwd;
if (typeof datei !== "string" || !projekt) process.exit(0);

// Unter Windows kommt der Pfad mit Backslashes an.
const relativ = path.relative(projekt, datei).split(path.sep).join("/");
if (!relativ.startsWith("packages/regelwerk/") || relativ.includes("/node_modules/")) {
  process.exit(0);
}

// shell: true, weil pnpm unter Windows ein .cmd-Shim ist.
const lauf = spawnSync("pnpm --filter @gut-bescheid/regelwerk test", {
  cwd: projekt,
  shell: true,
  encoding: "utf8",
});

if (lauf.error) {
  console.error(`Regelwerk-Tests nicht gestartet: ${lauf.error.message}`);
  process.exit(1);
}

if (lauf.status === 0) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: "Regelwerk-Tests grün.",
      },
    }),
  );
  process.exit(0);
}

const ausgabe = `${lauf.stdout}\n${lauf.stderr}`
  .replace(/\x1b\[[0-9;]*m/g, "")
  .trim()
  .split(/\r?\n/)
  .slice(-ZEILEN)
  .join("\n");
console.error(`Regelwerk-Tests rot (nach Änderung an ${relativ}):\n${ausgabe}`);
process.exit(2);
