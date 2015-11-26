#Linked Data Project 2015
###***By Diarmuid Byrne***

## Introduction
As required in the task described in the project brief, this project parses two separate datasets and links them by queries in order to make
make the data readable and easy to use. This Readme will be updated as the project continues with development.

## Datasets used
This API reads in two datasets:
- A list of protected structures of historical significance (Taken from the data.gov.ie statistics website)
https://data.gov.ie/dataset/fingal-development-plan-2011-2017-record-of-protected-structures

- Two files containing a list of bus routes and stop times (Taken from the Dublinked open data bank)
http://dublinked.com/datastore/datasets/dataset-254.php

In order to make both datasets usable, I had to delete multiple irrelevant columns from the Bus Stop files before converting them to JSON. The Stop_Times file had a lot of redundancy errors, with the file ending up at nearly 1 million entries. To cut it down to a usable size, I took the Stop_ID column as a primary key and deleted all duplicate entries. This brought the file to a much more useable 5,000 entries.

Both of the datasets are specific to the Greater Dublin area.

## Functionality
The API takes advantage of the latitudinal and longitudinal values of both datasets in order to compare the closest bus stops with a specific structure.

Accessing the root link <i><b>(127.0.0.1:8000/)</i></b> brings the user to a GUI powered by HTML.
![Alt text](http://i.imgur.com/RnACFDk.png "Rendered EJS at Root")
Here is a screenshot of the root link, which utilizes an EJS file. This file allows the primary functions of the API to run without needing to refresh the page. From here you can add or remove a structure by ID. You can also use a structure ID to find a bus stop in the area, if any are nearby.

Alternatively, The API can be used by requesting these links:
 - <b>127.0.0.1:8000/list</b>
</br>This lists each structure in plain text. The structures are in JSON format, and are displayed like so:
![Alt text](http://i.imgur.com/4s2TB8v.png "Example structure")
 - <b>127.0.0.1:8000/stops</b>
![Alt text](http://i.imgur.com/Kp1mEyb.png "Example stop")
</br>Similar to the previous query, but it lists the bus stop locations instead
 - <b>127.0.0.1:8000/compare/(id)</b>
</br>Lists the structure by the given ID, and shows nearby bus stops followed by the times the bus stops in the area.
</br>example: <b><i>127.0.0.1:8000/compare/5</i></b> would return:
![Alt text](http://i.imgur.com/z22IZ58.png "Example stop")

## Code Exerpts
![Alt text](http://i.imgur.com/tlrwzCd.png "Example structure")
Here is an example of one of the JQuery functions. It uses AJAX to insert a new Structure with the given information that was input into the textboxes.
![Alt text](http://i.imgur.com/fe5Vnpf.png "Stop Times update")
Due to the Bus stop datasets having separate files for Lat/long values and stop times, I used this query to update the already existing Stops table to add the times column.

## Expansion
This project has been built around the possibility of expansion. Variables that control JSON parsing are all dynamically linked to the size of the datasets at runtime. This can be shown by adding a structure with the insert statement and displaying it by using the link 127.0.0.1:8000/list.

## References
This project has some cases of borrowed code, either from other open projects or tutorials.
Since I was new to using JQuery and AJAX, I got the queries to support these with code I found from an open GitHub project.
</br><b><i>https://github.com/VMarisevs/diamond-api </i></b>
</br>I also followed multiple examples and tutorials on W3schools to help with more specific problems, such as Database inserts using AJAX.
</br><b><i>http://www.w3schools.com/jquery </i></b>
</br>Other references include:
 - [Git cheat sheet](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
 - [Markdown cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
 - [CSV management](http://blogs.technet.com/b/heyscriptingguy/archive/2011/10/17/easily-remove-columns-from-a-csv-file-by-using-powershell.aspx)
 - [SQLITE3 github page](https://github.com/mapbox/node-sqlite3)
