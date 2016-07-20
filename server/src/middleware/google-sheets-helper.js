import GoogleSpreadsheet from 'google-spreadsheet';
import auth from '../config/auth.js';

let sheetsHelper = {
  // Start by getting the sheet by ID
  getSpreadsheet: (req, res, next) => {
    // First option is to use ID entered into the form, then any environment
    // variables
    let doc = new GoogleSpreadsheet(auth.doc_id);
    sheetsHelper.setAuth(req, res, next, doc);
  },

  // Get auth credentials to make changes to sheet
  setAuth: (req, res, next, doc) => {
    let clientEmail = auth.client_email;
    let privateKey = auth.private_key;

    // Credentials obtained via environment variables imported to auth.js
    let credsJson = {
      clientEmail,
      privateKey
    };

    doc.useServiceAccountAuth(credsJson, err => {
      if (err) {
        console.log(err);
        return res.send(err);
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
        return res.status(400).send(err);
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
        let characterRows = rows.map(item => {
          let {name, faction, station, characteristics, limit, sscost,
            sscache} = item;
          return {name, faction, station, characteristics, limit, sscost,
            sscache};
        });

        console.log(characterRows);

        req.characters = characterRows;

        sheetsHelper.getUpgrades(req, res, next, spreadsheet);
    });
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
    });
  }
};

export default sheetsHelper;
