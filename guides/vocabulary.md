---
title: Shared vocabulary
lead: The same plain words on every stack, so that moving from Excel to Databricks is visibly a change of mechanism and not of thinking.
guide: true
order: 5
---

Use the plain term in conversation and the engineering term when searching. Each pattern and smell page ends with its own list of search terms.

## Plain terms and their engineering names

| Plain term | Data engineering term | Meaning |
| --- | --- | --- |
| Received | Raw, bronze, landing | Data exactly as it arrived, never edited |
| Clean | Staging, silver | Standardised, validated, joined to master lists |
| Reporting | Gold, mart, semantic layer | Agreed indicators, shaped for one use |
| Grain | Grain, granularity | What one row represents |
| Master list | Dimension, reference data, master data | The official list of sites, partners or indicators, with IDs |
| ID | Key (primary, foreign, surrogate) | The code that identifies one thing and never changes |
| Home | System of record | The one place a fact is entered and corrected |
| Handover agreement | Schema, data contract | The agreed shape of data that crosses a boundary |
| Checks | Tests, expectations, assertions | Rules the data must pass before anyone uses it |
| Snapshot | Point-in-time copy | A frozen copy of what was reported |
| Data map | Lineage, catalogue | Where each number comes from, and who owns each step |
| Rerun | Reproducibility, idempotency | Same input, same output, however often you run it |
| Mapping table | Crosswalk, lookup table | A table that translates one set of values into another |
| Corrections log | Audit trail | A record of what was changed, from what, to what, by whom and why |

## The same idea in three stacks

| Idea | Excel | Power Query / Power BI | Databricks |
| --- | --- | --- | --- |
| A table | Excel Table (`Ctrl+T`) | Query, model table | Delta table |
| A master list | Tab with a dropdown list | Dimension table | Dimension table |
| A calculation defined once | Named formula | Measure in a shared semantic model | Gold view, metric view |
| A cleaning recipe | Written procedure | Applied steps | Notebook, pipeline |
| A check | PASS/FAIL formula | Check query | Constraint, expectation, test |
| A snapshot | Dated read-only folder | Dated extract with a snapshot date | Snapshot table |
| Change history | Version history | Deployment stages, Git project | Git, table history |
| Who may see what | Folder permissions | Row-level security | Unity Catalog grants, masks and filters |

## Where the word "smell" comes from

Kent Beck coined "code smell" in the 1990s and Martin Fowler's *Refactoring* made it standard: a surface sign that usually points to a deeper problem in the design. "Design patterns" are the named, reusable solutions catalogued by Gamma, Helm, Johnson and Vlissides in 1994.

The idea has been carried over to data before. Felienne Hermans and colleagues applied code smells to spreadsheet formulas (2012). Harald Foidl, Michael Felderer and Rudolf Ramler published a catalogue of 36 data smells for tabular data (2022). The smells on this site overlap with theirs where the subject is the values in a column; this site adds the smells of process and collection, and pairs each with the habits that treat it. See [Sources]({{ site.baseurl }}/sources/).
