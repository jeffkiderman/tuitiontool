'use strict';

var fs = require('fs');
var denodeify = require('denodeify');
var readFile = denodeify(fs.readFile);
var readline = require('readline');
var googleAuth = require('google-auth-library');

// scope is the permission the user will be required to grant our app.
// Starting this as read-only for our spreadsheet. can always change this later.
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// token path is where to store the TOKEN once the user authorizes our app
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
     process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-tuition-tool-credential.json';

function getAuthToken() {
  // Load client secrets from a local file.
  return readFile('../tuitiontool-secrets/client_secret.json')
    // Authorize a client with the loaded credentials,
    .then((content) => authorize(JSON.parse(content)));
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  return readFile(TOKEN_PATH)
    .then((token) => {
      oauth2Client.credentials = JSON.parse(token);
      return oauth2Client;
    })
    .catch((err) => getNewToken(oauth2Client));
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client) {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
  });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
  });
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        //callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
  fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
  if (err.code != 'EEXIST') {
      throw err;
  }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
}

const SheetsAuth = {
  getAuthToken: getAuthToken,
};

module.exports = SheetsAuth;
