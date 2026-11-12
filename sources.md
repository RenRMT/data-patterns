---
title: Sources and further reading
lead: The evidence behind the claims on this site, and where to read more.
permalink: /sources/
---

## Evidence

| Source | What it shows |
| --- | --- |
| [Spreadsheet errors: what we know. What we think we can do](https://arxiv.org/abs/0802.3457) (Panko, 2008) | In field audits from 1997 onward, 91% of 54 real-world spreadsheets contained errors. Experience did not protect against them. A lone reviewer caught about half; a group inspection about 80% |
| [Excel blunder and 15,841 unreported cases](https://www.theregister.com/2020/10/05/test_and_trace/) (The Register, 2020) | Public Health England lost cases from daily reporting because of the 65,536-row limit of the `.xls` format |
| [Gene name errors are widespread in the scientific literature](https://genomebiology.biomedcentral.com/articles/10.1186/s13059-016-1044-7) (Ziemann et al., 2016) | About one-fifth of genomics papers with Excel gene lists contained names converted to dates or numbers |
| [Does high public debt consistently stifle economic growth?](https://doi.org/10.1093/cje/bet075) (Herndon, Ash and Pollin, 2014) | The critique of Reinhart and Rogoff that found, among other things, a spreadsheet range that left five countries out of an average |
| [Mars Climate Orbiter mishap investigation, phase I report](https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf) (NASA, 1999) | A spacecraft lost to a mismatch between pound-force seconds and newton-seconds |

## Smells: where the idea comes from

| Source | Best for |
| --- | --- |
| *Refactoring: Improving the Design of Existing Code* (Fowler, with Beck) | The original catalogue of code smells |
| [Refactoring.Guru](https://refactoring.guru/) | The site whose structure this one borrows |
| [Data smells: categories, causes and consequences, and detection of suspicious data in AI-based systems](https://arxiv.org/abs/2203.10384) (Foidl, Felderer and Ramler, 2022) | A catalogue of 36 data smells for tabular data, with causes and consequences |
| [Detecting and refactoring code smells in spreadsheet formulas](https://research.tudelft.nl/en/publications/detecting-and-refactoring-code-smells-in-spreadsheet-formulas/) (Hermans, Pinzger and van Deursen, 2015) | Code smells applied to spreadsheet formulas |

## Patterns: practical guides

| Source | Best for | Patterns |
| --- | --- | --- |
| [Data organization in spreadsheets](https://peerj.com/preprints/3183) (Broman and Woo, 2018) | The rules to hand every Excel team | 1, 9, 10 |
| [Data organization in spreadsheets for social scientists](https://datacarpentry.org/spreadsheets-socialsci) (Data Carpentry) | A ready-made hands-on lesson on table shape, dates and quality control | 1, 11 |
| [Good enough practices in scientific computing](https://pmc.ncbi.nlm.nih.gov/articles/PMC5480810) (Wilson et al., 2017) | Minimum viable discipline for small teams | 3, 6, 8, 13, 15 |
| [Development research in practice: the DIME Analytics data handbook](https://worldbank.github.io/dime-data-handbook/) (World Bank, 2021) | The full data workflow in a development setting | 2, 3, 6, 8, 14, 16 |
| [20 principles for good spreadsheet practice](https://www.icaew.com/technical/technology/excel-community/20-principles-for-good-spreadsheet-practice-2024-edition) (ICAEW, 2024 edition) | Spreadsheet governance, review and choosing the right tool | 9, 11, 13 |
| [Routine data quality assessment tool](https://www.measureevaluation.org/resources/publications/ms-17-117) (MEASURE Evaluation) | An Excel-based self-assessment of data quality and reporting systems | 11, 14 |
| Tidy data (Wickham, *Journal of Statistical Software*, 2014) | Why table shape matters | 1, 2 |
| *Fundamentals of Data Engineering* (Reis and Housley) | The most tool-agnostic mainstream data engineering book | All |
| *The Data Warehouse Toolkit* (Kimball and Ross), chapters 1 and 2 | Grain, facts and dimensions | 2, 3, 4, 12 |
| *Designing Data-Intensive Applications* (Kleppmann), chapters 10 and 11 | The reasoning behind immutable raw data and derived layers | 6, 7, 8 |
| *Master Your Data with Power Query in Excel and Power BI* (Puls and Escobar) | Repeatable processing with tools teams already have | 7, 8, 9 |
| IASC Operational Guidance on Data Responsibility; ICRC Handbook on Data Protection in Humanitarian Action | Data protection in the sector | 16 |

## Product documentation

The stack examples use documented features. For the current details, search the product documentation for the feature name: Excel structured references and data validation; Power Query M function reference; Power BI row-level security and deployment pipelines; Databricks Delta Lake constraints, Auto Loader, pipeline expectations and Unity Catalog.
