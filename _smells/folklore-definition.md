---
title: Folklore definition
plain: A term everyone uses and nobody has written down
icon: folklore-definition
category: process
order: 25
symptom: Depends who you ask.
aka: [Undocumented definition, Competing figures]
search: [business glossary, semantic layer, metric definition, data dictionary, metadata management, conformed dimensions, definition drift]
patterns: [define-once, data-map]
---

"Active client". "People reached". "Completed". The words are in every report, and their meaning is passed on by word of mouth. In 2022 the term meant something different, and nobody wrote down when it changed.

## Signs and symptoms

- Two teams report different figures under the same name.
- A definition is explained differently by each person asked.
- A trend line has a jump that matches a change of staff, not a change in the world.
- Column names need a guided tour.

## Why it hurts

Figures cannot be compared across teams or across time. People defend their number in meetings instead of discussing what it shows. A new colleague rebuilds the calculation from a guess and creates a third version.

Often both teams were right: they are held to different targets, and each calculated the figure in the way that fits theirs.

## Treatment

Write the definition next to the thing it defines, with a date and an owner. When a definition changes, keep the old one with its end date. Where two teams need different numbers, give them two names.

The quickest test: compare one total with a figure the department itself uses. If they differ, you have found a difference in definition, and that is the most useful finding of the day.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

A `Read me` tab with one row per column and indicator: name, definition, what counts and what does not, unit, owner, valid from. Use *Data Validation > Input Message* to show the definition where people type.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Fill in the *Description* of every measure, column and table in the model view; it shows as a tooltip in the field list. Put definitions on an "About this report" page too, and keep measures in one shared semantic model so there is one version to describe.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
COMMENT ON COLUMN gold.clients.is_active IS
  'True when the client received at least one service in the past 90 days. Definition v3, valid from 2026-01-01. Owner: programme team.';
```

Comments are searchable in Catalog Explorer. Keep earlier definitions in the repository's change history or a `ref.definitions` table with validity dates.

</div>

## When it is fine

For exploratory terms that are still being worked out, as long as they stay out of reports.
