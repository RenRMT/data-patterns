---
title: Plain table
plain: Shape data as one plain rectangle
icon: plain-table
group: structure
order: 1
tier: 1
guarantee: Any tool can read the data without a person reshaping it first.
symptom: I need an hour to reformat it first.
question: Is the dataset a single table with one header row, one record per row and one value per cell?
first_step: Rebuild one "pretty" sheet as an Excel Table, and recreate the old layout from it as a pivot table.
aka: [Tidy data, Long format]
search: [tidy data, long format vs wide format, unpivot, melt, first normal form, rectangular data]
---

## The problem

Sheets get laid out for the eye: merged cells, a title on row 1, several small tables on one tab, blank rows for spacing, one column per month. A person reads this without effort. A pivot table, a query or a script cannot, so every analysis starts with manual reshaping, and the reshaping is done slightly differently each time.

## The pattern

Store data as one rectangle per table:

- one header row, with short unique names
- one record per row
- one variable per column
- one value per cell

Every tool reads this shape without help. Presentation layouts (wide tables, subtotals, colour) are outputs, built *from* the table and never typed into it.

Rules that prevent most of the trouble:

- Time periods are rows, not columns: a `month` column, not `Jan`, `Feb`, `Mar` across the top.
- Dates are written `YYYY-MM-DD`, in one column.
- No blank cell that means "same as above". One agreed code for missing, and zero is not missing.
- Units go in the column name or the data dictionary, never in the cell (`25 kg`).
- Colour, bold and cell comments carry no meaning. If it matters, it gets a column.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Make each dataset an Excel Table (`Ctrl+T`) on its own tab, starting in `A1`, and give it a real name. Pivot tables, charts and formatted reports sit on other tabs and read from it.

```
=SUMIFS(Reached[people], Reached[month], "2026-03", Reached[site_id], "KLA-01")
```

Structured references like `Reached[people]` grow with the table, so a formula never misses new rows. If you want centred group headings on a report tab, use *Format Cells > Alignment > Center Across Selection* instead of merging.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

When a source arrives in a human layout, flatten it in the first query steps: drop the title rows, promote one header row, fill down the repeated labels, and unpivot the period columns.

```
let
    Source   = Excel.Workbook(File.Contents(SourcePath), null, true),
    Sheet    = Source{[Item = "Report", Kind = "Sheet"]}[Data],
    NoTitle  = Table.Skip(Sheet, 6),
    Headers  = Table.PromoteHeaders(NoTitle, [PromoteAllScalars = true]),
    Filled   = Table.FillDown(Headers, {"site"}),
    Long     = Table.UnpivotOtherColumns(Filled, {"site", "indicator"}, "month", "value")
in
    Long
```

Better still, ask the source to send a plain table. Every layout you parse is a layout that can change.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Parsing of human layouts is confined to ingestion. Everything after bronze is a typed, tidy table.

```python
long = (
    spark.table("bronze.partner_report_wide")
    .unpivot(
        ids=["site_id", "indicator"],
        values=["jan", "feb", "mar"],
        variableColumnName="month",
        valueColumnName="value",
    )
)
long.write.mode("overwrite").saveAsTable("silver.partner_report")
```

In SQL the same reshaping is `SELECT * FROM t UNPIVOT (value FOR month IN (jan, feb, mar))`.

</div>

## When to bend it

Wide layouts are right for a final table that a person reads. Keep them at the reporting end and derive them from the plain table, so the plain table stays the one you maintain.
