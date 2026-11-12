---
title: Data map
plain: Make the flow and its owners visible
icon: data-map
group: care
order: 14
tier: 2
guarantee: Knowledge survives staff changes, and you can see what a change will affect.
symptom: Where does this number come from?
question: Is there a current data map, with a named owner and deputy for the dataset?
first_step: Draw the data flow for one programme on a single page with the team, and mark every step that depends on one person.
aka: [Data flow diagram, Data dictionary, Read-me tab]
search: [data lineage, data catalog, data dictionary, metadata, data ownership, data steward, provenance, impact analysis]
---

## The problem

Nobody has an overview of where data comes from, where it goes and who is responsible for each step. A key person leaves and nobody knows where the numbers come from. A source changes and nobody knows which reports are affected. New staff take months to understand the reporting process.

## The pattern

Keep a simple, current map of every source, processing step and output, and give each dataset a named owner and a deputy. Pair it with a data dictionary per dataset.

A data map lists, for each dataset:

- source, and how it arrives (form, email, export)
- frequency and grain
- where it is stored at each layer
- which outputs use it
- owner and deputy

A data dictionary lists, for each column: name, meaning, type, unit, allowed values, and how missing is written. Definitions carry a date and an owner, because "active client" will not mean the same thing in three years.

Each table also carries its own provenance: where each row came from and when it was loaded.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

A one-page boxes-and-arrows diagram and a data-map table in the project folder. In every workbook, a first tab called `Read me` with the owner, the source, the reference date, the column definitions, and what is and is not included. It takes five minutes and saves a reconstruction months later.

Write a handover note when an owner changes.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

*View > Query Dependencies* in the editor and the lineage view in the workspace draw the flow for you. Add what they cannot know: descriptions on tables, columns and measures (they appear as tooltips in the field list), and a named owner for the workspace.

Carry provenance in the data: keep a `source_file` column when combining files, and show the last refresh time on the report.

```
LastRefresh = #table(type table [last_refresh = datetimezone], {% raw %}{{DateTimeZone.UtcNow()}}{% endraw %})
```

</div>

<div class="stack" data-stack="databricks" markdown="1">

Unity Catalog records lineage between tables automatically. Add comments, tags and an owner, so the catalog answers "what is this and who do I ask?".

```sql
COMMENT ON TABLE silver.partner_reports IS
  'Monthly partner reports, typed and checked. Grain: one site per month per indicator. Source: bronze.partner_reports.';
ALTER TABLE silver.partner_reports ALTER COLUMN people
  COMMENT 'Unique people reached in the month. Null = not reported; 0 = none reached.';
ALTER TABLE silver.partner_reports SET TAGS ('owner' = 'mel-team', 'deputy' = 'data-team');
ALTER TABLE silver.partner_reports OWNER TO `mel-team`;
```

Every table keeps `_source_file` and `_loaded_at` columns from ingestion onwards.

</div>

## When to bend it

A map that is out of date misleads. Keep it small enough to maintain: one page per programme beats a complete catalogue nobody updates.
