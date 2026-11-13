---
title: Colour code
plain: Meaning stored in formatting
icon: colour-code
category: shape
order: 5
symptom: Yellow means checked. Or was it green?
aka: [Meaning in formatting, Cell comments as data]
search: [formatting as data, conditional formatting, status column, metadata in formatting, hierarchical column]
patterns: [plain-table, data-here-logic-there]
---

Bold marks a total row. Yellow means checked, red means problem, strikethrough means cancelled. Indentation shows which rows belong under which heading. Important context sits in a cell comment. The information exists only as formatting.

## Signs and symptoms

- There is a colour legend, or there should be one.
- Hierarchy is shown by indenting names within one column.
- People filter by colour.
- An export to CSV "loses" information.

## Why it hurts

Formatting does not survive an export, a copy-paste, or a colleague who does not know the legend. No formula, query or script can read it reliably, so the meaning is lost at the first step of any processing.

## Treatment

Promote the meaning to a real column: `status`, `is_total`, `parent_id`, `comment`. If the colour helps readers, derive it from that column with conditional formatting. The colour becomes a consequence instead of the source.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

Add a `status` column with a dropdown, then *Home > Conditional Formatting > New Rule > Use a formula*, for example `=$F2="checked"`. For an indented hierarchy, add `level_1` and `level_2` columns, or a `parent_code` column.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Power Query reads values only: colours, bold and comments are gone on import, which is why the smell tends to surface here. Ask for a status column at the source. In the report, colour by rule from that column (*Conditional formatting > Rules* or a field value).

</div>

<div class="stack" data-stack="databricks" markdown="1">

Formatting never reaches a table. If a legacy file's colours must be rescued once, read the cell styles with `openpyxl` in a one-off script and write them out as a column, then fix the template.

```python
from openpyxl import load_workbook
ws = load_workbook("legacy.xlsx")["Data"]
status = [(c.row, c.fill.fgColor.rgb) for c in ws["A"][1:]]
```

</div>

## When it is fine

Formatting that repeats what a column already says, and formatting in a report nobody reads data from.
