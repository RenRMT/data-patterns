---
title: Final_v3_FINAL
plain: Many copies of a file, and no certainty which is current
icon: final-v3-final
category: process
order: 21
symptom: Use the one I e-mailed on Tuesday, not the one on the drive.
aka: [File forking, Versions in file names, The circulating workbook]
search: [version control, single source of truth, file versioning, version history, merge conflict, co-authoring]
patterns: [rehearsal-stage, single-home]
---

`budget_v3_final_FINAL_jan(2).xlsx`. Every edit produces a new file, every e-mail a new copy. Or one workbook does the rounds: five departments each fill in their part and someone stitches the copies together.

## Signs and symptoms

- File names contain `v2`, `final`, initials or dates of editing.
- The same file exists in e-mail, on the shared drive and on desktops.
- Two people edited different copies on the same day.
- "Which one is the latest?" is a normal question.

## Why it hurts

There is no single source of truth, and the copies drifting apart is only a matter of time. A correction lands in one copy. Merging them back is manual work with no way to check it. The name tells you someone *thought* it was final, not that it is.

## Treatment

One authoritative file at one address, with version history provided by the storage, not by the name. Changes are made in a working copy and released on purpose. Anyone who needs "a copy" gets a link or a view. Where several people contribute, they write into one shared table or form.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Store the file on SharePoint or OneDrive and share a link instead of an attachment. *File > Info > Version History* shows and restores earlier versions. Several people can edit at once; *Review > Allow Edit Ranges* keeps each team in its own block.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Publish the report to a workspace and share it from there. Colleagues who want their own analysis connect to the published semantic model instead of copying the `.pbix`. Keep the source file in one versioned place, or save as a project (`.pbip`) under Git.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Notebooks named `analysis_v2_copy` are the same smell. Put code in a Git folder and use branches. For tables, do not create `reports_v2` and `reports_new`: change the table through the pipeline and use `DESCRIBE HISTORY` to see what happened.

</div>

## When it is fine

A dated name on a file that is *meant* to be frozen: `2026-07-15_donor_report_Q2.xlsx` in a read-only folder is a snapshot, not a fork.
