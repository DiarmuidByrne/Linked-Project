#Linked Data Project 2015
*** By Diarmuid Byrne ***

## Introduction
As described in the project brief, this project parses two separate datasets and links them by queries in order to make
make the data readable and easy to use. This Readme will be updated as the project continues with development.

## Datasets used
This API reads in two datasets:
- A list of protected structures of historical significance (Taken from the data.gov.ie statistics website)
https://data.gov.ie/dataset/fingal-development-plan-2011-2017-record-of-protected-structures

- A list of bus routes and stop times (Taken from the Dublinked open data bank)
http://dublinked.com/datastore/datasets/dataset-254.php

Both of the datasets are Specific to the Greater Dublin Area

## Functionality
The current plan for the datasets  is to take advantage of the latitudeinal and longitudinal values of both datasets to compare the closest bus routes and stops with a specific (or multiple) protected structure. If time permits, functionality will be added to display requested times for each bus stop to make the API more specific and useful to end users. 
