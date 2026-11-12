---
title: Single home
plain: Enter each fact once, at the source
icon: single-home
group: move
order: 5
tier: 2
guarantee: Every fact has one place where it is entered and corrected.
symptom: The two trackers don't agree.
question: Is each fact typed in once, in one place?
first_step: Pick one fact that is typed more than once, name its home, and replace the other copies with a link or query.
aka: [One version of the truth]
search: [system of record, single source of truth, source system, data entry at source, golden record]
---

## The problem

The same fact is typed into several places: the paper register, the field tracker, the partner report, the donor template. Two trackers disagree and nobody knows which is right. Staff spend days re-keying numbers from one file into another, and a correction is made in one copy and not the others.

## The pattern

Each fact has one home where it is entered and corrected, as close as possible to the event and to the person who knows it. Every other use reads from that home by link or query, never by retyping.

Each manual copy is a fresh chance for error and a second version of the truth. If five teams each fill in their part of a circulating workbook, the home is unclear by design: give them one form or one shared table instead.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

One entry workbook per dataset, on shared storage, or a form (Microsoft Forms, KoBo, ODK) that feeds one table. Other workbooks read from it with *Data > Get Data > From File > From Excel Workbook*, which brings the table in as a refreshable query instead of a pasted copy.

If several people must edit, use one co-authored file on SharePoint, with *Review > Allow Edit Ranges* to give each team its own block.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Reports query the single entry table. Nothing is typed into the report file: no *Enter data* tables holding real figures, no manual overrides.

```
let
    Source = Excel.Workbook(Web.Contents(EntryWorkbookUrl), null, true),
    Entry  = Source{[Item = "Entry", Kind = "Table"]}[Data]
in
    Entry
```

When a number in the report is wrong, the fix is made in the entry workbook and arrives with the next refresh.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Ingest straight from the source system or form platform, on a schedule. The lakehouse holds no hand-maintained copies of data that has a home elsewhere.

```python
(spark.readStream.format("cloudFiles")
    .option("cloudFiles.format", "csv")
    .option("cloudFiles.schemaLocation", "/Volumes/main/landing/_schemas/kobo")
    .load("/Volumes/main/landing/kobo_exports/")
    .writeStream
    .option("checkpointLocation", "/Volumes/main/landing/_checkpoints/kobo")
    .trigger(availableNow=True)
    .toTable("bronze.kobo_submissions"))
```

Small reference lists that people maintain by hand still need one home: a governed table or a single file that the pipeline reads, not a list pasted into a notebook.

</div>

## When to bend it

Offline data collection needs local copies. Treat them as temporary: they sync to the home, and the home wins.
