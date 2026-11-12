---
title: Twice-told fact
plain: The same fact collected or typed in two places
icon: twice-told-fact
category: intake
order: 35
symptom: The two trackers don't agree.
aka: [Double entry, Re-keying, Duplicate collection]
search: [system of record, single source of truth, double data entry, data duplication, redundancy, reconciliation, data silos]
patterns: [single-home]
---

The same fact is recorded in the paper register, the field tracker, the partner report and the donor template. Or two forms from two teams ask the same people the same question.

## Signs and symptoms

- Staff copy figures from one file into another.
- Two files that should agree do not.
- A correction is made in one place only.
- Respondents complain of being asked the same thing twice.
- A reconciliation exercise before each reporting deadline.

## Why it hurts

Each retyping is a fresh chance of error, and a second copy is a second version of the truth. When the copies disagree, working out which is right costs more than the entry saved. The people filling it in pay for the duplication with their time.

## Treatment

Name one home for each fact, as close as possible to where it happens. The other places stop collecting it and read from the home, by link or query. Where two systems must both hold it, one is the source and the other is fed from it automatically.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Replace the retyped copy with a query on the home workbook (*Data > Get Data > From File > From Excel Workbook*). Until then, measure the disagreement:

```
=SUMPRODUCT(--(XLOOKUP(TrackerA[id], TrackerB[id], TrackerB[people], -1) <> TrackerA[people]))
```

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Connect the report to the home and remove any manually maintained copy, including *Enter data* tables. While two sources still exist, a full outer merge on the ID shows where they differ:

```
Both = Table.NestedJoin(TrackerA, {"id"}, TrackerB, {"id"}, "b", JoinKind.FullOuter)
```

</div>

<div class="stack" data-stack="databricks" markdown="1">

Declare which source wins per field, and report the conflicts instead of resolving them silently.

```sql
SELECT coalesce(a.id, b.id) AS id, a.people AS people_tracker_a, b.people AS people_tracker_b
FROM silver.tracker_a a
FULL OUTER JOIN silver.tracker_b b ON a.id = b.id
WHERE a.people IS DISTINCT FROM b.people;
```

</div>

## When it is fine

Deliberate double entry as a quality control, where two people key the same paper forms and the differences are checked. That is a test, and it ends in one record.
