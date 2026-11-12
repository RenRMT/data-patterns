---
title: Numbered twins
plain: The same column repeated with a number
icon: numbered-twins
category: shape
order: 4
symptom: What do we do with the fourth phone number?
aka: [Repeating groups]
search: [repeating groups, first normal form, one-to-many relationship, child table, unpivot]
patterns: [plain-table, grain-statement]
---

`phone1`, `phone2`, `phone3`. `contact_a` to `contact_e`. `child_1_age`, `child_2_age`. The same kind of value gets a row of numbered columns.

## Signs and symptoms

- Column names end in a number or a letter.
- Most of the later columns are empty.
- The fourth value does not fit, so it goes in a comment or is dropped.
- A search for one phone number has to look in three columns.

## Why it hurts

The table has a built-in maximum that reality will exceed. Every query and formula must name all the twins. Counting ("how many children in total?") means adding across columns, and nothing guarantees that `child_2` is empty when `child_1` is.

## Treatment

The repeated thing is an entity of its own. Give it a table with one row per value, the parent's ID, and a column for what distinguishes the values (type, order, date).

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Create a second Table, for example `Phones`, with `person_id`, `phone_type`, `phone`. Count per person with `=COUNTIFS(Phones[person_id], [@person_id])`. If a form needs the wide layout for entry, keep it as an entry sheet and build the long table from it.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
Long  = Table.UnpivotOtherColumns(Source, {"person_id"}, "slot", "phone"),
Clean = Table.SelectRows(Long, each [phone] <> null and [phone] <> "")
```

Unpivot drops nulls by itself; the filter also removes empty text. Relate the new table to the person table one-to-many.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
CREATE OR REPLACE TABLE silver.person_phone AS
SELECT person_id, slot, phone
FROM bronze.persons
  UNPIVOT (phone FOR slot IN (phone1, phone2, phone3));
```

`UNPIVOT` leaves out nulls by default.

</div>

## When it is fine

When the number is fixed by nature and each slot means something different: `address_line_1` and `address_line_2`, or a start and an end date.
