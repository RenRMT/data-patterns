---
title: Seeing double
plain: Duplicates that nobody can define
icon: seeing-double
category: identity
order: 19
symptom: Is that the same household, or just a similar one?
aka: [Undefined duplicates, Double submissions]
search: [deduplication, business key, uniqueness constraint, duplicate detection, idempotency, record linkage, survivorship]
patterns: [grain-statement, tripwire]
---

Two rows look alike. Are they one thing recorded twice, or two things that resemble each other? Nobody can say, because nobody has defined what makes two rows the same row.

## Signs and symptoms

- "Remove Duplicates" is run before each report, with whatever columns seem right.
- Totals fall after cleaning and nobody can explain by how much they should.
- A partner submits the same month twice with small differences.
- The same person appears with two spellings.

## Why it hurts

Without a definition, removing duplicates is guesswork. Remove too few and figures are inflated; remove too many and real records disappear. A button that deletes rows from the data also leaves no trace of what went.

## Treatment

Write down the business key: the set of columns that makes a row unique at its grain (`site_id` + `month` + `indicator`). Put a uniqueness check on it. Decide which copy wins when two rows share the key (the latest submission, usually) and apply that rule in processing, keeping the received rows untouched.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Flag instead of deleting. Add a column:

```
=IF(COUNTIFS(Reports[site_id], [@site_id], Reports[month], [@month],
             Reports[indicator], [@indicator]) > 1, "DUPLICATE", "")
```

Review the flagged rows, then record the decision in the corrections log.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

`Table.Distinct` keeps whichever row comes first, which is not a rule. Sort on purpose, buffer, then remove:

```
Sorted = Table.Buffer(Table.Sort(Source, {% raw %}{{"submitted_at", Order.Descending}}{% endraw %})),
Latest = Table.Distinct(Sorted, {"site_id", "month", "indicator"})
```

Keep a check query that counts how many rows were dropped.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
CREATE OR REPLACE TABLE silver.reports AS
SELECT * FROM bronze.reports
QUALIFY row_number() OVER (
  PARTITION BY site_id, month, indicator
  ORDER BY submitted_at DESC) = 1;
```

Bronze keeps every submission, so the rule can be changed and rerun.

</div>

## When it is fine

Rows that are meant to repeat: two identical service visits on one day may both be real. That is a grain question, and the answer belongs in the grain statement.
