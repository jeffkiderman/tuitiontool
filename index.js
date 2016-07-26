'use strict';

// index.js
// @flow
const SheetsAuth = require('./app/SheetsAuth');
const SheetsQuery = require('./app/SheetsQuery');
const path = require('path');
// webserver
const express = require('express');
// localhost:3000
const port = 3000;
const app = express();
var datafromss;

// serve static resources
app.use(express.static(path.join(__dirname + '/app/public')));

//Serves the data
app.get('/sourcedata', (request,response) => {
  SheetsAuth.callWithAuth(
    SheetsQuery.listSchoolsCurr((x) => response.send(x)));
});

//Serves the javascript file with queries for dataset
app.get('/pagescripts.js',(request,response) => {
    response.sendFile(path.join(__dirname + '/queries.js'));
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
});
