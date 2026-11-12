---
title: Free-text free-for-all
plain: A text box where a list belongs
icon: free-text-free-for-all
category: intake
order: 32
symptom: Forty-seven spellings of one department.
aka: [Unvalidated entry, No data validation]
search: [data validation, controlled vocabulary, dropdown list, input constraints, enumerated type, data entry design, reference data]
patterns: [master-list, handshake-agreement]
---

The form or sheet lets people type anything into a field that has a limited set of right answers: a department, a district, a status, a yes or no.

## Signs and symptoms

- A category column where nearly every value is unique.
- Typing errors, abbreviations and three languages in one column.
- A clean-up of the same field before every report.
- No dropdown, no validation rule, no error message on entry.

## Why it hurts

Each person spells the answer their own way, and the cleaning happens downstream, again and again. Repairing at entry is cheaper than repairing in storage, which is cheaper than in the pipeline, which is cheaper than in the report: each step later multiplies the cost and the number of people who need to know about the fix.

## Treatment

Offer a list of managed values, fed from the master list. Add an input hint and a clear error message. Keep the list on its own maintained tab or table, so it can change without rebuilding the form.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

*Data > Data Validation > List*, with the source pointing at a named range on a `Lists` tab, for example `=INDIRECT("Departments[department]")`. Add an *Input Message* and an *Error Alert* set to Stop. A list typed straight into the dialog cannot be maintained. Note that pasting over a cell bypasses validation, so keep a check as well.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Power BI does not collect data, so validate where it is entered: a form, a SharePoint list with choice columns, or a locked template. In the report, show a count of values that are not in the master list, so the entry problem stays visible to the people who can fix it.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Enforce the list where data lands in silver.

```sql
ALTER TABLE silver.requests
  ADD CONSTRAINT status_allowed CHECK (status IN ('open', 'in progress', 'closed'));
```

For long lists, test against the reference table and send non-matching rows to quarantine, then report them back to the source.

</div>

## When it is fine

For names, descriptions and explanations. Free text is right when the answer really is open.
