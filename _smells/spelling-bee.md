---
title: Spelling bee
plain: One category spelled many ways
icon: spelling-bee
category: meaning
order: 13
symptom: Finance, finance, FIN, Fin. and Finance dept are all the same.
aka: [Inconsistent categories, Dirty labels]
search: [data standardisation, controlled vocabulary, reference data, mapping table, fuzzy matching, categorical consistency, trim and clean]
patterns: [master-list, data-here-logic-there]
---

`Finance`, `finance`, `FIN`, `Fin.`, `Finance dept`. All mean the same thing, and the data treats them as five.

## Signs and symptoms

- A pivot table or slicer shows near-duplicates.
- A category column has far more distinct values than there are real categories.
- Counts per category look too small.
- A lookup fails on values that look identical: one has a trailing space, a non-breaking space or a different case.

## Why it hurts

Grouping produces seven lines where there should be one, and each line understates the truth. The usual repair is a manual tidy-up before each report, redone next month.

It usually means that nobody owns the list.

## Treatment

Keep a reference table of allowed values, and a mapping table that translates historical variants to them. The mapping is data: visible, reviewable and reusable. Prevent new variants with a dropdown at entry.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Normalise the invisible differences first: `=TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), " ")))`. Then map:

```
=XLOOKUP([@department_raw], Map[variant], Map[department], "NO MATCH")
```

List the `NO MATCH` values, add them to `Map`, and put data validation on the entry column.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
Clean  = Table.TransformColumns(Source,
           {% raw %}{{"department_raw", each Text.Lower(Text.Trim(Text.Clean(_))), type text}}{% endraw %}),
Joined = Table.NestedJoin(Clean, {"department_raw"}, Map, {"variant"}, "m", JoinKind.LeftOuter),
Mapped = Table.ExpandTableColumn(Joined, "m", {"department"})
```

Add a check query for rows where `department` is null. Fuzzy merge can suggest candidates for the mapping table; do not let it decide matches unseen.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT r.*, m.department
FROM (SELECT *, lower(trim(department_raw)) AS department_key FROM bronze.requests) r
LEFT JOIN ref.department_map m ON m.variant = r.department_key;

-- New variants to add to the map
SELECT department_key, count(*) FROM mapped WHERE department IS NULL GROUP BY ALL;
```

</div>

## When it is fine

In a free-text field that is only read. Not in anything you group by.
