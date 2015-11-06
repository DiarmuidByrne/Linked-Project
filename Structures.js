
// ====== Main source for Structures API ======
// Import required resources
var express = require('express');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

// Read in Structures file and parse to JSON
var structure = JSON.parse(fs.readFileSync('Structures.json', 'utf8'));

//===== Initialize HTTP Server =====
var app = express();
var portNo = 8000;
// Listen on specified port
var server = app.listen(portNo);
//==================================
//=======Structures Database========
var structDB = new sqlite3.Database(':memory:');

// Create Database and save structures into table
structDB.serialize(function() {
  structDB.run('CREATE TABLE structures (id INTEGER PRIMARY KEY AUTOINCREMENT, rps_no REAL, structurename TEXT, description TEXT, streetnumber INTEGER, streetaddress TEXT, townland TEXT, lat REAL, long REAL)');

  var stmt = structDB.prepare('INSERT INTO structures (rps_no,structurename,description,streetnumber,streetaddress,townland,lat,long) VALUES (?,?,?,?,?,?,?,?)');

  // Loop through each JSON object and add contents to database
  for(var i=0; i<structure.length; i++) {
    stmt.run(structure[i].RPS_Number
            , structure[i].StructureName
            , structure[i].Description
            , structure[i].StreetNumber
            , structure[i].StreetAddress
            , structure[i].Townland
            , structure[i].Lat
            , structure[i].Long
          );
  }
  stmt.finalize();
});

//==================================
// ========== HTTP Server ==========

// Default message when user connects
app.get('/', function (req, res) {
  res.send("This is the Protected Structures API."  +
  "\nTry http://127.0.0.1:8000/list" +
  "\n or http://127.0.0.1:8000/structure/<id>");
});


// List all structures
app.get('/list', function (req, res) {
  structDB.all("SELECT * FROM structures", function(err, row) {
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

// List structure specified by id
app.get('/structure/:id', function (req, res) {
  structDB.all("SELECT structurename, description, lat, long FROM structures WHERE id = " + req.params.id, function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

//=========== Add Bus Stops to a separate database =============
var stopDB = new sqlite3.Database(':memory:');
// Parse JSON files that contains the locations & times of bus stops
var stopLoc = JSON.parse(fs.readFileSync('Stops.json', 'utf8'));
var stopTime = JSON.parse(fs.readFileSync('Stop_Times.json', 'utf8'));

stopDB.serialize(function() {
  stopDB.run('CREATE TABLE stops (id INTEGER PRIMARY KEY AUTOINCREMENT, stop_id TEXT, stop_name TEXT, stop_lat REAL, stop_lon REAL, stop_time TEXT, stop_sequence INTEGER)');
  console.log("Table created");
  var stmtStop = stopDB.prepare('INSERT INTO stops (stop_id,stop_name,stop_lat,stop_lon) VALUES (?,?,?,?)');

  // Loop through each JSON object and add contents to database
  for(var i=0; i<stopLoc.length; i++) {
    stmtStop.run(stopLoc[i].stop_id
            , stopLoc[i].stop_name
            , stopLoc[i].stop_lat
            , stopLoc[i].stop_lon
          );
  }
  stmtStop.finalize();

  for(var j=0; j<stopTime.length; j++) {

    // Parse Stop_Times JSON objects
    // Add Stop_Times column in stops table
    // by comparing stop_id of both files
    var stmtTime = stopDB.run('UPDATE stops SET stop_time = "' + stopTime[j].arrival_time +
    '", stop_sequence = ' + stopTime[j].stop_sequence + ' WHERE stop_id LIKE "' + stopTime[j].stop_id + '"');
  }
});

// Default message when user connects
app.get('/stops', function (req, res) {
  stopDB.all("SELECT * FROM stops", function(err, row) {
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});
