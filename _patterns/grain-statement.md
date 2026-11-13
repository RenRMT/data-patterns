---
title: Grain statement
plain: Say what one row represents
icon: grain-statement
group: structure
order: 2
tier: 2
guarantee: Totals and joins are safe, because everyone knows what is being counted.
symptom: Why does this add up to 140%?
question: Can everyone on the team say what one row represents?
first_step: Write the one-sentence grain statement for each dataset. Where the team cannot agree on it, you have found a problem.
aka: [Level of detail, Unit of observation]
search: [grain, granularity, fact table grain, unit of analysis, fan-out join, cardinality]
---

## The problem

Nobody has stated what one row represents. Tables at different levels get mixed in one sheet or joined to each other, and totals come out too high. A sheet holds one row per household for some partners and one row per person for others, and people argue about whether a number counts people, visits or services.

## The pattern

Every dataset has one grain, written down as a sentence:

> One row = one … per … .

- One row = one beneficiary (register)
- One row = one beneficiary per service per date (service log)
- One row = one site per month per indicator (partner report)

Data at a different grain goes in a different table. The grain decides what can safely be summed, counted and joined. Most double-counting comes from joining to a finer-grained table and then summing a column from the coarser one.

The columns that make a row unique at that grain are the natural place for a uniqueness check: if two rows share them, the grain statement is wrong or the data is.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Put the grain statement at the top of the data dictionary tab. Keep totals and subtotals out of data tabs. Test the grain with a helper column outside the table, or one check cell:

```
=SUMPRODUCT(--(COUNTIFS(Log[person_id], Log[person_id],
                        Log[service],   Log[service],
                        Log[date],      Log[date]) > 1))
```

The result is the number of rows that break the grain. It should be 0.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Each fact table sits at one grain. Relationships run from the "one" side of a master list to the "many" side of the fact, and totals are calculated by measures, never stored as rows.

```
// A check query: rows that appear more than once at the stated grain
let
    Grouped = Table.Group(ServiceLog, {"person_id", "service", "date"},
                          {% raw %}{{"rows", each Table.RowCount(_), Int64.Type}}{% endraw %}),
    Breaks  = Table.SelectRows(Grouped, each [rows] > 1)
in
    Breaks
```

A many-to-many relationship in the model view is usually a grain problem that has not been named yet.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Write the grain in the table comment and test it on every run.

```sql
COMMENT ON TABLE silver.service_log IS
  'Grain: one row = one person per service per date.';

-- Fails the job when the grain is broken
SELECT assert_true(count(*) = 0, 'service_log grain broken')
FROM (
  SELECT person_id, service, service_date
  FROM silver.service_log
  GROUP BY ALL
  HAVING count(*) > 1
);
```

Before joining two tables, compare the row count before and after. A join that adds rows has fanned out.

</div>

## When to bend it

A reporting table may be pre-aggregated to a coarser grain for speed. That is a second table with its own grain statement, derived from the detailed one.
