---
title: Buried logic
plain: Rules and constants hidden where nobody looks
icon: buried-logic
category: process
order: 28
symptom: Column AF is hidden. It holds the correction factor.
aka: [Hardcoded values, Magic numbers, Hidden columns]
search: [magic numbers, hardcoded constants, parameter table, configuration, spreadsheet formula smells, named ranges, code review]
patterns: [data-here-logic-there]
---

`=B2*1.21` in four hundred cells. A formula in the middle of the source data. A hidden column with an adjustment. A filter three steps into a query that drops certain rows. The logic works, and nobody can see it.

## Signs and symptoms

- Numbers appear inside formulas or code: `1.21`, `0.15`, `> 5000`.
- A rate change means searching the whole workbook.
- A range stops short: `=SUM(B2:B500)` in a sheet that now has 700 rows.
- Formulas sit among typed values, and one of them has been overwritten.
- Hidden rows, columns or tabs take part in calculations.

## Why it hurts

A rule that cannot be seen cannot be reviewed or updated. When the VAT rate changes, some of the four hundred cells get missed. Ranges that do not grow leave data out without an error: an influential 2010 economics paper on debt and growth had to be corrected after reviewers found that an averaging formula skipped five countries.

## Treatment

Bring the logic into the open. Constants go in one parameters table with a name, a unit and a date. Calculations sit apart from data. Nothing that matters is hidden. Ranges are tables, which grow by themselves.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Put constants on a `Parameters` tab and name the cells (*Formulas > Define Name*): `=[@amount] * vat_rate`. Turn ranges into Tables so `=SUM(Sales[amount])` follows new rows. Find hardcoded numbers with *Home > Find & Select > Go To Special > Formulas*, and look for hidden sheets with *File > Info > Inspect Workbook*.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Use query parameters or a small parameters table for thresholds and rates. Name steps for what they do, so a filter is visible in the step list:

```
RemovedTestSites = Table.SelectRows(Typed, each not List.Contains(TestSites[site_id], [site_id]))
```

In DAX, declare constants once as a measure or variable instead of repeating the literal.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT r.*, r.amount * p.value AS amount_incl_vat
FROM silver.invoices r
JOIN ref.parameters p
  ON p.name = 'vat_rate'
 AND r.invoice_date >= p.valid_from
 AND (r.invoice_date < p.valid_to OR p.valid_to IS NULL);
```

A parameter with validity dates also answers "which rate applied last year?". Literals in a `WHERE` clause deep in a notebook are the same smell.

</div>

## When it is fine

Constants that are true by definition (12 months, 100 per cent) can stay where they are.
