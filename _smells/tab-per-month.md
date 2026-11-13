---
title: Tab per month
plain: One sheet or file per period, department or partner
icon: tab-per-month
category: shape
order: 7
symptom: Copy last month's tab and clear it out.
aka: [Sheet sprawl, Data in the tab name]
search: [append queries, combine files, union, partitioning, data in file names, schema drift]
patterns: [plain-table, push-button-rerun]
---

Thirty-six tabs with the same columns, one for each month. Or one file per partner, per year, per office. A variable that should be a column lives in the tab name or the file name.

## Signs and symptoms

- Tabs or files are named after periods, places or teams.
- Any analysis over time starts with copying blocks together.
- The tabs have drifted: a column added in March, renamed in June.
- Formulas reach across many tabs (`=Jan!B4+Feb!B4+...`).

## Why it hurts

The pieces must be stitched together by hand for every question that spans them, and the stitching is not repeatable. Because each tab is edited separately, their structures diverge, which makes the stitching harder each month.

## Treatment

One table, with a column for the thing the tabs were split by (`period`, `department`). If the split already exists, or people need it for entry, combine the pieces automatically and treat the tab or file name as data.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Keep one Table with a `month` column and give people their per-month view with a slicer or filter. To rescue existing tabs, `=VSTACK(Jan[#Data], Feb[#Data], Mar[#Data])` stacks them, though Power Query does it without listing every tab.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
let
    Source = Excel.Workbook(File.Contents(SourcePath), true),
    Sheets = Table.SelectRows(Source, each [Kind] = "Sheet" and [Name] <> "Read me"),
    Named  = Table.RenameColumns(Sheets, {% raw %}{{"Name", "month"}}{% endraw %}),
    Kept   = Table.SelectColumns(Named, {"month", "Data"}),
    All    = Table.ExpandTableColumn(Kept, "Data", {"site_id", "indicator", "people"})
in
    All
```

For one file per period, start from `Folder.Files` instead. New tabs and files are picked up on refresh.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Read the whole folder in one go and keep the file name.

```python
from pyspark.sql.functions import col, regexp_extract
df = (spark.read.option("header", True).csv("/Volumes/main/landing/monthly/*.csv")
        .withColumn("_source_file", col("_metadata.file_name"))
        .withColumn("month", regexp_extract("_source_file", r"(\d{4}-\d{2})", 1)))
```

</div>

## When it is fine

Splitting files for delivery or storage is normal (one export per month). The smell is when people edit and analyse the pieces separately.
