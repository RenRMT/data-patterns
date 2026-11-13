---
title: Handshake agreement
plain: Agree the shape at every handover
icon: handshake-agreement
group: trust
order: 10
tier: 3
guarantee: Problems are caught at the handover, where the sender can still fix them.
symptom: The partner changed the template again.
question: Do incoming files follow a fixed template that is checked on arrival?
first_step: Turn the most common partner submission into a locked template with validation and a one-page data dictionary.
aka: [Submission template, Data dictionary]
search: [data contract, schema, schema enforcement, schema validation, schema drift, schema evolution, interface agreement, data dictionary]
---

## The problem

Data arrives from partners, field offices or other teams in whatever layout the sender chose this time. A partner renames a column or adds a row, and the consolidation breaks without an error. Each sender's file needs its own custom cleaning. Dates arrive as text, numbers arrive with units, and blank means three different things.

## The pattern

Wherever data crosses a boundary between people, teams or organisations, agree a contract and check incoming data against it. Reject or flag what does not match, instead of calculating on.

A contract specifies:

- column names and order, fixed
- type and format per column
- allowed values (lists, ranges)
- how missing values are written, and the difference between zero and unknown
- the grain and the IDs used
- the deadline, and who to contact when a file fails
- how changes are announced: no new column and no new meaning for a code without notice

Consolidation is then the same for every source, and the sender hears about a problem while they can still fix it.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

A submission template with locked headers (*Review > Protect Sheet*), data validation and dropdowns on every entry column, and a data dictionary tab. Keep the dropdown lists on their own tab so they can be maintained; a list typed into the validation dialog cannot.

For anything collected repeatedly from many people, a digital form (KoBo, ODK, Microsoft Forms) enforces the contract better than a spreadsheet can.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Set column types explicitly, and stop the refresh when expected columns are missing instead of loading whatever arrived.

```
let
    Expected = {"site_id", "report_date", "indicator", "people"},
    Missing  = List.Difference(Expected, Table.ColumnNames(Source)),
    Checked  = if List.IsEmpty(Missing) then Source
               else error Error.Record("Contract broken",
                    "Missing columns: " & Text.Combine(Missing, ", ")),
    Typed    = Table.TransformColumnTypes(Checked,
                 {% raw %}{{"report_date", type date}, {"people", Int64.Type}}{% endraw %}, "en-GB")
in
    Typed
```

Remove the automatic *Changed Type* step that Power Query adds: it guesses from the first rows and hardcodes today's column names.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Declare the schema on ingestion. Delta tables reject writes that do not match the table schema, and Auto Loader can put unexpected columns in a rescue column instead of dropping them.

```python
schema = "site_id STRING, report_date DATE, indicator STRING, people INT"

(spark.readStream.format("cloudFiles")
    .option("cloudFiles.format", "csv")
    .option("header", True)
    .option("cloudFiles.schemaEvolutionMode", "rescue")
    .schema(schema)
    .load("/Volumes/main/landing/partner_reports/")
    .writeStream
    .option("checkpointLocation", "/Volumes/main/landing/_checkpoints/partner_reports")
    .trigger(availableNow=True)
    .toTable("bronze.partner_reports"))
```

Alert when `_rescued_data` is not null: that is a sender changing the shape. Rows that fail the contract go to a quarantine table with the reason, not into silver.

</div>

## When to bend it

You cannot impose a template on every source. For a source you do not control, the contract becomes a check on your side that raises the alarm when the shape changes.
