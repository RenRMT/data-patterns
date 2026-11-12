---
title: Name tag key
plain: Records identified by a name or another detail that changes
icon: name-tag-key
category: identity
order: 16
symptom: She got married, so now she's in there twice.
aka: [Unstable key, Natural key, No key at all]
search: [surrogate key, natural key, primary key, key stability, unique identifier, UUID, entity resolution]
patterns: [master-list]
---

Rows are identified by an e-mail address, a person's name, an organisation's name or a phone number. Or by nothing at all: the row number is the only way to point at a record.

## Signs and symptoms

- There is no ID column, or the "ID" is a name.
- A person appears twice after a change of name, address or employer.
- Two people share a name and their records merge.
- "Row 214" is how people refer to a record, until someone sorts the sheet.

## Why it hurts

People marry, organisations merge, addresses and e-mail change. When the identifying value changes, the link to everything recorded under the old value breaks, and history splits in two. Names and phone numbers are also personal data, which then gets copied into every table that needs to refer to the person.

## Treatment

Give each record a meaningless ID, assigned once and never changed or reused. Names, e-mail and the rest become ordinary attributes in the master list, free to change.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Add an `id` column filled with a running code typed as a value (`P-00042`), never `=ROW()`, which changes when the sheet is sorted. Check uniqueness: `=ROWS(UNIQUE(People[person_id])) = ROWS(People[person_id])`.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Do not create the key in the report: `Table.AddIndexColumn` hands out different numbers when the source order changes, so it is only safe for a single refresh. The ID has to come from the source or from a maintained master list. Test it:

```
IsUnique = Table.IsDistinct(People, {"person_id"})
```

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
CREATE TABLE silver.dim_person (
  person_key BIGINT GENERATED ALWAYS AS IDENTITY,
  source_person_ref STRING,
  full_name STRING,
  email STRING,
  CONSTRAINT pk_person PRIMARY KEY (person_key)
);
```

Insert new people with `MERGE` on the source reference, so an existing person keeps their key. `monotonically_increasing_id()` is not stable between runs.

</div>

## When it is fine

Codes that are designed to be stable and are maintained by an authority work well as keys: ISO country codes, P-codes, IATI organisation identifiers.
