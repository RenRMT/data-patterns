---
title: Number from nowhere
plain: A figure nobody can trace back to its source
icon: number-from-nowhere
category: process
order: 26
symptom: I got it from a slide.
aka: [No provenance, Untraceable figure]
search: [data lineage, provenance, audit columns, load timestamp, metadata, traceability, data catalog]
patterns: [data-map, untouched-original]
---

A number is in the report. Which file did it come from? When was it loaded? Which steps touched it on the way? Nobody can say.

## Signs and symptoms

- A figure was copied from an e-mail, a slide or another report.
- Tables carry no date of extraction and no source name.
- Nobody knows how fresh the dashboard is.
- When a source changes, nobody knows which reports are affected.
- Checking one number takes a day of asking around.

## Why it hurts

A figure that cannot be traced cannot be checked, defended or corrected. When it is questioned, the only answers are trust or rework. And when a source turns out to be wrong, there is no way to find everything built on it.

## Treatment

Every table carries its origin: the source and the time of loading, on every row. Every step reads from a named input. A data map shows the route from source to report. For figures quoted in text, note the source and its date beside them.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Add `source_file` and `received_on` columns when pasting or importing data, and state source and reference date on the `Read me` tab. *Formulas > Trace Precedents* shows where a cell's value comes from within the workbook. A typed-in number has no precedents: that is the one to question.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Keep the file name when combining files, and show the refresh time on the report.

```
WithSource = Table.AddColumn(Files, "source_file", each [Name], type text)
```

The lineage view in the workspace shows which sources feed which reports, which is what you need when a source changes.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```python
from pyspark.sql.functions import col, current_timestamp
df = (spark.read.format("csv").option("header", True).load(path)
        .withColumn("_source_file", col("_metadata.file_path"))
        .withColumn("_loaded_at", current_timestamp()))
```

Carry both columns through silver. Unity Catalog adds table and column lineage on top, so you can ask what depends on a table before changing it.

</div>

## When it is fine

In a quick sketch for yourself. Not in anything sent to someone else.
