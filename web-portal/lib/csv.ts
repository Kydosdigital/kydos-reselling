export function csvEscape(value: unknown) {
  if (value === null || value === undefined) return "";
  let text = typeof value === "object" ? JSON.stringify(value) : String(value);

  // Prevent spreadsheet formula injection when exports are opened in Excel
  // or Google Sheets. Numeric values remain numeric; only text beginning with
  // a formula control character is neutralised.
  if (typeof value === "string" && /^[=+\-@]/.test(text)) {
    text = "'" + text;
  }

  if (/[",\n\r]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
  return text;
}

export function rowsToCsv(columns: string[], rows: Record<string, unknown>[]) {
  const header = columns.map(csvEscape).join(",");
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","));
  return "\uFEFF" + [header, ...body].join("\r\n") + "\r\n";
}
