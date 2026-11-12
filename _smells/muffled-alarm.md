---
title: Muffled alarm
plain: Errors hidden instead of handled
icon: muffled-alarm
category: process
order: 29
symptom: I wrapped it in IFERROR so it stops complaining.
aka: [Swallowed errors, Silent failure]
search: [error handling, silent failure, fail fast, error swallowing, null propagation, inner join data loss, data quality monitoring]
patterns: [tripwire]
---

`=IFERROR(VLOOKUP(...), 0)` everywhere. Errors replaced with blank in a query step. A `try` that carries on whatever happens. The warning has been switched off and the problem is still there.

## Signs and symptoms

- Error-handling wrappers return `0` or `""`.
- Totals are a little low, and nobody knows why.
- Failed type conversions show up as empty cells.
- A merge keeps only matching rows, and nobody compared the row counts.
- Or the reverse: `#N/A` and `#DIV/0!` go out in the finished report, because nobody looks.

## Why it hurts

A missing match becomes a zero and is added into the total. The problem has not been solved; it has been made invisible, and a wrong number that looks right travels further than an error would. Zero is a result, not a way of handling an error.

## Treatment

Make failures loud and countable. Replace an error with a label that cannot be mistaken for data, count the labels, and stop the process when the count is not zero. Handle the *expected* exceptions explicitly and let the unexpected ones fail.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

```
=IFERROR(XLOOKUP([@site_id], Sites[site_id], Sites[region]), "NO MATCH")
```

Count them in a check cell at the top, `=COUNTIF(Reports[region], "NO MATCH")`, and count remaining errors with `=SUMPRODUCT(--ISERROR(Reports[people]))`. Colour the cell with conditional formatting when it is not zero.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Do not use *Replace Errors* or *Remove Errors* as a clean-up. Keep the rows with errors in a check query:

```
Problems = Table.SelectRowsWithErrors(Typed, {"report_date", "people"})
```

Cells with errors load into the model as blanks. And `try ... otherwise null` belongs only where you then count the nulls.

</div>

<div class="stack" data-stack="databricks" markdown="1">

`try_cast` and permissive file reading turn bad values into nulls; an inner join drops what does not match; `except: pass` hides everything. Measure what was lost at each step.

```sql
SELECT count(*)                                        AS rows_in,
       count_if(try_cast(people AS INT) IS NULL
                AND people IS NOT NULL)                AS people_not_parsed
FROM bronze.reports;
```

Fail the job when a count crosses its threshold, and send rejected rows to a quarantine table.

</div>

## When it is fine

Showing a dash instead of `#DIV/0!` in a presentation table, when the denominator is legitimately zero.
