---
title: Tripwire
plain: Check before you trust
icon: tripwire
group: trust
order: 11
tier: 2
guarantee: Errors are found by a written check or a second reader, before the audience finds them.
symptom: The donor spotted it.
question: Are written checks run, and a second person's review done, before numbers go out?
first_step: List the three errors that embarrassed the team most in the past year and turn each into a check.
aka: [Data quality checks, Four-eyes review]
search: [data quality tests, expectations, assertions, data validation, reconciliation, anomaly detection, data observability, peer review]
---

## The problem

Data quality is checked by eye, if at all, and errors are found by the people reading the report. A site reports 12,000 beneficiaries instead of 1,200 and it reaches the dashboard. Duplicate submissions inflate a quarter's figures. Checks happen only when someone has time.

## The pattern

Write down the rules the data must pass, run them every time new data arrives, and treat a failure as a stop, not a note. Before figures leave the team, a second person reviews them.

Written checks catch the same errors every time. A second reviewer catches what the author cannot see: in spreadsheet research, a lone reviewer found about half of the errors and a group about 80%. Every error that gets through becomes a new check.

| Check | Example rule |
| --- | --- |
| Completeness | Every expected site has submitted for the month |
| Uniqueness | No duplicate IDs at the grain |
| Validity | Values fall within allowed ranges and lists |
| Consistency | Disaggregations sum to the total (female + male = total) |
| Referential integrity | Every site ID exists in the master list |
| Plausibility | Change against last period is under an agreed threshold, or it is investigated |
| Reconciliation | Rows and totals out of each layer match what went in, or the difference is explained |

An error must stay visible until someone deals with it. A check that turns a failed lookup into a zero is the opposite of a tripwire.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

A `checks` tab with one formula per rule, each showing PASS or FAIL, and a summary cell at the top that conditional formatting turns coral when anything fails. A named reviewer signs off before submission.

```
Uniqueness   =IF(ROWS(UNIQUE(Reports[record_id])) = ROWS(Reports[record_id]), "PASS", "FAIL")
Consistency  =IF(SUMPRODUCT(--(Reports[female] + Reports[male] <> Reports[total])) = 0, "PASS", "FAIL")
No errors    =IF(SUMPRODUCT(--ISERROR(Reports[people])) = 0, "PASS", "FAIL")
Orphans      =IF(SUMPRODUCT(--(COUNTIF(Sites[site_id], Reports[site_id]) = 0)) = 0, "PASS", "FAIL")
```

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Check queries output the problem rows, and a data-quality page in the report shows their counts. For a first look, switch on *View > Column quality* and *Column profile* in the Power Query editor.

```
// Rows where the disaggregation does not sum to the total
let
    Breaks = Table.SelectRows(clean_reports, each [female] + [male] <> [total])
in
    Breaks
```

To make a failure stop the refresh, raise an error when a check query is not empty: `if Table.IsEmpty(Breaks) then clean_reports else error "Consistency check failed"`.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Constraints reject bad writes on the table itself. Expectations in a declarative pipeline (Lakeflow Declarative Pipelines, formerly Delta Live Tables) warn, drop or fail per rule.

```sql
ALTER TABLE silver.partner_reports
  ADD CONSTRAINT people_plausible CHECK (people BETWEEN 0 AND 100000);

-- In a declarative pipeline
CREATE OR REFRESH MATERIALIZED VIEW silver_reports (
  CONSTRAINT has_site       EXPECT (site_id IS NOT NULL)        ON VIOLATION FAIL UPDATE,
  CONSTRAINT sums_to_total  EXPECT (female + male = total)      ON VIOLATION DROP ROW
) AS SELECT * FROM bronze_reports;
```

Add a reconciliation step that compares row counts and totals between layers, and require a second person's review on code changes.

</div>

## When to bend it

A check that fails every run and is ignored every run is worse than none. Remove it or fix the cause.
