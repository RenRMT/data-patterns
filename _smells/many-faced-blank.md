---
title: Many-faced blank
plain: One empty cell with several possible meanings
icon: many-faced-blank
category: meaning
order: 9
symptom: Blank means no. I think.
aka: [Overloaded null, Ambiguous missing value]
search: [null semantics, missing data, missingness, not applicable vs unknown, MCAR MAR MNAR, null handling]
patterns: [handshake-agreement, data-map]
---

A cell is empty. It could mean not applicable, not yet collected, refused, unknown, or zero. All five look identical.

## Signs and symptoms

- Two analysts get different counts from the same column.
- Blanks cluster in one period, one office or one source.
- Somebody "cleans" the data by filling blanks with 0.
- The questionnaire had skip logic, and the data does not show it.

## Why it hurts

Every analyst guesses, and each guesses differently. Filling blanks with zero turns "we do not know" into "none", which lowers every average and total. Whether missing values can be ignored depends on *why* they are missing, and that reason has been thrown away.

## Treatment

Make the distinction explicit. Keep the value empty and add a column that says why (`not applicable`, `not collected`, `refused`, `unknown`), or agree one code per reason in the data dictionary. State in the handover contract that zero is written as `0` and never as blank.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Add a `people_missing_reason` column with a dropdown, required whenever `people` is empty. Check with `=COUNTBLANK(Reports[people])` against `=COUNTA(Reports[people_missing_reason])`: the two should match.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

An empty cell arrives as `null`, an empty string or a space, depending on the source. Make them one thing before deciding what it means:

```
Blanked = Table.TransformColumns(Source,
            {% raw %}{{"answer", each if _ = null or Text.Trim(_) = "" then null else _, type text}}{% endraw %})
```

Measures treat blank as zero in arithmetic; show the count of blanks beside any average.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT site_id,
       count(*)                                  AS rows,
       count(people)                             AS reported,
       count_if(people IS NULL)                  AS missing,
       count_if(people IS NULL AND missing_reason IS NULL) AS unexplained
FROM silver.reports
GROUP BY site_id;
```

Remember that `NULL = NULL` is not true, so nulls drop out of joins and `WHERE x <> 'a'` filters.

</div>

## When it is fine

When only one reason is possible. An empty `end_date` on a contract that is still running needs no explanation, as long as the dictionary says so.
