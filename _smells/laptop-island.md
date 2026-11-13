---
title: Laptop island
plain: The only copy lives in one place
icon: laptop-island
category: process
order: 30
symptom: It was on her laptop.
aka: [Single copy, Personal storage]
search: [backup, single point of failure, 3-2-1 backup rule, shared storage, disaster recovery, shadow IT, row limit truncation]
patterns: [safety-net]
---

The working data sits on one laptop, a USB stick, a personal drive or an e-mail attachment. If that one place goes, so does the data.

## Signs and symptoms

- File paths start with `C:\Users\` or a personal cloud folder.
- Data arrives and leaves as e-mail attachments.
- A colleague's leaving date is also a data migration deadline.
- Nobody has ever restored a file from backup.
- Files are still saved as `.xls`.

## Why it hurts

A theft, a broken disk or a deleted account takes the data with it. Field data usually cannot be collected again. Personal storage is also outside the organisation's access control, which matters when the data is about people.

Loss can be partial and silent. The old `.xls` format stops at 65,536 rows: in 2020 that cut 15,841 COVID-19 cases out of Public Health England's daily reporting, with no warning.

## Treatment

Move working data to shared storage that the organisation controls, with backup and version history, and restore a file once to prove it works. Compare row counts whenever data moves between formats or systems.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Store files on a SharePoint or Teams site. Check for formulas that point at local paths with *Data > Edit Links* (or *Workbook Links*). Save as `.xlsx`. Where connectivity is poor, sync when online and keep an encrypted external copy.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Open *Transform data > Data source settings*: any source under `C:\` only refreshes on that machine. Move sources to SharePoint or a database, and publish reports to a team workspace instead of *My workspace*.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Files uploaded by hand to a personal workspace folder and notebooks that exist outside Git are islands too. Land files in a governed volume, keep code in a repository, and give tables a group as owner instead of a person.

</div>

## When it is fine

For scratch work you could recreate in an hour.
