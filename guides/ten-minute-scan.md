---
title: The ten-minute scan
lead: Eight quick looks that surface most smells in a dataset you have not seen before.
guide: true
order: 3
---

Run this on every new dataset, source or delivery. Note what you checked, not what is "good": a smell you accept on purpose is fine if you write down the reason.

## The eight looks

1. **How many rows, how many columns, and what is one row?** Write the last answer in one sentence. If you cannot, that is your first finding. See [Grain statement]({{ site.baseurl }}/patterns/grain-statement/).
2. **Count the distinct values per column.** One distinct value is a dead column. Nearly all distinct in a category column is [free text where a list belonged]({{ site.baseurl }}/smells/free-text-free-for-all/).
3. **Look at the minimum, the maximum and the ten most frequent values per column.** [Impostor values]({{ site.baseurl }}/smells/impostor-value/) and typing errors stand out at once.
4. **Count the empty values per column**, and see whether the emptiness has a pattern: one period, one department, one source. See [Many-faced blank]({{ site.baseurl }}/smells/many-faced-blank/).
5. **Test the candidate key for uniqueness.** See [Seeing double]({{ site.baseurl }}/smells/seeing-double/).
6. **Check the date columns** for their range and for text pretending to be dates. See [Everything is text]({{ site.baseurl }}/smells/everything-is-text/).
7. **Count the rows per period or per source.** A gap or a spike is nearly always a loading problem, not a phenomenon.
8. **Compare one total with a figure the department itself uses.** If they differ, you have found a difference in definition, and that is the most useful finding of the day. See [Folklore definition]({{ site.baseurl }}/smells/folklore-definition/).

## In each stack

<div class="stack" data-stack="excel" markdown="1">

Make the range a Table (`Ctrl+T`), then use a pivot table per column for counts, and a few check cells:

```
Rows             =ROWS(Data)
Distinct         =ROWS(UNIQUE(Data[department]))
Empty            =COUNTBLANK(Data[people])
Key is unique    =ROWS(UNIQUE(Data[record_id])) = ROWS(Data[record_id])
Text, not date   =SUMPRODUCT(--ISTEXT(Data[report_date]))
```

</div>

<div class="stack" data-stack="powerbi" markdown="1">

In the Power Query editor, switch on *View > Column quality*, *Column distribution* and *Column profile*, and set profiling to the entire dataset in the status bar (the default is the first 1,000 rows). Or get the whole profile as a table:

```
Profile = Table.Profile(Source)
```

It returns the minimum, maximum, count, null count and distinct count per column.

</div>

<div class="stack" data-stack="databricks" markdown="1">

```python
df = spark.table("bronze.partner_reports")
display(df.summary())                                   # count, min, max per column
display(df.groupBy("department").count().orderBy("count", ascending=False).limit(10))
```

```sql
SELECT count(*)                         AS rows,
       count(DISTINCT record_id)        AS distinct_keys,
       count_if(people IS NULL)         AS people_empty,
       min(report_date), max(report_date)
FROM bronze.partner_reports;

SELECT date_trunc('month', report_date) AS month, count(*) AS rows
FROM bronze.partner_reports GROUP BY ALL ORDER BY month;
```

In a notebook, the data profile tab on a displayed table gives the same overview without code.

</div>

## After the scan

A smell means "ask why", not "repair". Take the findings to the person who supplies the data before you write any cleaning: a fix at the source is made once.
