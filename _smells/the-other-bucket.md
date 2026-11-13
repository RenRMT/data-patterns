---
title: The "other" bucket
plain: A list so tight that everything lands in "Other"
icon: the-other-bucket
category: intake
order: 33
symptom: Just pick Other.
aka: [Over-constrained form, Catch-all category]
search: [form design, catch-all category, category coverage, other specify, survey design, taxonomy maintenance]
patterns: [handshake-agreement, tripwire]
---

The opposite of free text everywhere. The form offers a short fixed list, reality does not fit it, and people choose "Other" or the nearest wrong answer.

## Signs and symptoms

- "Other" is the largest or fastest-growing category.
- One option is suspiciously popular: it is the first in the list.
- Real information ends up in a notes field, or nowhere.
- The list has not changed in years while the work has.

## Why it hurts

Information is lost at the moment of collection and cannot be recovered. The data looks clean and well-categorised, which is worse than looking messy, because nobody goes looking for what is missing.

## Treatment

Pair the list with an explanation field that is required when "Other" is chosen. Monitor the share of "Other", and when it passes an agreed level, read the explanations and extend the list. Someone owns the list and reviews it on a schedule.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Add an `other_specify` column and a check that it is filled when needed:

```
=SUMPRODUCT((Log[category] = "Other") * (Log[other_specify] = ""))
```

Watch the share with `=COUNTIF(Log[category], "Other") / ROWS(Log[category])`.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
Other share =
DIVIDE (
    CALCULATE ( COUNTROWS ( Log ), Log[category] = "Other" ),
    COUNTROWS ( Log )
)
```

Plot it per month on the data-quality page, with the most frequent `other_specify` texts beside it.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT date_trunc('month', submitted_at) AS month,
       avg(CASE WHEN category = 'Other' THEN 1.0 ELSE 0.0 END) AS other_share
FROM silver.requests
GROUP BY ALL
ORDER BY month;
```

Set an alert on the query for when the share passes the agreed threshold.

</div>

## When it is fine

A small, stable "Other" is healthy. It means the list covers most of reality and admits the rest.
