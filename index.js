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
var datafromss = null;
var token; // should probably let SheetsAuth do the caching, but OK for now
// serve static resources
app.use(express.static(path.join(__dirname + '/app/public')));

//Serves the data
app.get('/sourcedata', (request,response) => {
  if (datafromss !== null) {
    console.log('using cache');
    response.send(datafromss);
  }
  // we already looked up our auth tokens
  if (token) {
    SheetsQuery.listSchoolsCurr(token)
      .then((payload) => {
        datafromss = payload;
        return response.send(payload);
      });
  } else {
    // fetch our auth token (from disk or google)
    SheetsAuth.getAuthToken()
      .then((newToken) => {
        token = newToken;
        return SheetsQuery.listSchoolsCurr(token);
      })
      .then((payload) => {
        datafromss = payload;
        return response.send(payload);
      });
  }
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
});
