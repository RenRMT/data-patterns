---
title: Freeze frame
plain: Freeze what you report
icon: freeze-frame
group: trust
order: 12
tier: 3
guarantee: Any past report can be reproduced, and any change since then can be explained.
symptom: Why is Q2 different now?
question: Is a dated, read-only copy saved of everything you report?
first_step: At the next submission, save the report and the exact data behind it in a dated, read-only folder.
aka: [Snapshot, Cut-off date]
search: [snapshot, point-in-time, time travel, slowly changing dimension, SCD type 2, event log, restatement, reporting cut-off, audit trail]
---

## The problem

Data keeps changing after it is reported, through late submissions and corrections, and nobody kept what was reported. "Why is Q2 different now from what we sent in July?" Cumulative figures do not add up across reports, and the annual report cannot be traced back to the quarterly ones.

The same loss happens at row level when a status is overwritten: the current value survives and the history is gone.

## The pattern

Each time numbers leave the team, save a dated, read-only snapshot of the output and the clean data behind it.

- Set a **cut-off date** for each period.
- Data arriving after it goes into a **logged restatement**, not a silent overwrite: what changed, by how much, why.
- Where the history of a record matters (status, assignment, price), add rows instead of overwriting: either a log of events, or a validity period on each version (`valid_from`, `valid_to`).

Late corrections are normal. A snapshot lets you show exactly what changed and why.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

A `04_submitted` folder holding `YYYY-MM-DD_donor_report_Q2` with the report and its data, marked read-only, plus a restatement log tab: period, figure, old value, new value, reason, date.

Save the snapshot as a separate file. Version history is for recovery; it is not a record of what was sent, and it expires.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

A semantic model shows the data as of its last refresh and keeps no history of its own. To freeze a report, export the clean table at each reporting date into a `snapshots` folder, and read that folder back with a snapshot date on every row:

```
let
    Files  = Folder.Files(SnapshotFolder),
    Dated  = Table.AddColumn(Files, "snapshot_date",
               each Date.FromText(Text.Start([Name], 10)), type date),
    Data   = Table.AddColumn(Dated, "data", each Csv.Document([Content])),
    Kept   = Table.SelectColumns(Data, {"snapshot_date", "data"})
in
    Kept
```

A slicer on `snapshot_date` then answers "what did we report in July?" next to "what do we know now?".

</div>

<div class="stack" data-stack="databricks" markdown="1">

Write explicit snapshot tables for anything you must be able to reproduce later.

```sql
INSERT INTO gold.people_reached_snapshots
SELECT current_date() AS snapshot_date, 'Q2 donor report' AS purpose, *
FROM gold.people_reached_monthly;

-- Short-term recovery only
SELECT * FROM gold.people_reached_monthly TIMESTAMP AS OF '2026-07-15';
```

Delta time travel is for recovery, not for records: table history is cleaned up over time (by default the log is kept for 30 days and removed data files for 7). For row-level history, keep versions with validity dates (slowly changing dimension type 2) or switch on the change data feed.

</div>

## When to bend it

Internal working figures that nobody acts on do not need snapshots. Anything sent outside the team, or used to make a decision, does.
