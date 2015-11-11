
// ======== Main source for Structures API ========
// Import required resources
var express = require('express');
var router = express.Router();
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
// Read in Structures file and parse to JSON
var structure = JSON.parse(fs.readFileSync('Structures.json', 'utf8'));

// =========== Initialize HTTP Server =============
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); //

var portNo = 8000;
// Listen on specified port
var server = app.listen(portNo);
// ================================================
// ============= Structures Database ==============
var structDB = new sqlite3.Database(':memory:');
var rowString;

// Create Database and save structures into table
structDB.serialize(function() {
  structDB.run('CREATE TABLE structures '
  + '(id INTEGER PRIMARY KEY AUTOINCREMENT, rps_no REAL, structurename TEXT, description TEXT, '
  + ' streetnumber INTEGER, streetaddress TEXT, townland TEXT, lat REAL, long REAL)');

  var stmt = structDB.prepare('INSERT INTO structures '
  + '(rps_no,structurename,description,streetnumber,streetaddress,townland,lat,long) VALUES (?,?,?,?,?,?,?,?)');
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


// ================================================
// ================= HTTP Server ==================

// Default message when user connects
app.get('/', function (req, res) {
  res.render('index.ejs');
});

var Structure = function(id, rps_no,structurename,description,streetnumber,streetaddress,townland,lat,long){
  this.id = (id) ? id : 0;
	this.rps_no = (rps_no) ? rps_no : "";
  this.structurename = (structurename) ? structurename : "None";
  this.description = (description) ? description : "None";
	this.streetnumber = (streetnumber) ? streetnumber : "None";
	this.streetaddress = (streetaddress) ? streetaddress : "None";
	this.townland = (townland) ? townland : "None";
  this.lat = (lat) ? lat : "0.0";
  this.long = (long) ? long : "0.0";
}

// List all structures
app.get('/list', function (req, res) {
  structDB.all("SELECT * FROM structures", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
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

app.post('/structure', function (req, res) {
  var structID = (req.body.id) ? req.body.id:0;
  structDB.serialize(function() {
    structDB.each("SELECT * FROM structures WHERE id = " + structID,
      function(err, row) {
        var structure = new Structure (
        row.id, row.rps_no, row.structurename, row.description, row.streetnumber, row.streetaddress, row.townland, row.lat, row.long);

        console.log(structure.id);
        if(typeof(row) == "object") {
          return res.json(structure);
        } else {
          return res.json("Error");
        }
    });
  });
});

//================================================
//================ Bus Stops Table ===============

// Parse JSON files that contains the locations & times of bus stops
var stopLoc = JSON.parse(fs.readFileSync('Stops.json', 'utf8'));
var stopTime = JSON.parse(fs.readFileSync('Stop_Times.json', 'utf8'));

structDB.serialize(function() {
  structDB.run('CREATE TABLE stops (id INTEGER PRIMARY KEY AUTOINCREMENT, stop_id TEXT, stop_name TEXT, stop_lat REAL, stop_long REAL, stop_time TEXT, stop_sequence INTEGER)');
  var stmtStop = structDB.prepare('INSERT INTO stops (stop_id,stop_name,stop_lat,stop_long) VALUES (?,?,?,?)');
  console.log("Stops Table created");
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
    structDB.run('UPDATE stops SET stop_time = "' + stopTime[j].arrival_time +
    '", stop_sequence = ' + stopTime[j].stop_sequence + ' WHERE stop_id LIKE "' + stopTime[j].stop_id + '"');
  }
});

// Default message when user connects
app.get('/stops', function (req, res) {
  structDB.all("SELECT * FROM stops", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

var Stop = function(stop_name, stop_lat, stop_long, stop_time){
	this.stop_name = (stop_name) ? stop_name : "None";
	this.stop_lat = (stop_lat) ? stop_lat : "None";
	this.stop_long = (stop_long) ? stop_long : "999";
	this.stop_time = (stop_time) ? stop_time : "None";
}

// ================================================
// ======= Join Tables To Compare locations =======

// Compare selected structure with nearby bus stops using lat + long values
var stuctString;
app.get('/compare/:id', function (req, res) {
  structDB.serialize(function() {
    structDB.all("SELECT * FROM structures WHERE id = " + req.params.id, function (err, row) {
      structString = JSON.stringify(row, null, '\t');
    });
      structDB.all("SELECT stops.stop_long AS stop_long, stops.stop_lat AS stop_Lat, stops.stop_name AS stop_name, stops.stop_time AS stop_time "
      + "FROM structures LEFT JOIN stops "
      + "ON ROUND(structures.long, 2) = ROUND(stops.stop_long, 2) AND ROUND(structures.lat, 2) = ROUND(stops.stop_lat, 2)"
      + "WHERE structures.id = " + req.params.id, function(err, row) {

        rowString = JSON.stringify(row, null, '\t');
        res.sendStatus("Structure: \n" + structString + "\nNearby Bus stops: " + rowString);
    });
  });
});

app.post('/compare', function(req, res) {
  var structID = (req.body.id) ? req.body.id:0;
  console.log("reached");
  structDB.each("SELECT * FROM structures WHERE id = " + structID, function(err, row) {
    console.log(row.id);
    var newStruct = new Structure (
      row.id, row.rps_no, row.structurename, row.description, row.streetnumber, row.streetaddress, row.townland, row.lat, row.long);

    structDB.serialize(function() {
      structDB.each("SELECT stops.stop_long AS stop_long, stops.stop_lat AS stop_lat, stops.stop_name AS stop_name, stops.stop_time AS stop_time "
      + "FROM structures LEFT JOIN stops "
      + "ON ROUND(structures.long, 1) = ROUND(stops.stop_long, 1) AND ROUND(structures.lat, 1) = ROUND(stops.stop_lat, 1) "
      + "WHERE structures.id = " + structID + " LIMIT 1", function(err, row) {

        var stop = new Stop (
        row.stop_name, row.stop_lat, row.stop_long, row.stop_time);
        //stopArr[i]= stop;

        var linkedSet = new LinkedSet (
          newStruct.id, newStruct.structurename, newStruct.description, newStruct.lat, newStruct.long, stop.stop_name, stop.stop_lat, stop.stop_long, stop.stop_time);

        if(typeof(linkedSet) == "object" && linkedSet.struct_id <= structure.length && linkedSet.struct_id > 0) {
          return res.json(linkedSet);
        } else {
          return res.json("Error");
        }
      });
    });
  });

  var LinkedSet = function(struct_id, struct_name, struct_desc, struct_lat, struct_long, stop_name, stop_lat, stop_long, stop_time){
    this.struct_id = (struct_id) ? struct_id : 0;
    this.struct_name = (struct_name) ? struct_name : "None";
    this.struct_desc = (struct_desc) ? struct_desc : "None";
    this.struct_lat = (struct_lat) ? struct_lat : 0.0;
    this.struct_long = (struct_long) ? struct_long : 0.0;
  	this.stop_name = (stop_name) ? stop_name : "None";
  	this.stop_lat = (stop_lat) ? stop_lat : 0.0;
  	this.stop_long = (stop_long) ? stop_long : 0.0;
  	this.stop_time = (stop_time) ? stop_time : "None";
  }
 });
// ===================== Fin ======================
