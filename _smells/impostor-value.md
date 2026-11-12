---
title: Impostor value
plain: A made-up value standing in for "unknown"
icon: impostor-value
category: meaning
order: 8
symptom: Just put 9999 if you don't know.
aka: [Sentinel value, Magic value, Dummy value]
search: [sentinel value, magic number, null handling, missing data encoding, default value, dummy date]
patterns: [handshake-agreement, tripwire]
---

`9999`, `-1`, `0`, `1900-01-01` or `"unknown"` in a numeric or date column. A real-looking value is used to say that there is no value.

## Signs and symptoms

- The minimum or maximum of a column is suspiciously round or extreme.
- A spike at one value in a histogram: many people aged 0 or 99, many dates on 1 January 1900.
- Text such as `n/a` in a column of numbers.
- Averages that nobody believes.

## Why it hurts

Sums and averages include the impostor and come out wrong without any error. Zero is the worst choice, because it is also a legitimate answer: "none" and "not known" become indistinguishable.

## Treatment

Leave the value truly empty, and if the reason matters, record it in a separate column. Agree the convention in the handover contract, and add a check for the known impostors so new ones are caught on arrival.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Leave the cell empty. `AVERAGE` skips empty cells and includes zeros, which is exactly the distinction you need. To find impostors, look at `=MIN()`, `=MAX()` and a pivot table of counts per value.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
NoImpostors = Table.ReplaceValue(Source, 9999, null, Replacer.ReplaceValue, {"age"}),
NoDummy     = Table.ReplaceValue(NoImpostors, #date(1900, 1, 1), null, Replacer.ReplaceValue, {"birth_date"})
```

Turn on *View > Column distribution* to see the spike.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT nullif(age, 9999)                        AS age,
       nullif(birth_date, DATE'1900-01-01')     AS birth_date,
       CASE WHEN age = 9999 THEN 'not recorded' END AS age_missing_reason
FROM bronze.persons;
```

Follow it with a constraint: `CHECK (age BETWEEN 0 AND 120)`.

</div>

## When it is fine

A coded value in a category column (`unknown` as one of the allowed answers) is honest. The smell is a fake number or date in a column that gets calculated with.
