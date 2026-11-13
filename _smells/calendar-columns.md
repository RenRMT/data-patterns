---
title: Calendar columns
plain: Values used as column headers
icon: calendar-columns
category: shape
order: 2
symptom: Next year we just add twelve more columns.
aka: [Wide format, Crosstab storage]
search: [wide format, long format, unpivot, melt, pivot, tidy data, crosstab]
patterns: [plain-table]
---

Months, years, regions or categories sit across the top as column names: `jan`, `feb`, `mar`. The column headers contain data.

## Signs and symptoms

- A new period means a new column, and every formula and query has to learn about it.
- You cannot filter by month, because month is not a column.
- Column names contain values: `2024`, `2025`, `Q1_female`, `Q1_male`.
- Charts over time need the data rearranged first.

## Why it hurts

A new period is a change to the structure of the table instead of a new row. Nothing can be grouped, filtered or joined on the variable that is hiding in the headers. Each tool that reads the table has to list the columns by name, and breaks when one is added.

## Treatment

Store it long: one row per combination, with a `period` column and a `value` column. The wide view is rebuilt on demand with a pivot table. If headers pack two variables together (`Q1_female`), unpivot first and then split the name into two columns.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Load the range into Power Query (*Data > From Table/Range*), select the ID columns, and choose *Transform > Unpivot Other Columns*. Recreate the wide view with a pivot table that has the period in the columns area.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
Long = Table.UnpivotOtherColumns(Source, {"site_id", "indicator"}, "month", "value")
```

Unpivot *other* columns, not the selected ones: next year's new columns are then picked up without editing the query.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT site_id, indicator, month, value
FROM bronze.report_wide
  UNPIVOT (value FOR month IN (jan, feb, mar, apr, may, jun));
```

In PySpark, `df.unpivot(ids, values, "month", "value")` does the same. Build the column list from `df.columns` so a new month does not need a code change.

</div>

## When it is fine

In a table made for reading, and in a few analytical layouts that need one column per measure. Wide belongs at the presentation end, not in storage.
