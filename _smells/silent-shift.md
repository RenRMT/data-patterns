---
title: Silent shift
plain: The structure or meaning changed without notice
icon: silent-shift
category: process
order: 27
symptom: The partner changed the template again.
aka: [Schema drift, Unannounced change]
search: [schema drift, schema evolution, breaking change, data contract, schema validation, backward compatibility, column positions]
patterns: [handshake-agreement, tripwire]
---

A column was added, renamed or moved. A code that meant one thing now means another. Nobody announced it, and the process carried on calculating.

## Signs and symptoms

- Figures change abruptly from one delivery to the next.
- A column is suddenly empty, or full of values from its neighbour.
- A lookup by column number returns a different field.
- New category values appear that no rule handles.
- The refresh fails, which is the lucky case.

## Why it hurts

The worst outcome is that nothing breaks. Values land in the wrong column or under the wrong meaning, and the report looks normal. By the time someone notices, several periods have been published.

## Treatment

Agree with the supplier that changes are announced, and do not rely on the agreement: check every delivery against the expected columns, types and allowed values, and stop on a mismatch. Refer to columns by name, never by position.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

`=VLOOKUP(A2, Sheet2!A:H, 5, FALSE)` returns the wrong field as soon as someone inserts a column. Use `XLOOKUP` or structured references, which follow the column. Lock template headers, and check them in one cell:

```
=IF(AND(Reports[#Headers] = Expected[#Headers]), "PASS", "FAIL")
```

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Queries hardcode column names in many steps, so a renamed column fails the refresh (good) and an extra column is ignored (not always good). Compare what arrived with what you expect:

```
Unexpected = List.Difference(Table.ColumnNames(Source), Expected),
Missing    = List.Difference(Expected, Table.ColumnNames(Source))
```

Raise an error when either list is not empty, and check category values against the master list the same way.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Delta rejects a write whose schema does not match the table, unless someone has switched on `mergeSchema`. Leave automatic schema evolution off for governed tables, send unexpected columns to `_rescued_data`, and alert on it.

```sql
SELECT count(*) AS rows_with_unexpected_columns
FROM bronze.partner_reports
WHERE _rescued_data IS NOT NULL;
```

A change of *meaning* passes every schema check. Catch it with plausibility tests on the values.

</div>

## When it is fine

Announced, versioned changes are normal. The smell is the silence.
