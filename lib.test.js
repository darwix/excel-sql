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

test("unionQuery tags each sheet with its name and keeps shared columns", () => {
  const { unionQuery } = require("./lib.js");
  const sql = unionQuery([
    { table: "andi", label: "Andi's", cols: ["customer", "qty", "only_a"] },
    { table: "budi", label: "Budi", cols: ["qty", "customer"] },
  ]);
  assert.strictEqual(
    sql,
    "SELECT 'Andi''s' AS sales_person, [customer], [qty] FROM `andi`\n" +
      "UNION ALL\n" +
      "SELECT 'Budi' AS sales_person, [customer], [qty] FROM `budi`",
  );
});
