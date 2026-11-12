---
title: Master list
plain: Stable IDs and one official list
icon: master-list
group: structure
order: 3
tier: 2
guarantee: Records match reliably, and a name fixed once is fixed everywhere.
symptom: Is KLA the same as Kampala?
question: Do sites, partners and people have IDs that come from one official master list?
first_step: Build the master list for the entity that causes the most matching pain, usually locations or partners, and turn its column into a dropdown in the entry templates.
aka: [Reference data, Lookup table]
search: [surrogate key, primary key, foreign key, dimension table, master data management, reference data, referential integrity, crosswalk table]
---

## The problem

Records are matched on names and free text, which are spelled differently in every file. "Kampala", "Kampala District" and "KLA" appear as three locations. The same person is counted twice because of a typo. Lookups fail without an error and rows vanish from reports, so every report needs a manual "fix the names" step.

## The pattern

Everything you count or report on (people, households, sites, partners, indicators, projects) gets a unique ID, assigned once, at the source. Its descriptive details live in one master list, and all other data refers to it by ID.

- The ID is meaningless: a number or code that says nothing about the thing. Never a name, phone number or national ID number.
- The master list has one row per thing, with the ID, the official name, attributes and an `active` flag. Retired entries are flagged, not deleted.
- Historical spellings go in a mapping table (`variant` to `id`), so the judgement "KLA means Kampala" is made once and stays visible.
- Use existing standards where they exist: official administrative boundary codes (P-codes), IATI organisation identifiers, ISO country codes.

IDs survive respelling, translation and reorganisation.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Keep a `master_lists` workbook with one tab per entity. Entry columns in other workbooks are dropdowns (*Data > Data Validation > List*) that point to the master list, and lookups go by ID:

```
=XLOOKUP([@site_id], Sites[site_id], Sites[site_name], "NO MATCH")
```

Count the `NO MATCH` results in a check cell. A lookup that returns 0 or blank on failure hides the problem.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Master lists are dimension tables. Add a query that lists the fact rows with no partner in the master list, instead of letting them drop out or land in a blank category:

```
let
    Unmatched = Table.NestedJoin(Reports, {"site_id"}, Sites, {"site_id"},
                                 "site", JoinKind.LeftAnti)
in
    Table.RemoveColumns(Unmatched, {"site"})
```

Show the row count of that query on a data-quality page. In the model, a blank row in a slicer means the same thing: fact rows that point at nothing.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Dimension tables carry declared keys, and a test looks for orphans. Key constraints in Unity Catalog are informational: they document the model and help the optimiser, but they are not enforced, so the test is still needed.

```sql
ALTER TABLE silver.dim_site ADD CONSTRAINT pk_site PRIMARY KEY (site_id);
ALTER TABLE silver.fact_report ADD CONSTRAINT fk_site
  FOREIGN KEY (site_id) REFERENCES silver.dim_site (site_id);

-- Orphans: report rows whose site is not in the master list
SELECT r.*
FROM silver.fact_report r
LEFT ANTI JOIN silver.dim_site s ON r.site_id = s.site_id;
```

</div>

## When to bend it

A one-off analysis of a single file does not need a master list. The moment a second file has to be matched to the first, it does.
