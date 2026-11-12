---
title: How much is enough
lead: Apply patterns in proportion to what is at stake. Sixteen patterns on a one-off analysis is waste; three on a donor report is a risk.
guide: true
order: 1
---

## Three tiers of stakes

| Stakes | Examples | Apply |
| --- | --- | --- |
| One-off | A quick question answered once, an exploratory analysis | [Plain table]({{ site.baseurl }}/patterns/plain-table/), [Untouched original]({{ site.baseurl }}/patterns/untouched-original/) |
| Recurring, internal | A monthly team tracker, a programme dashboard | Add [Grain statement]({{ site.baseurl }}/patterns/grain-statement/), [Master list]({{ site.baseurl }}/patterns/master-list/), [Single home]({{ site.baseurl }}/patterns/single-home/), [One-way street]({{ site.baseurl }}/patterns/one-way-street/), [Push-button rerun]({{ site.baseurl }}/patterns/push-button-rerun/), [Tripwire]({{ site.baseurl }}/patterns/tripwire/), [Data map]({{ site.baseurl }}/patterns/data-map/), [Safety net]({{ site.baseurl }}/patterns/safety-net/) |
| Reported externally | Donor reports, published figures, anything audited | All sixteen, with most care on [Define once]({{ site.baseurl }}/patterns/define-once/), [Handshake agreement]({{ site.baseurl }}/patterns/handshake-agreement/), [Tripwire]({{ site.baseurl }}/patterns/tripwire/), [Freeze frame]({{ site.baseurl }}/patterns/freeze-frame/) and [Rehearsal stage]({{ site.baseurl }}/patterns/rehearsal-stage/) |

Personal data overrides this table. Any file that identifies people needs [Safety net]({{ site.baseurl }}/patterns/safety-net/) and [Travel light]({{ site.baseurl }}/patterns/travel-light/) from the first day, whatever the stakes.

A one-off that gets run a second time has become recurring. That is the moment to add the next tier, not after the fifth run.

## The maturity ladder

The ladder measures habits, not tools. Every level can be reached in Excel, and a team on Databricks can sit at level 0. Better tools make the higher levels cheaper, not automatic.

| Level | Name | The test |
| --- | --- | --- |
| 0 | Ad hoc | It works only when one particular person does it; nothing is written down |
| 1 | Agreed | The team has written conventions (folders, names, templates, grain, master lists) and follows them |
| 2 | Repeatable | A colleague can rerun the process and get the same result; checks and snapshots are routine |
| 3 | Managed | The process runs and is checked without depending on any individual; changes are reviewed; owners and access are defined |

Assess one dataset or one report at a time, not the whole team. A team can be at level 3 for its donor report and level 0 for its monitoring visits, and that may be the right allocation of effort.

## The cheapest place to fix

Wherever a problem shows up, look upstream first. A problem repaired at entry is repaired once. The same problem repaired in the report is repaired every month, by someone who has to know about it.

| Where you fix | What it costs |
| --- | --- |
| At entry (the form, the template) | Once. Everyone downstream benefits without knowing |
| In storage (the clean table) | Once per load, by the person who maintains the cleaning |
| In the pipeline (a step in the middle) | Every run, and anyone who bypasses the step gets the old problem |
| In the report | Every report, by every author, each in their own way |

## Next

Take the [self-assessment]({{ site.baseurl }}/guides/self-assessment/) for one dataset. The first "not yet" in your tier is your next step.
