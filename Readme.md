#Linked Data Project 2015
*** By Diarmuid Byrne ***

## Introduction
As required in the task described in the project brief, this project parses two separate datasets and links them by queries in order to make
make the data readable and easy to use. This Readme will be updated as the project continues with development.

## Datasets used
This API reads in two datasets:
- A list of protected structures of historical significance (Taken from the data.gov.ie statistics website)
https://data.gov.ie/dataset/fingal-development-plan-2011-2017-record-of-protected-structures

- Two files containing a list of bus routes and stop times (Taken from the Dublinked open data bank)
http://dublinked.com/datastore/datasets/dataset-254.php

Both of the datasets are specific to the Greater Dublin area. However, this API could be expanded to cater for a larger area.

## Functionality
The API takes advantage of the latitudinal and longitudinal values of both datasets in order to compare the closest bus stops with a specific structure.

Accessing the root link <i><b>(127.0.0.1:8000/)</i></b> brings the user to a GUI powered by HTML.
The user can then either:
 - Show a structure by a given ID. It will also show a nearby bus stop by comparing the latitude and longitude values.
 - Delete a structure with ID that was entered
 - Insert a new structure with an Auto-incrementing primary ID.

Alternatively, The API can be used by requesting these links:
 - <b>127.0.0.1:8000/list</b>
</br>This lists each structure in plain text
 - <b>127.0.0.1:8000/stops</b>
</br>Similar to the previous query, but it lists the bus stop locations instead
 - <b>127.0.0.1:8000/compare/(id)</b>
</br>Lists the structure by the given ID, and shows nearby bus stops followed by the times the bus stops in the area.
</br>example: <b><i>127.0.0.1:8000/compare/5</i></b>
</br>returns information on the structure with ID 5.

## Expansion
This project has been built around the possibility of expansion. Variables that control JSON parsing are all dynamically linked to the size of the datasets at runtime. This can be shown by adding a structure with the insert statement and displaying it by using the link 127.0.0.1:8000/list.

## References
This project has some cases of borrowed code, either from other open projects or tutorials.
Since I was new to using JQuery and AJAX, I got the queries to support these with code I found from an open GitHub project.
<b><i>https://github.com/VMarisevs/diamond-api </i></b>
I also followed multiple examples and tutorials on W3schools to help with more specific problems, such as Database inserts using AJAX.
<b><i>http://www.w3schools.com/jquery </i></b>
Other references include:
 - [Git cheat sheet](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
 - [Markdown cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
 - [CSV management](http://blogs.technet.com/b/heyscriptingguy/archive/2011/10/17/easily-remove-columns-from-a-csv-file-by-using-powershell.aspx)
