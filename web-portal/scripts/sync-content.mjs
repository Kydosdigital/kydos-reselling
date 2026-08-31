import fs from "node:fs";
import path from "node:path";

const appRoot = process.cwd();
const repoRoot = path.resolve(appRoot, "..");
const sourceRoots = ["docs", "templates", "programme-packs", "worked-examples", "legal"];
const allowed = new Set([".md", ".csv"]);

const output = {};

function walk(directory, prefix) {
  if (!fs.existsSync(directory)) return;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    const relative = path.posix.join(prefix, entry.name);

    if (entry.isDirectory()) {
      walk(absolute, relative);
      continue;
    }

    if (!allowed.has(path.extname(entry.name).toLowerCase())) continue;
    output[relative] = fs.readFileSync(absolute, "utf8");
  }
}

for (const root of sourceRoots) {
  walk(path.join(repoRoot, root), root);
}

const generatedDir = path.join(appRoot, "generated");
fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(
  path.join(generatedDir, "content.json"),
  JSON.stringify(output),
  "utf8"
);

console.log("Synced " + Object.keys(output).length + " programme source files.");
