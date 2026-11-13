---
title: Travel light
plain: Collect, share and keep only what you need
icon: travel-light
group: care
order: 16
tier: 3
guarantee: Sensitive data stays contained, and data you do not hold cannot leak.
symptom: Who has a copy of the beneficiary list?
question: Are personal identifiers kept apart from analysis data, with a date for deletion?
first_step: Check one analysis file for columns that identify people, and move them to a restricted key file.
aka: [Need to know, Data protection by design]
search: [data minimisation, least privilege, pseudonymisation, retention policy, row-level security, column masking, GDPR, statistical disclosure control]
---

## The problem

Personal and sensitive data is collected "just in case", copied into every file and report, and kept forever. Names, phone numbers and locations appear in analysis files and email attachments. Nobody knows how many copies of a sensitive dataset exist. Small-group breakdowns in published reports could identify individuals. Data from projects that closed years ago is still on the shared drive.

## The pattern

- **Collect** only what you will use. Every extra field is a cost to the person answering and a liability to you.
- **Separate** identifying information from analysis data, linked only by a meaningless ID. Most analysis never needs a name.
- **Share** the least each person needs: the fewest rows, the fewest columns, the shortest time.
- **Keep** data until a set date, then delete it, and write the date in the data map.
- **Publish** no breakdown so small that it points at a person.

Data you do not hold cannot leak. In the aid sector, the harm from exposure falls on people with little power to respond.

This pattern overrides the stakes tiers: any file that identifies people needs it from the first day.

## Code Examples

{% include stack-switch.html %}

<div class="stack" data-stack="excel" markdown="1">

A separate, access-restricted key file maps ID to name and contact details. Analysis files hold IDs only. Sensitive columns are never emailed: share a link to the restricted location instead. The retention date is in the data map.

A password on a workbook is not access control. Access is set on the folder or site.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Remove identifying columns in the first query step, so they never reach the model. Hidden columns are still in the file and can be read by anyone with the `.pbix`.

```
Minimal = Table.RemoveColumns(Source, {"name", "phone", "address"}, MissingField.Ignore)
```

Where people may see only their own region, define a row-level security role with a filter such as `[region_email] = USERPRINCIPALNAME()`, and test it with *View as*. Publish no personal data in reports that are shared widely or exported.

</div>

<div class="stack" data-stack="databricks" markdown="1">

Identifiers sit in restricted tables. Unity Catalog masks columns and filters rows by group, and a scheduled job deletes what has passed its retention date.

```sql
CREATE OR REPLACE FUNCTION gov.mask_phone(phone STRING)
RETURN CASE WHEN is_account_group_member('protection-team') THEN phone ELSE '***' END;

ALTER TABLE silver.beneficiaries ALTER COLUMN phone SET MASK gov.mask_phone;

DELETE FROM silver.beneficiaries WHERE project_end_date < add_months(current_date(), -60);
```

A delete removes rows from the current table. Run `VACUUM` afterwards so the old data files go too, and remember the copies in bronze and in snapshots.

</div>

## When to bend it

Not downwards. Your organisation's data protection policy and the law take precedence over anything on this page. For sector guidance, see the IASC Operational Guidance on Data Responsibility and the ICRC Handbook on Data Protection in Humanitarian Action.
