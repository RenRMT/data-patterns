---
title: Data here, logic there
plain: Keep data and logic apart
icon: data-here-logic-there
group: move
order: 9
tier: 3
guarantee: Logic is visible and reviewable, and every correction keeps its original value and its reason.
symptom: Yellow means corrected.
question: Are data tables free of formulas, colour codes and untracked manual fixes?
first_step: Find one place where the team edits data directly to fix it, and replace that with a corrections tab.
aka: [Corrections log, Mapping table]
search: [separation of data and code, configuration as data, mapping table, lookup table, audit trail, parameter table, magic numbers]
---

## The problem

Formulas, hardcoded numbers and manual corrections are mixed into the data. A formula was overwritten by a typed number and nobody noticed. Yellow cells mean "corrected", but only to the person who coloured them. Values are fixed directly in the data, with no record of the original or the reason.

## The pattern

Data tables hold values only. Everything else gets its own visible place:

- **Calculations** live on a separate tab, query or script.
- **Constants** (a VAT rate, a threshold, a conversion factor) live in one parameters table with a name, a value, a unit and a date.
- **Mappings** ("FIN", "Fin." and "Finance dept" all mean Finance) live in a mapping table, not in nested IFs.
- **Corrections** are rows in a corrections log, applied during processing.

A corrections log has these columns: record ID, field, original value, corrected value, reason, corrected by, date.

Logic can then be read and reviewed. A correction keeps its original value and reason, and is reapplied automatically when the data is reloaded.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

No formulas in data tabs. Calculations sit on their own tab, constants on a `Parameters` tab as named cells, corrections on a `Corrections` tab applied by lookup:

```
=XLOOKUP([@record_id] & "|people",
         Corrections[record_id] & "|" & Corrections[field],
         Corrections[corrected_value],
         [@people])
```

`=[@amount] * vat_rate` can be updated in one place. `=B2*1.21` has to be found 400 times.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Merge the corrections table in as a query step, and replace nested `if` logic with a mapping table that people can maintain without opening the editor.

```
let
    Joined  = Table.NestedJoin(clean_reports, {"record_id"},
                               Corrections, {"record_id"}, "fix", JoinKind.LeftOuter),
    Opened  = Table.ExpandTableColumn(Joined, "fix", {"corrected_value", "reason"}),
    Applied = Table.AddColumn(Opened, "people_final",
                each if [corrected_value] = null then [people] else [corrected_value], Int64.Type)
in
    Applied
```

Keep both `people` and `people_final`, so the report can show how much was corrected.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Transformations are code. Corrections and mappings are reference tables, applied in the silver layer.

```sql
CREATE OR REPLACE TABLE silver.partner_reports AS
SELECT r.record_id,
       r.site_id,
       coalesce(c.corrected_value, r.people) AS people,
       r.people                              AS people_as_received,
       c.reason                              AS correction_reason
FROM silver.partner_reports_typed r
LEFT JOIN ref.corrections c
  ON c.record_id = r.record_id AND c.field = 'people';
```

Thresholds and rates belong in a `ref.parameters` table or job parameters, not as literals scattered through notebooks.

</div>

## When to bend it

A calculated column beside the data is fine in a working file that only you use. It becomes a problem when someone else sorts, pastes or imports that table.
