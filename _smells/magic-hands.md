---
title: Magic hands
plain: A manual step in the middle of the process
icon: magic-hands
category: process
order: 22
symptom: And then someone just fixes the region codes.
aka: [Manual step in the middle, Paste as values, Untracked correction]
search: [manual intervention, reproducibility, human in the loop, key person dependency, bus factor, audit trail, mapping table]
patterns: [push-button-rerun, data-here-logic-there]
---

Somewhere between the source and the report, a person does something by hand: fixes codes, deletes test rows, pastes values over formulas, corrects "that one line that was wrong". It works because that person knows what to do.

## Signs and symptoms

- The process description contains "just" or "quickly".
- Running the report twice gives two answers.
- The report cannot be produced when one person is away.
- Calculations have been replaced by pasted values, and nobody remembers how they were made.
- Data was edited in the source file, with no record of the original.

## Why it hurts

A manual step is invisible, cannot be checked and is done slightly differently each time. It leaves the result without the recipe. It also hides a message: the source is not delivering what the user needs, and nobody has put the two in one room.

## Treatment

Ask what kind of step it is. If it is a **rule**, write it into the process. If it is a **judgement**, record each judgement as a row in a mapping table or corrections log, so it is applied the same way next time and someone can review it. Then tell the source, or you will make the same repair every month.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Write the steps down in order and have a colleague follow them. Replace hand edits with a `Corrections` tab (record ID, field, old value, new value, reason, who, when) applied by lookup, and replace paste-as-values clean-ups with Power Query steps that stay visible.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Every transformation is a named step in the *Applied Steps* list, so nothing happens off the record. A correction is a row in a table that the query merges in, not a value typed over in the source or a hand-edited *Replace Values* step per case.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Watch for ad hoc `UPDATE` statements run from a scratch notebook: the next rebuild of the table undoes them. Put the fix where the pipeline will reapply it.

```sql
INSERT INTO ref.corrections VALUES
  ('R-2026-0312', 'region_code', 'NRT', 'NORTH', 'Partner uses old code', 'analyst', current_date());
```

</div>

## When it is fine

Human judgement is often the right tool. The smell is judgement that leaves no trace.
