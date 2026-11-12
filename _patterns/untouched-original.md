---
title: Untouched original
plain: Keep what you received, exactly as it arrived
icon: untouched-original
group: move
order: 6
tier: 1
guarantee: The original is always available, so any later mistake can be undone by starting again.
symptom: Which version did they actually send?
question: Are the files you received kept unedited?
first_step: Create a received folder for one recurring dataset and agree that nobody opens those files to edit them.
aka: [Raw layer, Landing zone]
search: [immutable raw data, bronze layer, landing zone, append-only, raw vault, ELT, write once read many]
---

## The problem

Received data is corrected, reformatted or overwritten in place, so the original is lost. A cleaning mistake is found, but the original values are gone. A dispute with a partner cannot be settled, because nobody can show what was delivered.

## The pattern

Data as received is never edited. Every later step reads from it and writes somewhere else.

Everything downstream then becomes disposable: any mistake can be fixed by rerunning from the original. You also hold a record of what each source delivered and when.

Received data is allowed to be messy. The cleaning belongs in the next layer, not here.

## In each stack

<div class="stack" data-stack="excel" markdown="1">

A `01_received` folder, with files named `YYYY-MM-DD_source_description.xlsx`. Make the folder read-only for everyone except the person who files new arrivals.

Do not open a received CSV by double-clicking it: Excel converts values on opening, and saving writes the conversions back. Read it through *Data > Get Data > From Text/CSV* into a different workbook.

</div>

<div class="stack" data-stack="powerbi" markdown="1">

Queries read from the received folder and never write back. Combining a folder also records which file each row came from.

```
let
    Files    = Folder.Files(ReceivedFolder),
    Xlsx     = Table.SelectRows(Files, each [Extension] = ".xlsx"),
    WithData = Table.AddColumn(Xlsx, "data",
                 each Excel.Workbook([Content], true){[Item = "Report", Kind = "Table"]}[Data]),
    Kept     = Table.SelectColumns(WithData, {"Name", "Date modified", "data"}),
    Renamed  = Table.RenameColumns(Kept, {% raw %}{{"Name", "source_file"}, {"Date modified", "received_at"}}{% endraw %})
in
    Renamed
```

</div>

<div class="stack" data-stack="databricks" markdown="1">

Bronze tables are append-only, hold the data as delivered (strings are fine), and carry the source file and load time on every row.

```python
from pyspark.sql.functions import col, current_timestamp

(spark.read.option("header", True).csv("/Volumes/main/landing/partner_reports/")
    .withColumn("_source_file", col("_metadata.file_path"))
    .withColumn("_loaded_at", current_timestamp())
    .write.mode("append")
    .saveAsTable("bronze.partner_reports"))
```

Keep the landed files too. A table can be rebuilt from files; files cannot be rebuilt from a table that parsed them wrongly.

</div>

## When to bend it

Personal data is the exception. If a received file holds identifiers you should not keep, strip or restrict them on arrival and record that you did. See [Travel light]({{ site.baseurl }}/patterns/travel-light/).
