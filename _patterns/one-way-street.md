---
title: One-way street
plain: Data flows one way through layers
icon: one-way-street
group: move
order: 7
tier: 2
guarantee: Each step has one job, so a wrong number can be traced to the step that made it.
symptom: Don't touch that tab.
question: Are received, clean and reporting data kept apart, with links running one way?
first_step: Split your most important report into a clean data file and a separate report file that reads from it.
aka: [Layered architecture, Received / clean / reporting]
search: [medallion architecture, bronze silver gold, staging layer, data mart, layered architecture, directed acyclic graph, separation of concerns]
---

## The problem

Raw data, cleaning, calculations and the final report live in one workbook, often on one tab. Changing a chart breaks a calculation. Nobody can tell inputs from calculated numbers. The "master file" has 40 tabs and one person who dares to touch it.

The root of it is one sheet playing three roles at once: entry form, storage and report.

## The pattern

Separate the work into three layers. Each reads from the one before and never writes back.

| Layer | Holds | Rule |
| --- | --- | --- |
| Received | Data exactly as it arrived | Nobody edits here |
| Clean | Standardised, checked, joined to master lists | Nobody types here; it is rebuilt from received |
| Reporting | Agreed indicators, shaped for one use | Nobody stores data here |

A wrong number can then be traced to the source, the cleaning or the indicator logic. Several reports can share one clean dataset instead of each cleaning their own.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Folders `01_received`, `02_clean`, `03_reporting`. Within one workbook, at the very least separate tabs per layer with names that say which is which (`in_`, `calc_`, `out_`), and formulas that only point backwards.

Check the direction with *Formulas > Trace Dependents* on an input cell: the arrows should only lead towards the report.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Staging queries with *Enable load* switched off read the source. Clean queries reference the staging queries and load to the model. Measures and report pages sit on top. *View > Query Dependencies* draws the flow; it should read left to right with no query feeding itself through a loop of merges.

```
// clean_reports references the staging query, never the file
let
    Source = stg_reports,
    Typed  = Table.TransformColumnTypes(Source,
               {% raw %}{{"report_date", type date}, {"people", Int64.Type}}{% endraw %}, "en-GB")
in
    Typed
```

</div>

<div class="stack" data-stack="databricks" markdown="1">

Bronze, silver and gold schemas, with one notebook or pipeline step per table. A step reads only from the layer before it.

```sql
CREATE OR REPLACE TABLE silver.partner_reports AS
SELECT try_cast(site_id AS STRING)         AS site_id,
       to_date(report_date, 'yyyy-MM-dd')  AS report_date,
       try_cast(people AS INT)             AS people,
       _source_file, _loaded_at
FROM bronze.partner_reports;
```

The lineage graph in Catalog Explorer shows whether the flow really is one-way.

</div>

## When to bend it

A quick question answered once does not need three folders. It does need the received file left alone, which is the first layer.
