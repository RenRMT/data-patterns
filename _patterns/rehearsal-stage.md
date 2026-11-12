---
title: Rehearsal stage
plain: Change things safely, away from the audience
icon: rehearsal-stage
group: trust
order: 13
tier: 3
guarantee: Users never see work in progress, and any change can be undone.
symptom: FINAL_v3_edited.xlsx
question: Are changes made on a copy and released only after testing?
first_step: Stop putting version numbers in the name of one shared file, and show the team how to use version history instead.
aka: [Working copy, Test before release]
search: [version control, git, dev test prod environments, deployment pipeline, CI/CD, pull request, code review, change log, rollback]
---

## The problem

Changes are made directly in the files and reports people are using, with no way back. The director opens the dashboard mid-edit and sees broken numbers. Something broke after last month's change, and nobody knows what changed. The shared drive fills with `Final_v3_JD_edited_REAL.xlsx`, and nobody can say which one is current.

## The pattern

Work on a copy, test it, then replace the live version. Keep earlier versions and a short note of what changed.

- There is **one live version**, at one address, and everyone knows which it is.
- Changes happen **somewhere else**: a working copy, a test workspace, a branch.
- A change is **checked** before release: the checks pass, and the key totals match the live version or the difference is explained.
- Every release leaves a **note**: what changed, why, who, when.
- The previous version **can be restored**.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

One canonical file on SharePoint or OneDrive, using built-in version history (*File > Info > Version History*) instead of renamed copies. Edit structure and formulas in a working copy, compare its totals with the live file, then replace. Keep a `Change log` tab: date, who, what, why.

Whoever needs "a copy" gets a link or a read-only view, not a second source.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Separate development and production workspaces, or at the least a test copy of the report. Publish to production only after checking. Where it is available, deployment pipelines move content from development to test to production and show what differs between stages.

Use parameters for the source, so the same queries run against test data and live data. Saving as a Power BI project (`.pbip`) stores the report and model as text files, which makes changes visible in Git.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Development and production are separate catalogs or workspaces. Code lives in Git; changes arrive by pull request with a second person's review; jobs are deployed from the main branch.

```python
# One parameter decides where a run reads and writes
catalog = dbutils.widgets.get("catalog")   # "dev" or "prod"
spark.sql(f"USE CATALOG {catalog}")
```

If a release goes wrong, `RESTORE TABLE silver.partner_reports TO VERSION AS OF 41` puts a table back while you fix the code.

</div>

## When to bend it

A file that only you use can be edited in place, as long as version history is on. The pattern starts to matter when someone else depends on the output.
