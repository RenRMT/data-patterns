---
title: Safety net
plain: Protect against loss
icon: safety-net
group: care
order: 15
tier: 2
guarantee: Any file can be restored, and someone has proved it.
symptom: It was on her laptop.
question: Is the data on backed-up shared storage, and has anyone tried restoring a file?
first_step: List where each key dataset physically lives, move anything on a personal device to the team site, and try restoring last week's version of one file.
aka: [Backup, Shared storage]
search: [backup, 3-2-1 backup rule, durability, disaster recovery, restore test, version history, redundancy]
---

## The problem

The only copy of working data sits on one laptop, a USB stick or an email attachment. A stolen or broken laptop takes a year of data with it. A file is overwritten or corrupted and there is no earlier copy. Someone leaves, and their files leave with their account.

Field data is often impossible to collect again, so the loss is permanent.

## The pattern

Working data lives in shared, backed-up storage that the organisation controls, with version history. Someone has tested that a file can actually be restored: a backup that has never been restored is a hope.

For anything that cannot live there, keep three copies, on two kinds of storage, one of them off-site.

Loss also happens without anyone noticing. In 2020 Public Health England left 15,841 COVID-19 cases out of its daily reporting because results were imported into the old `.xls` format, which stops at 65,536 rows. Nothing warned anyone. A row count compared between source and destination would have.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Files live on a SharePoint or Teams site, not on desktops or personal drives. Offices with poor connectivity sync when online and keep an encrypted external copy. Save as `.xlsx`, never `.xls`.

Once, deliberately, restore last week's version of a file (*File > Info > Version History*) to prove it works and that people know how.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Source files and the `.pbix` or project files are on shared storage. Reports are published to a workspace owned by a team, not passed round as files or left in *My workspace*, which goes when the account goes.

Keep the report file itself under version history or in Git: the published report can be downloaded again in most cases, but not in all.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Managed cloud storage is redundant by default. Code is in Git, so a workspace can be rebuilt. Table history covers accidental deletes and bad writes for a limited time:

```sql
DESCRIBE HISTORY silver.partner_reports;
RESTORE TABLE silver.partner_reports TO VERSION AS OF 41;
UNDROP TABLE silver.partner_reports;   -- within the retention period
```

Compare row counts between layers on every run, so truncation shows up as a failed check instead of a missing fortnight.

</div>

## When to bend it

Never for personal data or data that cannot be collected again. Scratch files you could recreate in an hour do not need three copies.
