---
title: Key with a backstory
plain: An ID with meaning built into it
icon: key-with-a-backstory
category: identity
order: 17
symptom: The first two letters tell you the country.
aka: [Smart key, Intelligent key, Composite code]
search: [smart key, intelligent key, surrogate key, composite key, key parsing, natural key]
patterns: [master-list]
---

`NL-SALES-2023-0042`. Each part means something: the country, the department, the year, a sequence number. The ID doubles as a description.

## Signs and symptoms

- People read attributes off the ID instead of looking them up.
- Formulas and queries cut the ID into pieces with `LEFT`, `MID` or `substring`.
- After a reorganisation, the ID says SALES and the record belongs to MARKETING.
- Proposals to "renumber everything".

## Why it hurts

An ID must never change, and the facts packed into it do. At the first reorganisation either the ID changes, which breaks every reference to it, or it stays and starts lying. Parsing rules spread through formulas and scripts, and each one breaks on the first ID that does not follow the format.

## Treatment

Use a meaningless ID, and keep the components as ordinary columns (`country`, `department`, `year`) in the master list. An existing smart key can stay as a label that people recognise; stop deriving anything from it.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Split the parts into columns once, with `=TEXTSPLIT([@code], "-")`, paste them as values, and from then on maintain the columns. Look attributes up by ID instead of cutting them out of it.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
Parts = Table.SplitColumn(Source, "code", Splitter.SplitTextByDelimiter("-"),
          {"country", "department", "year", "sequence"})
```

Do this in the query that builds the master list, keep the original `code` column beside the parts, and relate tables on the code as a whole.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT code,
       split_part(code, '-', 1) AS country_at_creation,
       split_part(code, '-', 2) AS department_at_creation
FROM bronze.projects;
```

Name the derived columns for what they are: the value when the code was issued. The current department comes from the dimension table.

</div>

## When it is fine

Check digits and prefixes that only say what kind of thing the ID refers to. And standard identifiers whose structure is fixed by their authority, such as an IBAN.
