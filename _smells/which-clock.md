---
title: Which clock?
plain: A timestamp without a time zone or a stated meaning
icon: which-clock
category: meaning
order: 14
symptom: Was that our time or their time?
aka: [Ambiguous timestamp, Time zone confusion]
search: [UTC, time zone, daylight saving time, timestamp with time zone, event time vs processing time, ISO 8601]
patterns: [data-map, handshake-agreement]
---

`2026-03-29 02:30`. Local time or UTC? In Amsterdam that minute did not exist, because the clocks went forward. And is it the moment the thing happened, or the moment someone recorded it?

## Signs and symptoms

- Events from two offices appear in the wrong order.
- Daily totals shift by a day depending on who runs the report.
- An hour of data is missing in March, or doubled in October.
- A column is just called `date` or `timestamp`.
- Durations come out negative.

## Why it hurts

Counts per day depend on where midnight falls. A late-evening event in one time zone lands on the next day in another, so the same data gives two daily figures. And the date something was *entered* can be days or weeks after it *happened*, which moves it into a different reporting period.

## Treatment

Store moments in UTC and derive local time when presenting. Name the column for what it measures: `occurred_at`, `recorded_at`, `submitted_at`. For things that only have a date (a birthday, a reporting day), store a date, not a timestamp.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Excel dates carry no time zone. Add a `timezone` column, or a header that states it (`occurred_at_utc`). Convert with plain arithmetic, `=[@occurred_at_utc] + 1/24`, and remember that the offset changes with daylight saving.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

```
WithZone = Table.TransformColumns(Source,
             {% raw %}{{"occurred_at", each DateTime.AddZone(_, 1), type datetimezone}}{% endraw %}),
Utc      = Table.TransformColumns(WithZone,
             {% raw %}{{"occurred_at", DateTimeZone.ToUtc, type datetimezone}}{% endraw %})
```

`DateTime.LocalNow()` gives your laptop's time in Desktop and UTC in the service. Use `DateTimeZone.UtcNow()` so a refresh behaves the same in both.

</div>

<div class="stack" data-stack="databricks" markdown="1">

`TIMESTAMP` values are stored as UTC instants and shown in the session time zone. Convert on purpose:

```sql
SELECT to_utc_timestamp(local_time, 'Europe/Amsterdam')      AS occurred_at,
       from_utc_timestamp(occurred_at, 'Africa/Kampala')     AS occurred_local,
       _loaded_at                                            AS loaded_at
FROM bronze.events;
```

Use region names (`Europe/Amsterdam`), not fixed offsets, so daylight saving is handled.

</div>

## When it is fine

When everything happens in one time zone and only dates matter. Say so in the data dictionary.
