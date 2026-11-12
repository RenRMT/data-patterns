---
title: Just-in-case data
plain: Personal data collected, copied and kept without a need
icon: just-in-case-data
category: process
order: 31
symptom: Keep the names in, we might need them.
aka: [Data hoarding, Identifiers everywhere]
search: [data minimisation, purpose limitation, retention policy, pseudonymisation, PII, least privilege, GDPR, data protection impact assessment]
patterns: [travel-light]
---

Names, phone numbers, addresses and locations are collected because they might be useful, travel with the data into every analysis file, and stay on the drive long after the project closed.

## Signs and symptoms

- Analysis files contain columns that identify people and are never used.
- Sensitive files are sent as e-mail attachments.
- Nobody can say how many copies of a dataset exist, or who can open them.
- Folders from closed projects are still there.
- A published table has cells with one or two people in them.

## Why it hurts

Every copy is a place the data can leak from, and every extra field makes a leak worse. The people described bear the harm, and in the aid sector they are often the least able to respond to it. Holding data without a purpose is also against data protection law in most places.

## Treatment

Collect only what will be used. Split identifiers from analysis data and link them with a meaningless ID. Give access per person and per need. Set a deletion date when the data is collected, and delete on it. Suppress or merge small groups before publishing.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Search the headers for `name`, `phone`, `address`, `e-mail`, `GPS`. Move those columns to a restricted key file and leave only the ID. *File > Info > Inspect Workbook* finds hidden sheets and personal metadata before a file is shared.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Remove identifying columns in the first query step. Hiding a column in the model does not remove it: it is still in the file, and *Analyze in Excel* or an export can reach it. For small groups, show a measure only above a threshold:

```
People (safe) = IF ( [People] < 5, BLANK (), [People] )
```

</div>

<div class="stack" data-stack="databricks" markdown="1">

Tag personal columns so they can be found, mask them, and delete on schedule.

```sql
ALTER TABLE silver.beneficiaries ALTER COLUMN phone SET TAGS ('pii' = 'contact');
SELECT table_name, column_name
FROM system.information_schema.column_tags WHERE tag_name = 'pii';
```

Check that bronze, snapshots and exports follow the same retention as the table people look at.

</div>

## When it is fine

When there is a stated purpose, a legal basis, restricted access and an end date. Then it is not "just in case".
