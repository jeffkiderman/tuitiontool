# tuitiontool

#### Run
To run, execute `npm start`.
This will start the webserver.  Then navigate your browser to `localhost:3000`.  This doesn't do anything interesting right now.  Essentially just a hello world.

#### Development
While developing js, run `npm run watch-js`.  This will continuously rebuild and package your JS files.  
You'll need to kill this using jobs / kill %X.

#### Typechecker
Flow is a typechecker built on top of javascript. Include `// @flow` at the top of your js file to allow flow to analyze your file.
To check for flow errors, run
`npm run-script flow`

#### File structure
Now the main app runs out of the root index.js.  Not sure what the correct structure is.  Can come back to it later.
