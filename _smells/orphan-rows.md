---
title: Orphan rows
plain: References to things that do not exist
icon: orphan-rows
category: identity
order: 20
symptom: Some rows just drop out of the report.
aka: [Broken references, Dangling codes]
search: [referential integrity, foreign key, orphan records, anti join, inner join data loss, unknown member]
patterns: [master-list, tripwire]
---

A report row points at a site code, department or client that appears in no master list. The reference leads nowhere.

## Signs and symptoms

- The detail adds up to more than the report shows.
- A "(Blank)" category appears in a chart or slicer.
- Lookups return `#N/A`, or 0 where `IFERROR` hides it.
- Codes exist in the data that nobody recognises.

## Why it hurts

Orphans disappear without an error. A join that only keeps matches drops them, and the total shrinks by an amount nobody is looking for. Or they are kept and gather under "blank", where they are ignored.

## Treatment

Check on every load that each reference exists in its master list, and list the ones that do not. Then decide per case: add the missing entry to the master list, correct the reference, or assign it to an explicit "unknown" entry so the row still counts.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

```
=SUMPRODUCT(--(COUNTIF(Sites[site_id], Reports[site_id]) = 0))
```

That counts the orphans; it should be 0. Find them with a helper column `=COUNTIF(Sites[site_id], [@site_id]) = 0` and a filter. Prevent them with a dropdown fed by the master list.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
Orphans = Table.NestedJoin(Reports, {"site_id"}, Sites, {"site_id"}, "s", JoinKind.LeftAnti)
```

In the model, fact rows without a partner land on a blank row of the dimension. Do not hide it. And only tick *Assume referential integrity* when a check proves it: that option switches to inner joins, which drop the orphans.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT r.site_id, count(*) AS rows_without_site
FROM silver.fact_report r
LEFT ANTI JOIN silver.dim_site s ON r.site_id = s.site_id
GROUP BY r.site_id;
```

Foreign key constraints in Unity Catalog are not enforced, so this query is the enforcement. Run it as a test that fails the job, and use `LEFT JOIN` in the pipeline so unmatched rows survive.

</div>

## When it is fine

Briefly, when facts arrive before their master data. Park them under an "unknown" entry and resolve them when the master list catches up.
