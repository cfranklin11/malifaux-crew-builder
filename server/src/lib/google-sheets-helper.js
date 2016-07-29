/* eslint camelcase: ["error", {properties: "never"}]*/

import GoogleSpreadsheet from 'google-spreadsheet';
import auth from '../config/auth.js';

let sheetsHelper = {
  // Start by getting the sheet by ID
  getSpreadsheet: (req, res, next) => {
    // First option is to use ID entered into the form, then any environment
    // variables
    let doc = new GoogleSpreadsheet(auth.docID);
    sheetsHelper.setAuth(req, res, next, doc);
  },

  // Get auth credentials to make changes to sheet
  setAuth: (req, res, next, doc) => {
    let {client_email, private_key} = auth;

    // Credentials obtained via environment variables imported to auth.js
    let credsJson = {
      client_email,
      private_key
    };

    doc.useServiceAccountAuth(credsJson, err => {
      if (err) {
        console.log('creds error ' + err);
        return res.send(err.toString());
      }

      sheetsHelper.getWorksheets(req, res, next, doc);
    });
  },

  // Get correct sheet, depending on whether your reading or writing
  getWorksheets: (req, res, next, doc) => {
    doc.getInfo((err, spreadsheet) => {
      if (!spreadsheet) {
        return res.status(400).send('The Google Sheets ID was invalid.');
      }

      if (err) {
        console.log(err);
        return res.status(400).send(err.toString);
      }

      sheetsHelper.getCharacters(req, res, next, spreadsheet);
    });
  },

  getCharacters: (req, res, next, spreadsheet) => {
    let characterSheet = spreadsheet.worksheets[0];

    characterSheet.getRows({offset: 1, orderby: 'col2'},
      (err, rows) => {
        if (err) {
          console.log(err);
          return next();
        }

        // Rows array has a lot of extra data, so filter to get
        // only URL and status code
        let characterRows = rows.map(character => {
          let {name, faction, station, characteristics, limit, sscost,
            sscache} = character;
          return {name, faction, station, characteristics, limit, sscost,
            sscache};
        });

        let factionRows = characterRows.filter(row => {
          return req.faction.toLowerCase() === row.faction.toLowerCase();
        });

        req.data = {};

        req.data.leaders = factionRows.filter(row => {
          const leaderRegExp = /master|henchman/i;
          return leaderRegExp.test(row.station);
        });

        req.data.followers = factionRows.filter(row => {
          const masterRegExp = /master/i;
          return !masterRegExp.test(row.station);
        });

        next();

        // sheetsHelper.getUpgrades(req, res, next, spreadsheet);
      }
    );
  },

  getUpgrades: (req, res, next, spreadsheet) => {
    let upgradeSheet = spreadsheet.worksheets[1];

    upgradeSheet.getRows({offset: 1, orderby: 'col2'},
      (err, rows) => {
        if (err) {
          console.log(err);
          return next();
        }

        // Rows array has a lot of extra data, so filter to get
        // only URL and status code
        let upgradeRows = rows.map(item => {
          let {name, faction, cost, limit, namerestrictions,
            characteristicrestrictions1, characteristicrestrictions2,
            islimited} = item;
          return {name, faction, cost, limit, namerestrictions,
            characteristicrestrictions1, characteristicrestrictions2,
            islimited};
        });

        console.log(upgradeRows);

        req.upgrades = upgradeRows;

        next();
      }
    );
  }
};

export default sheetsHelper;
