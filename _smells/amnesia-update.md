---
title: Amnesia update
plain: Overwriting a value and losing its history
icon: amnesia-update
category: process
order: 24
symptom: What was the status before it was closed?
aka: [Destructive update, Overwrite in place]
search: [slowly changing dimension, SCD type 2, event sourcing, change data capture, audit log, temporal table, append-only]
patterns: [freeze-frame, untouched-original]
---

A status changes from `open` to `closed` by typing over it. A partner's region is updated in place. The current value is right, and what it used to be is gone.

## Signs and symptoms

- Questions about duration cannot be answered: how long was it open?
- Last year's report cannot be reproduced, because the categories have moved.
- Figures for past periods change when someone updates a master list.
- "Who changed this, and when?" has no answer.

## Why it hurts

The course of events disappears. Anything that depends on how things *were* (a past report, a trend, an audit) is recalculated with today's values and comes out different.

## Treatment

When the history matters, add instead of overwrite. Either keep a log with one row per change (what, from, to, when, who), or give each version of a record a validity period. Decide per column whether history matters; for a corrected typo it does not.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Keep a `Status log` Table: `case_id`, `status`, `changed_on`, `changed_by`. The current status is the latest row per case:

```
=XLOOKUP(MAXIFS(Log[changed_on], Log[case_id], [@case_id]),
         IF(Log[case_id] = [@case_id], Log[changed_on]), Log[status])
```

Version history shows that a cell changed. It will not give you a table of changes.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

A refresh replaces the data, so history has to arrive from the source as rows. Model it as a table of versions with `valid_from` and `valid_to`, and relate facts to the version that was valid on the fact's date. If the source overwrites, save dated extracts and combine them.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Keep versions with validity dates (slowly changing dimension type 2). Declarative pipelines build this from a feed of changes; by hand it is a `MERGE` that closes the old row and inserts the new one.

```sql
SELECT * FROM silver.dim_partner
WHERE partner_id = 'P-014'
  AND DATE'2025-06-30' >= valid_from
  AND (DATE'2025-06-30' < valid_to OR valid_to IS NULL);
```

The change data feed and `DESCRIBE HISTORY` help for recent changes; neither is a long-term record.

</div>

## When it is fine

For fixing errors, where the wrong value has no meaning worth keeping. Even then, the corrections log remembers.
