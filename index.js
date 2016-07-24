'use strict';

// index.js
// @flow
const SheetsAuth = require('./app/SheetsAuth');
const SheetsQuery = require('./app/SheetsQuery');
const async = require('async');
const path = require('path');
// webserver
const express = require('express');
// i think this is the template engine (to render layouts)
const exphbs = require('express-handlebars');
// localhost:3000
const port = 3000;
const app = express();
var datafromss;

//Serves index.html, while also obtaining authorization/data from Google spreadsheets for server
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/index.html'));                
});

//Serves the javascript file with scripts for index.html
app.get('/pagescripts.js',(request,response) => {
    response.sendFile(path.join(__dirname + '/pagescripts.js'));
});

//Serves the data
app.get('/sourcedata',(request,response) => {
    SheetsAuth.callWithAuth(
      SheetsQuery.listSchoolsCurr((x) => response.send(x)));
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
});
