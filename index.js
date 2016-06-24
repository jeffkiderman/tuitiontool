// index.js
// @flow
require('./app/index');

const path = require('path');
// webserver
const express = require('express');
// i think this is the template engine (to render layouts)
const exphbs = require('express-handlebars');
// localhost:3000
const port = 3000;

app = express();
// guessing this registers the template engine with the webserver
// main has the entire http response
app.engine('.hbs', exphbs({
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

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
