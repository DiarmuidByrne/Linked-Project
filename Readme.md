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
The API takes advantage of the latitudinal and longitudinal values of both datasets in order to compare the closest bus stops with a specific structure. The API also takes in a third JSON dataset of bus stop times and adds it to the stops database by matching the stop ID's in both files. 

The API can be used by requesting these links:
 - <b>127.0.0.1:8000/list</b>
</br>This lists each structure in plain text
 - <b>127.0.0.1:8000/stops</b>
</br>Similar to the previous query, but it lists the bus stop locations instead
 - <b>127.0.0.1:8000/compare/(id)</b>
</br>Lists the structure by the given ID (1-792), and shows nearby bus stops followed by the times the bus stops in the area.
</br>example: <b><i>127.0.0.1:8000/compare/5</i></b>
</br>returns information on the structure with ID 5. 

Requesting the root url (127.0.0.1:8000) will bring up a HTML page, where the user can navigate the UI to enter a Structure ID to display the structure info (Using EJS and Jquery).
</br><i>*If time permits, the google maps API will be added, which uses the latitude and longitude values of the given object to project the position on the map.*</i>
