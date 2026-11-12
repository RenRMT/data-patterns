---
title: Rolling this out in a team
lead: Adoption works one pattern at a time, attached to a pain the team already feels.
guide: true
order: 7
---

## What works

- **Lead with the pain, not the concept.** "Bronze layer" means nothing to an Excel team. "Never edit the file the partner sent" does, especially just after a reconciliation crisis. Open with the symptom.
- **Habits before tools.** Use the [self-assessment]({{ site.baseurl }}/guides/self-assessment/) to find the next single step. Power BI on top of untidy data only spreads the problem faster.
- **One vocabulary everywhere.** Use the [plain terms]({{ site.baseurl }}/guides/vocabulary/) in Databricks work too, so teams see one way of thinking across stacks.
- **Ship templates, not advice.** A folder template, a submission template with validation, a checks tab, an indicator reference sheet and a master-lists workbook make good practice the default.
- **Start where it shows.** Donor reports and management dashboards pay off fastest and create demand from other teams.
- **Build in a review.** A short data review before each major submission (checks run, second reader, snapshot saved) builds habits more reliably than training.

## A half-day workshop

1. Each group draws its current flow for one report on paper.
2. The facilitator introduces two or three patterns through their symptoms.
3. Groups mark where those symptoms appear in their flow and fill in the self-assessment.
4. Each group commits to one first step, with an owner and a date.

## Smells are often about the organisation

A code smell points at a design problem. A data smell usually points at an organisational one.

Department names as free text mean that nobody owns the department list. Two conflicting revenue figures mean that two teams are held to different definitions, and both were right to calculate it their way. The manual correction step means the source does not deliver what the user needs, and nobody has put the two parties together.

In those cases the fix is a conversation about ownership, and a script would only hide the need for it.

## Adding a pattern of your own

Every data engineering practice answers a specific failure, and the tool is only one way to implement the answer. To translate a practice from tool-heavy material, ask three questions:

1. **What goes wrong without this?** The failure the practice responds to.
2. **What does it guarantee?** Phrase it as something you could check, such as "rerunning gives the same result".
3. **What is the smallest mechanism that delivers that guarantee?** A folder convention, a locked template, a naming rule, a query step.

A worked example, Delta Lake time travel. The failure: a donor asks why Q2 changed and nobody can reconstruct what was reported. The guarantee: you can see the data as it was at a past date. The Excel mechanism: a dated, read-only snapshot at every submission, which is [Freeze frame]({{ site.baseurl }}/patterns/freeze-frame/).

If a practice still looks arbitrary after the three questions, it is probably solving a problem of scale (throughput, concurrency, cost) that a small team does not have, and can be left out.
