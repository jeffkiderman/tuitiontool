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

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
});
