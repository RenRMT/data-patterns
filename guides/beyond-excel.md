---
title: When to move beyond Excel
lead: Move up when the work needs something a spreadsheet cannot guarantee, not because a better tool exists.
guide: true
order: 6
---

The ICAEW's spreadsheet principles put it as a first question: is a spreadsheet the appropriate tool for this job? Often it is. These are the signs that it no longer is.

## Six signs

| Sign | Why a spreadsheet struggles | Next mechanism |
| --- | --- | --- |
| Several people enter data at once, or on offline copies that are merged later | No reliable way to combine edits or stop conflicting entries | Forms (KoBo, ODK, Microsoft Forms) feeding one table, or a shared list or database |
| One record relates to many others (household, members, visits) | One flat table forces repetition or lookups that break | Linked tables in a Power BI model, or a relational database |
| The same cleaning is repeated across many files every period | Manual steps do not scale and are not repeatable | Power Query, then a scheduled pipeline |
| Files approach hundreds of thousands of rows, or become slow and unstable | A worksheet holds 1,048,576 rows at most, and gets fragile well before that | Power Query or Power BI over files, or a database |
| You must show who changed what and when | Cell edits leave no reliable audit trail | A system with an audit log |
| Different people may see different rows of personal data | Access is all-or-nothing per file | A system with row-level access control |

## What moves with you

A new tool changes the mechanism and keeps the patterns. A team without [Plain table]({{ site.baseurl }}/patterns/plain-table/), [Grain statement]({{ site.baseurl }}/patterns/grain-statement/) and [Master list]({{ site.baseurl }}/patterns/master-list/) in Excel will carry the same problems into Power BI or Databricks, where they are harder to see.

The smells travel too:

| In Excel | The same smell in Power BI | The same smell in Databricks |
| --- | --- | --- |
| `Final_v3_FINAL.xlsx` | Five copies of one `.pbix` | `analysis_v2_copy` notebooks, `reports_new` tables |
| `=IFERROR(..., 0)` | *Remove Errors* as a clean-up step | `try_cast` with nobody counting the nulls |
| A hidden column with a factor | A filter buried in step 14 | A literal in a `WHERE` clause |
| Paste as values | A hand-edited *Enter data* table | An ad hoc `UPDATE` from a scratch notebook |
| A file on one laptop | A report in *My workspace* | A notebook outside Git |

## A sensible order

1. Get the habits right in the tool you have. Use the [self-assessment]({{ site.baseurl }}/guides/self-assessment/).
2. Move the cleaning into Power Query inside Excel. It is already installed, and it is the largest single step towards repeatable work.
3. Move to a shared model or a pipeline when one of the six signs applies, and name which one.
