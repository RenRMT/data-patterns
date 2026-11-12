---
title: Asking for the answer
plain: Collecting a result instead of its ingredients
icon: asking-for-the-answer
category: intake
order: 34
symptom: Just ask them for the total.
aka: [Collecting derived data, Age instead of date of birth]
search: [atomic data, derived data, raw vs aggregated collection, data collection design, disaggregation, lowest level of detail]
patterns: [single-home, define-once]
---

The form asks for age instead of date of birth, a total instead of its parts, a percentage instead of numerator and denominator, "eligible: yes/no" instead of the facts that decide eligibility.

## Signs and symptoms

- Ages that are out of date a year later.
- Totals that do not equal the sum of the parts collected beside them.
- Percentages with no way to recombine them across sites.
- Each respondent applied the rule slightly differently.

## Why it hurts

A derived value freezes at the moment of entry and hides how it was reached. Each person calculates it their own way, so the definition varies by respondent. And the ingredients are gone: you cannot re-cut a total by sex, or average percentages correctly, without them.

## Treatment

Collect the atoms and derive the rest in one place, with one rule. Ask for date of birth, the parts, the numerator and the denominator. If respondents need to see the total, let the form calculate and display it.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

In an entry template, calculated cells are locked formulas, not entry fields:

```
total   =[@female] + [@male]
age     =DATEDIF([@birth_date], [@visit_date], "y")
```

Calculate age at a stated date (the visit), not at `TODAY()`, when the age at the event is what matters.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Bring in numerators and denominators and divide in a measure, so the ratio is right at every level of the report:

```
Coverage = DIVIDE ( SUM ( Reports[people_reached] ), SUM ( Reports[people_targeted] ) )
```

An imported percentage column can only be averaged, and an average of percentages is rarely the percentage you want.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Where a source insists on sending both parts and total, keep the parts, recompute, and use the delivered total as a check.

```sql
SELECT *, female + male AS total_calculated,
       total_reported <> female + male AS total_mismatch
FROM silver.reports;
```

</div>

## When it is fine

When the atoms are too sensitive or too costly to collect. An age band is a reasonable trade for not holding dates of birth. Make that choice on purpose.
