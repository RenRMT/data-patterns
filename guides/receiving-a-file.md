---
title: Receiving a spreadsheet
lead: A standard routine for an Excel or CSV file that someone has sent you, and the three changes to ask for if you can only ask for three.
guide: true
order: 4
---

Excel is a good tool that gets used as a calculator, a database, an entry form and a report layout at once. Nearly every spreadsheet smell comes from that mixing. The rule underneath this routine is to separate three roles:

| Role | Looks like | Mark of the role |
| --- | --- | --- |
| Entry | A form, or a table with validation | People type here |
| Storage | A plain table, one header row, one row per record | Nobody looks here |
| Reporting | Formatted, merged, coloured, with totals | Nobody types here |

When the three share one sheet, the smells appear by themselves.

## The routine

1. **Save the original unchanged** in a received folder. Never edit it. ([Untouched original]({{ site.baseurl }}/patterns/untouched-original/))
2. **Read it in, do not open it.** Use *Data > Get Data > From Text/CSV* or *From Workbook*, not a double-click, so you control the types. ([Overeager autocorrect]({{ site.baseurl }}/smells/overeager-autocorrect/))
3. **Clean in Power Query, not by hand.** The steps stay visible and can be run again next month. ([Push-button rerun]({{ site.baseurl }}/patterns/push-button-rerun/))
4. **Set types explicitly**, with the right locale. ([Everything is text]({{ site.baseurl }}/smells/everything-is-text/))
5. **Add checks:** row count, number of unique keys, number of empty values per column, and one total you can reconcile with the department. ([Tripwire]({{ site.baseurl }}/patterns/tripwire/))
6. **Deliver as a named Table** (`Ctrl+T`), or export to CSV or Parquet if it goes further down a pipeline. ([Plain table]({{ site.baseurl }}/patterns/plain-table/))
7. **Write down what you changed and tell the source.** Otherwise you will repair exactly the same thing next month. ([Magic hands]({{ site.baseurl }}/smells/magic-hands/))

## If you can change only three things

1. **One header row, one row per record, no merged cells.** This removes most import problems in one go.
2. **Data validation on every field where someone types.** Preventing an error at entry is far cheaper than cleaning it up afterwards.
3. **Cleaning in Power Query instead of by hand.** Repeatable, inspectable, and transferable to a colleague.

## What to send back

When you ask a sender to change a file, send the template instead of a description of it: a sheet with locked headers, dropdowns and a one-page data dictionary. See [Handshake agreement]({{ site.baseurl }}/patterns/handshake-agreement/).
