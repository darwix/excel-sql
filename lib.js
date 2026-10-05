// 'Order Date' -> order_date; dupes get _2, _3; empty -> col; leading digit -> c_ prefix.
function snakeHeaders(headers) {
  const seen = {};
  return headers.map((h) => {
    let s = String(h ?? "")
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    if (!s) s = "col";
    if (/^\d/.test(s)) s = "c_" + s;
    seen[s] = (seen[s] || 0) + 1;
    return seen[s] > 1 ? `${s}_${seen[s]}` : s;
  });
}
// All sheets stacked into one row list, each row tagged with its sheet name.
// Columns missing from a sheet are null.
function stackSheets(sheets) {
  const cols = [...new Set(sheets.flatMap((s) => s.rows.flatMap(Object.keys)))];
  return sheets.flatMap((s) =>
    s.rows.map((r) => ({
      ...Object.fromEntries(cols.map((c) => [c, r[c] ?? null])),
      sheet_name: String(s.label).trim(),
    })),
  );
}
// Excel ranges often run past the real data; drop rows with nothing in them.
function dropBlankRows(aoa) {
  return aoa.filter((r) => r.some((c) => c != null && String(c).trim() !== ""));
}
if (typeof module !== "undefined")
  module.exports = { snakeHeaders, stackSheets, dropBlankRows };
