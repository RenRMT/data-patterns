---
title: Suitcase cell
plain: Several values packed into one cell
icon: suitcase-cell
category: shape
order: 3
symptom: Just put them all in, separated by commas.
aka: [Multi-valued cell, Delimited list in a field]
search: [first normal form, atomic values, multi-valued attribute, split column, explode, one-to-many]
patterns: [plain-table, grain-statement]
---

One cell holds a list or a bundle: `Jansen; De Vries; Bakker` in a column called `involved`, or `Name (department, e-mail)` in one field.

## Signs and symptoms

- Cells contain separators: commas, semicolons, slashes, line breaks.
- Filters show hundreds of unique combinations instead of a short list.
- Counting how often one value occurs needs a text search.
- Someone, somewhere, used a different separator.

## Why it hurts

The values cannot be filtered, counted or joined. Splitting always goes wrong once: a name that contains a comma, a missing separator, a trailing space. The grain is blurred too, because one row now stands for one record and several of something else.

## Treatment

For a fixed number of parts, split into columns (`name`, `department`, `email`). For a variable number, move the values to their own table with one row per value and the ID of the parent record.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Fixed parts: *Data > Text to Columns*, or `=TEXTSPLIT(A2, ";")`. A variable list belongs on its own tab: one row per person, with the record ID beside it. Count occurrences in the meantime with `=COUNTIF(Log[involved], "*Bakker*")`, knowing it also matches "Bakkers".

</div>

<div class="stack" data-stack="powerbi" markdown="1">

*Split Column > By Delimiter > Advanced > Split into Rows* gives one row per value:

```
Split   = Table.TransformColumns(Source, {% raw %}{{"involved", each Text.Split(_, ";")}}{% endraw %}),
Rows    = Table.ExpandListColumn(Split, "involved"),
Trimmed = Table.TransformColumns(Rows, {% raw %}{{"involved", Text.Trim, type text}}{% endraw %})
```

Load the result as a separate table related to the parent by ID, so the parent's totals are not multiplied.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
CREATE OR REPLACE TABLE silver.case_people AS
SELECT case_id, trim(person) AS person
FROM bronze.cases
  LATERAL VIEW explode(split(involved, ';')) AS person;
```

</div>

## When it is fine

Free-text notes that nobody will count, and values that are one thing despite containing a separator (an address line, a full name).
