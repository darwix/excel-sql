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
if (typeof module !== "undefined") module.exports = { snakeHeaders };
