'use strict';

const google = require('googleapis');
var ssdata = []

function listSchoolsCurr(responseCallback) {
  return function listSchools(auth) {
    const sheets = google.sheets('v4');
		const cellRangeRequest = {
      auth: auth,
    	spreadsheetId: '1VopOgIvIsop2pn99j_OQ79XsMN71pOW2lcVTqDJicWY',
    	range: 'Complete List!A2:E2',
		};
    sheets.spreadsheets.values.get(cellRangeRequest, function(err, response) {
      if (err) {
    		console.log('The API returned an error: ' + err);
    		return;
      }
      var rows = response.values;
    
    if (rows.length == 0) {
    		console.log('No data found.');
      } else {
    		/* this is for debugging
            console.log('Received Schools:');
    		for (var i = 0; i < rows.length; i++) {
        	var row = rows[i];;
        	// Print column A from this row
        	console.log(row[0]);
        }*/
     
    //sends "rows" (all the data from the spreadsheet) to variable that can be exported      
    ssdata=rows;
    //console.log(ssdata);
    responseCallback(rows);
        }
    });
  };
}

module.exports = {
  listSchoolsCurr: listSchoolsCurr,
    ssdata:ssdata,
};
