// Main source for Structures API
// Import required resources
var express = require('express');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
// Read in JSON file
var structure = JSON.parse(fs.readFileSync('Structures.json', 'utf8'));
// Create HTTP server app with Express
var app = express();
var portNo = 8000;
var db = new sqlite3.Database(':memory:');

// Default message when user connects
app.get('/', function (req, res) {
  res.send('This is the Protected Structures API.' +
  '\n\nTry http://127.0.0.1:8000/list');
});

// Create Database and save structures into table
db.serialize(function() {
  db.run('CREATE TABLE structures (id INTEGER PRIMARY KEY AUTOINCREMENT, rps_no REAL, structurename TEXT, description TEXT, streetnumber INTEGER, streetaddress TEXT, townland TEXT, lat REAL, long REAL)');

  var stmt = db.prepare('INSERT INTO structures (rps_no,structurename,description,streetnumber,streetaddress,townland,lat,long) VALUES (?,?,?,?,?,?,?,?)');

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

// List all structures
app.get('/list', function (req, res) {
  db.all("SELECT * FROM structures", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

// Listen on specified port
var server = app.listen(portNo);
