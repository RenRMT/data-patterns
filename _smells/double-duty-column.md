---
title: Double-duty column
plain: One column holding two kinds of information
icon: double-duty-column
category: meaning
order: 12
symptom: If it starts with an X, it's actually a refund.
aka: [Overloaded column, Mixed-purpose field]
search: [overloaded field, one column one concept, atomic values, column semantics, data profiling, parsing]
patterns: [plain-table, handshake-agreement]
---

A status field that also holds the reason. An ID field that sometimes reads `tbd, see comment`. An amount column where negative means something different for some rows. One column carries two concepts, and which one applies depends on the row.

## Signs and symptoms

- Reading a value correctly needs another column, or tribal knowledge.
- A column of numbers or codes contains the odd sentence.
- Values follow two different patterns: `OPEN`, `CLOSED`, `CLOSED - duplicate`.
- Rules start with "except when".

## Why it hurts

Every parser breaks on the exception. Filters miss rows (`= "CLOSED"` skips `CLOSED - duplicate`). The column cannot be given a type or a list of allowed values, so nothing can validate it.

## Treatment

One column, one concept. Split the second meaning into its own column (`status` and `closure_reason`; `amount` and `transaction_type`). Notes go in a `comment` column.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

```
status          =TRIM(TEXTBEFORE([@status_raw] & " - ", " - "))
closure_reason  =IFERROR(TRIM(TEXTAFTER([@status_raw], " - ")), "")
```

Then put a dropdown on `status` so the mix cannot come back.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
Split = Table.SplitColumn(Source, "status_raw",
          Splitter.SplitTextByEachDelimiter({" - "}, QuoteStyle.None, false),
          {"status", "closure_reason"})
```

Check the result with *Column distribution*: `status` should now have a handful of distinct values.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT trim(split_part(status_raw, ' - ', 1))            AS status,
       nullif(trim(split_part(status_raw, ' - ', 2)), '') AS closure_reason,
       try_cast(partner_ref AS BIGINT)                   AS partner_id,
       CASE WHEN try_cast(partner_ref AS BIGINT) IS NULL
            THEN partner_ref END                         AS partner_ref_note
FROM bronze.cases;
```

</div>

## When it is fine

Free-text fields are allowed to hold anything. The smell applies to columns that are filtered, joined or calculated on.
