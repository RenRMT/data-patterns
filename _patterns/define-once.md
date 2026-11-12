---
title: Define once
plain: One definition and one calculation per number
icon: define-once
group: structure
order: 4
tier: 3
guarantee: There is one official figure per indicator, and reports can only differ by their visible filters.
symptom: Which number is right?
question: Does each indicator have one written definition and one place where it is calculated?
first_step: Take the indicator that causes the most disagreement, write its reference sheet with the people who use it, and move its calculation to one place.
aka: [Single source of truth for metrics]
search: [semantic layer, metrics layer, measures, business glossary, KPI definition, conformed metrics, gold layer]
---

## The problem

The same indicator is calculated separately in several reports, each slightly differently. Three teams report three figures for "people reached". Meetings are spent reconciling numbers instead of discussing them, and nobody can say which figure is official.

Often each team was right to calculate it their way. The definitions differ because nobody put the teams in one room.

## The pattern

Each indicator has one written definition and one implementation, and every report uses that implementation. A change of definition then happens in one place, with a date.

An indicator reference sheet records:

- name, code and plain-language definition
- the exact calculation: numerator, denominator, what counts and what does not
- unit and disaggregations
- source dataset and its grain
- how double-counting is handled (unique people versus contacts)
- owner and date of last change

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Keep the reference sheets in one workbook, and one calculation workbook that all reports read from. Give each calculation a name with *Formulas > Define Name*, or a `LAMBDA` if it takes inputs:

```
people_reached
=COUNTA(UNIQUE(FILTER(Log[person_id], Log[service] <> "referral only")))
```

Reports then contain `=people_reached`, not their own copy of the logic.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Define measures in one shared semantic model and connect every report to it (*Get data > Power BI semantic models*). Put the definition in the measure's description, so it appears as a tooltip in the field list.

```
People reached =
CALCULATE (
    DISTINCTCOUNT ( ServiceLog[person_id] ),
    ServiceLog[service] <> "referral only"
)
```

Endorse the model as *Promoted* or *Certified* so people can tell it from a private copy.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Calculate the indicator once in a gold table or view, with the definition in the comment, and point every dashboard at it.

```sql
CREATE OR REPLACE VIEW gold.people_reached_monthly
COMMENT 'Unique people who received at least one service other than referral. Owner: MEL team. Definition v2, 2026-03-01.'
AS
SELECT site_id,
       date_trunc('month', service_date) AS month,
       count(DISTINCT person_id)         AS people_reached
FROM silver.service_log
WHERE service <> 'referral only'
GROUP BY ALL;
```

Unique counts do not add up across months or sites. If reports need other cuts, publish those cuts from the same logic instead of letting readers sum this one.

</div>

## When to bend it

Exploratory work may try out alternative definitions. Label them as such, and move the winner into the shared place before anyone reports it.
