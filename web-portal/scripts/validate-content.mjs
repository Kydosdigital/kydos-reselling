import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const programmeFile = path.join(root, "lib", "programme-data.ts");
const contentFile = path.join(root, "generated", "content.json");

if (!fs.existsSync(programmeFile)) throw new Error("Missing lib/programme-data.ts");
if (!fs.existsSync(contentFile)) throw new Error("Missing generated/content.json. Run sync-content first.");

const sourceText = fs.readFileSync(programmeFile, "utf8");
const content = JSON.parse(fs.readFileSync(contentFile, "utf8"));

const ids = [...sourceText.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);
const sources = [...sourceText.matchAll(/\bsource:\s*"([^"]+)"/g)].map((match) => match[1]);
const slugs = [...sourceText.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);

function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

const duplicateIds = duplicates(ids);
const duplicateSlugs = duplicates(slugs);
const missingSources = sources.filter((source) => typeof content[source] !== "string");

if (duplicateIds.length) throw new Error("Duplicate lesson IDs: " + duplicateIds.join(", "));
if (duplicateSlugs.length) throw new Error("Duplicate module slugs: " + duplicateSlugs.join(", "));
if (missingSources.length) throw new Error("Programme sources missing from generated content: " + missingSources.join(", "));
if (ids.length < 20 || sources.length < 20) throw new Error("Programme content validation found unexpectedly few lessons.");

console.log("Programme content validation passed:", {
  modules: slugs.length,
  lessons: ids.length,
  sources: sources.length
});
