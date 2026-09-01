import test from "node:test";
import assert from "node:assert/strict";
import { csvEscape, rowsToCsv } from "../lib/csv.ts";

test("csvEscape quotes commas and doubles embedded quotes", () => {
  assert.equal(csvEscape('Hello, "world"'), '"Hello, ""world"""');
});

test("rowsToCsv produces an Excel-friendly UTF-8 CSV", () => {
  const csv = rowsToCsv(["name","notes"], [{ name: "Kydos", notes: "Line 1\nLine 2" }]);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.match(csv, /name,notes/);
  assert.match(csv, /"Line 1\nLine 2"/);
});


test("csvEscape neutralises spreadsheet formulas from user-controlled text", () => {
  assert.equal(csvEscape("=HYPERLINK(\"https://example.com\")"), "'=HYPERLINK(\"https://example.com\")");
  assert.equal(csvEscape("@SUM(A1:A2)"), "'@SUM(A1:A2)");
});

test("csvEscape keeps numeric values numeric", () => {
  assert.equal(csvEscape(-100), "-100");
});
