# Excel SQL

Query an Excel file with SQL, preview the result, then copy it or download it as `.xlsx`. Runs entirely in the browser; files are never uploaded.

Live: https://darwix.github.io/excel-sql/

## How it works

1. Upload an `.xlsx`, `.xls` or `.csv` file.
2. Headers become SQL column names: `Order Date` is `order_date`, duplicates get `_2`, `_3`. Hover a column to see the original header.
3. Every sheet is a table, named after the sheet in snake_case. `all_sheets` stacks every sheet and adds a `sheet_name` column.
4. Type a query. The preview updates as you type and shows the first 200 rows.
5. **Copy rows** copies all result rows with a header as tab-separated text. **Download Excel** saves them as `converted.xlsx`.

Blank rows (all cells empty or spaces) are dropped when a file loads.

## Example

```sql
SELECT sheet_name AS sales_person, customer_name, quantity
FROM all_sheets
WHERE quantity > 10
```

## SQL dialect

Queries run on [AlaSQL](https://github.com/AlaSQL/alasql), not SQL Server or MySQL.

- Use `LENGTH`, not `LEN`, and `CAST(x AS STRING)`.
- A column named `value` must be bracketed: `[value]`, because `VALUE` is a keyword. Other keyword-named columns may need the same.
- With `UNION ALL`, list columns explicitly. `SELECT *` drops columns after the first branch.
- Decimal comma output: `REPLACE(CAST(price AS STRING), '.', ',')`. The result is text, not a number.

## Development

Single static page: `index.html` plus `lib.js` (header and row helpers). SheetJS and AlaSQL load from a CDN the first time a file is picked.

```
npm install
npm test            # node --test
npm run format      # prettier
```

A pre-commit hook runs `prettier --check`. CI runs format check and tests on pull requests. Open `index.html` in a browser to run it; no build step.

Deployed with GitHub Pages from `main`.
