const test = require("node:test");
const assert = require("node:assert");
const { snakeHeaders } = require("./lib.js");

test("snake_cases headers", () => {
  assert.deepStrictEqual(
    snakeHeaders(["Order Date", "Unit-Price ($)", "customerName"]),
    ["order_date", "unit_price", "customer_name"],
  );
});

test("dedupes, fills empty, prefixes leading digit", () => {
  assert.deepStrictEqual(
    snakeHeaders(["Name", "name", "", null, "2024 Sales"]),
    ["name", "name_2", "col", "col_2", "c_2024_sales"],
  );
});

test("stackSheets tags rows with the sheet name and fills missing columns", () => {
  const { stackSheets } = require("./lib.js");
  const rows = stackSheets([
    { label: " Andi ", rows: [{ customer: "a", qty: 1 }] },
    { label: "Budi", rows: [{ customer: "b", extra: 9 }] },
  ]);
  assert.deepStrictEqual(rows, [
    { sheet_name: "Andi", customer: "a", qty: 1, extra: null },
    { sheet_name: "Budi", customer: "b", qty: null, extra: 9 },
  ]);
});
