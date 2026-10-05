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
// One SELECT per sheet, sheet name as sales_person, only columns every sheet has.
// Explicit columns on purpose: AlaSQL drops columns after the first branch with `*`.
function unionQuery(sheets) {
  const cols = sheets[0].cols.filter((c) =>
    sheets.every((s) => s.cols.includes(c)),
  );
  const list = cols.map((c) => `[${c}]`).join(", ");
  return sheets
    .map((s) => {
      const label = String(s.label).trim().replace(/'/g, "''");
      return `SELECT '${label}' AS sales_person, ${list} FROM \`${s.table}\``;
    })
    .join("\nUNION ALL\n");
}
if (typeof module !== "undefined")
  module.exports = { snakeHeaders, unionQuery };
