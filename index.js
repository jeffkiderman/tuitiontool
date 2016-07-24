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

// guessing this registers the template engine with the webserver
// main has the entire http response

/*app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
}));
// dunno
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// webserver responds to root requests (localhost:3000)
app.get('/', (request, response) => {
  // home.hbs is a template with a name variable that needs assignment
  response.render('home', {
    name: 'John'
  })
});

app.get('/tool', (request, response) => {
  SheetsAuth.callWithAuth(
      SheetsQuery.listSchoolsCurr((x) => response.render('home', { name: x})));
  // home.hbs is a template with a name variable that needs assignment
    
    console.log(SheetsQuery.ssdata);
});
*/

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
