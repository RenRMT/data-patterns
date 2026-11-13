---
title: Fuzzy handshake
plain: Two datasets matched on free text
icon: fuzzy-handshake
category: identity
order: 18
symptom: We match them on organisation name.
aka: [Joining on names, Text-based lookup]
search: [fuzzy matching, record linkage, entity resolution, crosswalk table, join key, approximate lookup, deduplication]
patterns: [master-list, data-here-logic-there]
---

Two systems or files are linked by organisation name, department name or person name, because they share no code. Some rows match, some do not, and some match the wrong partner.

## Signs and symptoms

- Lookups return "not found" for records that clearly exist.
- A cleaning step exists only to make names match.
- Row counts drop after a merge, and nobody checked.
- A script holds a long list of `replace` rules or a similarity threshold.
- A lookup uses approximate match.

## Why it hurts

An exact match on text misses every spelling variant. A fuzzy match makes decisions nobody sees: at 85% similarity, "Save the Children Uganda" and "Save the Children Rwanda" are the same organisation. Either way the result cannot be checked, and it changes when a name does.

## Treatment

Make the matching decision once, by a person, and store it as data: a crosswalk table with the ID in system A beside the ID in system B. Fuzzy matching is useful for proposing candidate rows for that table. It should not run unattended inside the pipeline.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Build a `Crosswalk` tab (`name_in_finance`, `partner_id`) and look up through it. Always match exactly, and make failures visible:

```
=XLOOKUP([@partner_name], Crosswalk[name_in_finance], Crosswalk[partner_id], "NO MATCH", 0)
```

`VLOOKUP` without `FALSE` as its last argument matches approximately and returns plausible nonsense on unsorted data.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Merge through the crosswalk table, and list what did not match.

```
Unmatched = Table.NestedJoin(Finance, {"partner_name"}, Crosswalk, {"name_in_finance"},
                             "x", JoinKind.LeftAnti)
```

Use *Merge > Use fuzzy matching* in a separate helper query to suggest new crosswalk rows, then review and paste them into the table.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT f.*, x.partner_id
FROM silver.finance f
LEFT JOIN ref.partner_crosswalk x ON x.name_in_finance = f.partner_name;

-- Candidates for review, not for automatic use
SELECT f.partner_name, p.partner_name, levenshtein(lower(f.partner_name), lower(p.partner_name)) AS distance
FROM unmatched f CROSS JOIN silver.dim_partner p
WHERE levenshtein(lower(f.partner_name), lower(p.partner_name)) <= 3;
```

</div>

## When it is fine

In a one-off exploration, with the match rate reported. And as a suggestion tool feeding a reviewed crosswalk.
