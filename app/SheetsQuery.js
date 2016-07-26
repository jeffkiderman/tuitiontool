'use strict';

const google = require('googleapis');
var ssdata = []

function listSchoolsCurr(auth) {
  const sheets = google.sheets('v4');
  const cellRangeRequest = {
    auth: auth,
    spreadsheetId: '1VopOgIvIsop2pn99j_OQ79XsMN71pOW2lcVTqDJicWY',
    range: 'Complete List!A2:E20',
  };
  return new Promise ((resolve, reject) => {
    sheets.spreadsheets.values.get(cellRangeRequest, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var rows = response.values;
      if (rows.length == 0) {
        console.log('No data found.');
      } else {
        //sends "rows" (all the data from the spreadsheet) to variable that can be exported
        ssdata = rows;
        resolve(rows);
      }
    })
  });
}

module.exports = {
  listSchoolsCurr: listSchoolsCurr,
  ssdata: ssdata,
};
