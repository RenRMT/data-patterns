---
title: Overeager autocorrect
plain: The tool changed your values when it opened the file
icon: overeager-autocorrect
category: meaning
order: 15
symptom: The postcodes lost their zeros.
aka: [Automatic data conversion, Leading zeros lost, Scientific notation]
search: [automatic data conversion, type inference, leading zeros, scientific notation, 15 significant digits, gene name errors, schema inference]
patterns: [untouched-original, handshake-agreement]
---

Postcode `01234` became `1234`. An order number became `1.23457E+15`. `1-3` became 1 March and `SEPT2` became a date. Nobody typed these changes; the tool made them while opening the file.

## Signs and symptoms

- Codes of uneven length where all should be equally long.
- Long numbers ending in zeros.
- Dates in a column of codes.
- A phone number starting with `+` shows as an error or a formula.

## Why it hurts

The change is silent and often cannot be undone. Excel keeps 15 significant digits, so the last digits of a long number are replaced by zeros, not just hidden. If the file is then saved, the damage is written into the data. A 2016 study found gene names converted to dates in about a fifth of genomics papers with Excel gene lists. In 2020 the gene naming committee renamed 27 genes, partly so Excel would stop doing it.

## Treatment

A code is not a number, because you do not calculate with it. Import files with every column's type stated, codes as text. Never edit the received file. Ask senders for CSV with ISO dates, so the conversion is yours to control.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Do not open a CSV by double-clicking. Use *Data > Get Data > From Text/CSV*, choose *Transform Data* and set code columns to *Text*. Format entry columns as Text before typing. Recent versions can switch the behaviour off under *File > Options > Data > Automatic Data Conversion*. Lost digits cannot be restored by formatting: reimport from the original.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Delete the automatic *Changed Type* step and set types yourself. To stop it being added, turn off type detection under *Options > Data Load*.

```
Typed = Table.TransformColumnTypes(Promoted,
          {% raw %}{{"postcode", type text}, {"order_no", type text}, {"people", Int64.Type}}{% endraw %})
```

</div>

<div class="stack" data-stack="databricks" markdown="1">

Do not infer the schema for files that hold codes. State it, or read everything as strings into bronze.

```python
df = (spark.read.option("header", True)
        .schema("postcode STRING, order_no STRING, people INT")
        .csv("/Volumes/main/landing/orders/"))
```

`inferSchema` reads `01234` as an integer as readily as Excel does.

</div>

## When it is fine

Never for identifiers. For measurements typed by hand, automatic conversion is mostly what you want.
