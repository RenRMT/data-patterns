---
title: Fossil values
plain: Calculated values stored once and never refreshed
icon: fossil-values
category: process
order: 23
symptom: The total was right when I typed it.
aka: [Stored derived values, Stale aggregates, Stale pivot table]
search: [derived data, materialised view, cache invalidation, denormalisation, computed column, refresh schedule, staleness]
patterns: [data-here-logic-there, push-button-rerun]
---

A total, an age, a flag or a category was calculated once and saved as a value. The inputs have changed since. The stored result has not.

## Signs and symptoms

- An `age` column, in a dataset that is two years old.
- A typed total that no longer matches the rows above it.
- A pivot table or chart showing last month's figures.
- An `is_active` flag that nobody remembers setting.
- Formulas pointing at a closed workbook, showing the values from when it was last open.

## Why it hurts

The stored value looks as trustworthy as the rest, and it disagrees with the data it came from. Nobody can tell when it was calculated or with which rule.

## Treatment

Calculate when reading: store the date of birth and derive the age. Where storing the result is necessary for speed, treat it as a copy with an agreed refresh, and record when it was last calculated.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Keep formulas as formulas: `=DATEDIF([@birth_date], TODAY(), "y")`. Set pivot tables to refresh on opening (*PivotTable Options > Data > Refresh data when opening the file*). Replace links to other workbooks with a query, which shows when it last refreshed.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Aggregates belong in measures, which are calculated at query time. A calculated column or imported table is only as fresh as the last refresh, so schedule the refresh and show its time on the report. Avoid importing pre-calculated totals from the source when the detail is available.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Use a view when the calculation is cheap, and a materialised view or scheduled table when it is not.

```sql
CREATE OR REPLACE VIEW gold.person_current AS
SELECT person_key,
       floor(months_between(current_date(), birth_date) / 12) AS age_years
FROM silver.dim_person;
```

For stored results, keep a `_calculated_at` column and alert when it is older than agreed.

</div>

## When it is fine

Snapshots are stored values on purpose: they record what was true on a date, and say so. Redundancy for speed is fine when it is derived and refreshable.
