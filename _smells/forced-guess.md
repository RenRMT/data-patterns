---
title: Forced guess
plain: A required field with no way to say "I don't know"
icon: forced-guess
category: intake
order: 36
symptom: I had to put something in.
aka: [Mandatory field without an escape, Plausible filler]
search: [required fields, missing data, survey design, forced response, placeholder values, data entry validation, satisficing]
patterns: [handshake-agreement]
---

The form will not submit until every field is filled, and offers no option for "unknown", "not applicable" or "prefer not to say". So people enter something.

## Signs and symptoms

- Piles of identical values: 1 January birthdays, a round 30 for age, the first option in every dropdown.
- Phone numbers like `0000000000`.
- Zero missing values in a field that cannot realistically be complete.
- Respondents abandon the form at the same question.

## Why it hurts

A plausible invented value is worse than a blank. A blank can be counted and handled; a guess is indistinguishable from data and enters every calculation. The form's completeness figure looks perfect, which removes the one signal that something is missing.

## Treatment

Give an explicit way out and record it: an "unknown" option, a "not applicable" tick box, or a reason field. Make a field required only when the process cannot continue without it. Then monitor how often the way out is used, per question and per enumerator.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Include `Unknown` and `Not applicable` in the dropdown list, or allow the cell to stay empty and require a reason in the next column. Look for guesses with a pivot table of counts per value, and for date piles with `=COUNTIFS(People[birth_date], DATE(1990, 1, 1))`.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Profile the column (*View > Column distribution* and *Column profile*): one value far ahead of the rest is the sign. On the data-quality page, chart the share of each question answered with the escape option, split by enumerator or office.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```sql
SELECT birth_date, count(*) AS people
FROM silver.dim_person
GROUP BY birth_date
ORDER BY people DESC
LIMIT 10;
```

A date held by a hundred people is a placeholder. Declare columns nullable where "unknown" is a real possibility, and keep `NOT NULL` for the few that are truly required.

</div>

## When it is fine

For fields the process cannot run without: an ID, a date of submission, consent.
