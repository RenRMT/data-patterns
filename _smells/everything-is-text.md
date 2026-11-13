---
title: Everything is text
plain: Dates, numbers and yes/no stored as text
icon: everything-is-text
category: meaning
order: 10
symptom: The SUM gives zero.
aka: [Stringly typed data, Numbers stored as text]
search: [data types, type casting, stringly typed, locale, decimal separator, date parsing, ISO 8601, schema on read]
patterns: [handshake-agreement, tripwire]
---

Dates are stored as text. Numbers carry thousands separators, currency signs or spaces. Yes/no is a mix of `Yes`, `Y`, `TRUE`, `1` and `x`. The values look right and behave wrong.

## Signs and symptoms

- Numbers align left; a green triangle sits in the cell corner.
- `SUM` returns 0, or skips some rows.
- Sorting puts `10-01` before `2-01`, and `100` before `20`.
- A lookup fails although the two values look identical.
- The same date reads as 3 April in one office and 4 March in another.

## Why it hurts

Sorting and arithmetic give wrong answers without an error. Dates such as `03/04/2026` are ambiguous between day-first and month-first. Decimal commas and points get swapped when a file crosses a border. Invisible characters (a trailing space, a non-breaking space, a line break) make equal-looking values unequal.

## Treatment

Give every column a type when the data is read, with the source's locale stated, and let the load fail loudly when a value does not fit. Agree ISO dates (`YYYY-MM-DD`) in the handover contract. Codes that you do not calculate with (postcodes, IDs) are text on purpose.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Detect with `=ISNUMBER(A2)` and `=LEN(A2)`. Convert numbers with `=VALUE(SUBSTITUTE(TRIM(CLEAN(A2)), CHAR(160), ""))`, dates with *Data > Text to Columns* (choose the date order in step 3). Fix it for good by importing through *Data > Get Data > From Text/CSV* instead of double-clicking the file.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Set types explicitly and say which locale the source uses (*Change Type > Using Locale*).

```
Typed  = Table.TransformColumnTypes(Source,
           {% raw %}{{"report_date", type date}, {"amount", type number}}{% endraw %}, "nl-NL"),
Broken = Table.SelectRowsWithErrors(Typed, {"report_date", "amount"})
```

Load `Broken` as a check query. Values that fail conversion become errors, and errors become blanks in the model unless you look for them.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Bronze may hold strings. Silver casts them, and counts what would not cast.

```sql
SELECT to_date(report_date, 'yyyy-MM-dd')                    AS report_date,
       try_cast(replace(amount, ',', '.') AS DECIMAL(12, 2)) AS amount,
       count_if(amount IS NOT NULL
                AND try_cast(replace(amount, ',', '.') AS DECIMAL(12, 2)) IS NULL)
         OVER ()                                             AS amounts_not_parsed
FROM bronze.reports;
```

`try_cast` returns null on failure; plain `CAST` raises an error in ANSI mode. Use the first to measure and the second to enforce.

</div>

## When it is fine

In the received layer, where keeping everything as text preserves exactly what arrived. And for codes: a postcode is text.
