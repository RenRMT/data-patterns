---
title: Push-button rerun
plain: Make processing repeatable
icon: push-button-rerun
group: move
order: 8
tier: 2
guarantee: The same input gives the same output, whoever runs it.
symptom: Only Sam knows how to do the report.
question: Could a colleague reproduce last month's report from the received files without asking you anything?
first_step: Write down the manual steps for one report, have a colleague follow them, then automate the steps that repeat most.
aka: [Reproducible processing]
search: [reproducibility, idempotency, deterministic pipeline, data pipeline, orchestration, bus factor, full refresh vs incremental]
---

## The problem

Data is consolidated and cleaned by hand every month: copy, paste, filter, fix, slightly differently each time. The monthly report takes three days and one person knows how. Rerunning last month's report gives a different number. When that person is on leave, reporting stops.

## The pattern

Processing gives the same output every time it runs on the same input, whoever runs it. Running it twice does no harm.

A repeatable process can be checked, handed over, fixed once and rerun. Where staff turnover is high, this is the strongest protection against lost capacity.

The test: could a colleague reproduce last month's report from the received files alone, without asking you anything?

Two kinds of manual step need different treatment. If the step is a rule ("region codes are upper case"), write the rule into the process. If it is a judgement ("this partner's 'North' means district 4"), record the judgement as a row in a mapping table, so it is reusable and reviewable.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

A written procedure with numbered steps, which a colleague has followed successfully without help. That is the minimum, and it counts.

Then replace the steps that repeat most. Moving the cleaning into Power Query inside Excel (*Data > Get Data*) turns "copy, paste, fix" into *Refresh All*. Paste-as-values is the opposite of this pattern: it keeps the result and destroys the recipe.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

All cleaning lives in Power Query, as named steps. Producing the report means pressing *Refresh*, with no manual edits after. Put file paths in parameters so a colleague can point the same queries at their own copy.

```
let
    Source  = Csv.Document(File.Contents(ReceivedFolder & "\2026-03_reports.csv"),
                           [Delimiter = ",", Encoding = 65001]),
    Headers = Table.PromoteHeaders(Source),
    Trimmed = Table.TransformColumns(Headers, {% raw %}{{"site_id", Text.Trim, type text}}{% endraw %}),
    Typed   = Table.TransformColumnTypes(Trimmed, {% raw %}{{"people", Int64.Type}}{% endraw %}, "en-GB")
in
    Typed
```

Rename steps to say what they do. `Trimmed` is documentation; `Custom1` is not.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Notebooks or jobs rebuild a table from its inputs, are versioned in Git, and run on a schedule. Write steps so that a second run leaves the same result: overwrite the whole table, or merge on the key.

```sql
MERGE INTO silver.partner_reports AS t
USING staged_reports AS s
  ON t.site_id = s.site_id AND t.report_month = s.report_month
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;
```

A plain `INSERT INTO` run twice doubles the data. That is the usual way a pipeline stops being repeatable.

</div>

## When to bend it

Automating a task done once is waste. A one-off that gets run a second time has become recurring, and that is the moment to write it down.
