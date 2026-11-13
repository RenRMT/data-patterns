---
title: Report in disguise
plain: A report layout used as a data table
icon: report-in-disguise
category: shape
order: 1
symptom: The data starts on row 7.
aka: [Presentation layout, Merged cells, Multi-row headers]
search: [tidy data, merged cells, multi-level header, fill down, promote headers, semi-structured spreadsheet]
patterns: [plain-table, one-way-street]
---

The sheet is formatted to be read by a person: a title and logo on top, headers spread over two or three rows, merged cells, blank rows for spacing, a category typed once with the rows below left empty. It is a report, and it is being used as the place where the data lives.

## Signs and symptoms

- The header is not on row 1, or there are several header rows.
- Merged cells span columns or rows.
- A category appears once, and the rows beneath are blank "because it is the same".
- Blank rows or columns separate blocks; several small tables share one tab.
- Hidden rows, columns or tabs hold values that matter.
- Sorting or filtering scrambles the sheet.

## Why it hurts

No tool can read this without a person interpreting it first. A merged cell holds its value in one cell only, so the others import as blank. Selection shortcuts, filters and imports stop at the first empty row. Each analysis starts with reshaping, and each reshaping is a chance to get it wrong.

## Treatment

Separate the table from the report. Storage is one rectangle: one header row, one record per row, the category repeated on every row. The formatted view is rebuilt from that table as a pivot table or report page. Notes and titles move to a `Read me` tab.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Unmerge, then repeat the values: select the column, *Home > Find & Select > Go To Special > Blanks*, type `=` and the cell above, press `Ctrl+Enter`, then paste as values. Convert the result to a Table (`Ctrl+T`). For headings that should look merged on a report tab, use *Center Across Selection*.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
NoTitle = Table.Skip(Sheet, 6),
Headers = Table.PromoteHeaders(NoTitle, [PromoteAllScalars = true]),
Filled  = Table.FillDown(Headers, {"department"}),
NoBlank = Table.SelectRows(Filled, each [amount] <> null)
```

For two header rows, transpose, merge the two header columns into one name, and transpose back before promoting.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Read the sheet as strings with no header, find the header row in code, and fill down with a window function. Keep this parsing in the ingestion step only.

```python
from pyspark.sql import Window, functions as F
w = Window.orderBy("_row").rowsBetween(Window.unboundedPreceding, 0)
filled = raw.withColumn("department", F.last("department", ignorenulls=True).over(w))
```

</div>

## When it is fine

In the final product. A formatted table with merged headings is right for a reader, as long as it is produced from a plain table and nobody types into it.
