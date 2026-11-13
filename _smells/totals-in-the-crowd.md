---
title: Totals in the crowd
plain: Total rows mixed in with detail rows
icon: totals-in-the-crowd
category: shape
order: 6
symptom: Why does this add up to double?
aka: [Mixed grain, Subtotals among the data]
search: [mixed granularity, grain, subtotal rows, double counting, aggregate vs detail, fact table grain]
patterns: [grain-statement, plain-table]
---

Detail rows and total rows share one table: a bold subtotal every ten lines and a grand total at the bottom, or monthly and annual figures in the same column.

## Signs and symptoms

- A row labelled "Total", "Subtotal" or "All regions" sits among the records.
- Summing the column gives twice the real figure, or more.
- Some rows are per month and others per year.
- Filtering hides the details and leaves a stale total, or the reverse.

## Why it hurts

Every sum counts twice. The total rows are typed or calculated once and go stale when a detail changes. Rows at different levels cannot be told apart by a tool, only by a reader who notices the bold.

## Treatment

One level per table. Aggregates are derived when needed, not stored among the records. If a source can only deliver totals, they go in a separate table with its own grain statement.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Delete the subtotal rows and use the Table's *Total Row* (*Table Design > Total Row*) or a pivot table. `=SUBTOTAL(109, Reports[people])` respects filters, so the total always matches what is shown.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Filter the total rows out in the query and let measures do the adding.

```
Detail = Table.SelectRows(Source, each not Text.StartsWith(Text.Trim([site]), "Total"))
```

Before discarding them, use the delivered totals as a check: detail rows should add up to them.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
CREATE OR REPLACE TABLE silver.reports AS
SELECT * FROM bronze.reports
WHERE lower(trim(site)) NOT LIKE 'total%' AND site IS NOT NULL;
```

Then test the grain: no two rows for the same site, month and indicator.

</div>

## When it is fine

In output for readers. And a pre-aggregated reporting table is fine when it holds one level only and is rebuilt from the detail.
