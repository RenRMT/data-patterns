---
title: Naked number
plain: A number without its unit or basis
icon: naked-number
category: meaning
order: 11
symptom: Is that in thousands?
aka: [Missing unit, Unlabelled measure]
search: [units of measure, column naming convention, data dictionary, currency conversion, semantic types, metadata]
patterns: [data-map, define-once]
---

A column called `amount`. In which currency? Gross or net? In units or in thousands? With or without tax? Kilograms or pounds? The number arrives without the information needed to use it.

## Signs and symptoms

- Column names are bare nouns: `amount`, `weight`, `budget`, `distance`.
- Values from different sources differ by a factor of 1,000, 1.21 or 2.2.
- Units appear inside cells for some rows (`25 kg`) and not others.
- Someone has to ask before using the number.

## Why it hurts

This is the most expensive silent error there is, because the arithmetic works. NASA lost the Mars Climate Orbiter in 1999 when one team's software produced impulse in pound-force seconds and another's read it as newton-seconds. In a budget sheet the same mistake is euros added to dollars.

## Treatment

Put the unit and basis in the column name (`revenue_eur_excl_vat`, `weight_kg`), or in a separate unit column when it varies per row. Record it in the data dictionary. Convert to one unit in the clean layer and keep the original beside it.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Rename the header and keep units out of the cells. If rows mix currencies, add a `currency` column and convert with a rates table:

```
=[@amount] * XLOOKUP([@currency], Rates[currency], Rates[eur_per_unit])
```

Use a number format to *show* a unit (`0 "kg"`) without storing it.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Rename columns in the query and put the unit in the measure name and description: `Budget (EUR, excl. VAT)`. Set the format string on the measure, and strip units from cells before typing:

```
Number = Table.TransformColumns(Source,
           {% raw %}{{"weight", each Number.FromText(Text.Trim(Text.Replace(_, "kg", ""))), type number}}{% endraw %})
```

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT r.record_id,
       r.amount                    AS amount_original,
       r.currency                  AS currency_original,
       r.amount * x.eur_per_unit   AS amount_eur
FROM silver.grants r
JOIN ref.exchange_rates x
  ON x.currency = r.currency AND x.rate_date = r.booking_date;
```

Add the unit to the column comment as well: catalog search then finds it.

</div>

## When it is fine

Plain counts of things named in the column (`people`, `visits`) carry their unit already.
