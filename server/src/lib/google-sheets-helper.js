/* eslint camelcase: ["error", {properties: "never"}]*/

import GoogleSpreadsheet from 'google-spreadsheet';
import auth from '../config/auth.js';

// const factionRegExp = new RegExp(req.faction.replace(/\s/g, '-'), 'i');
const mercRegExp = /mercenary/i;

const sheetsHelper = {
  createFactionRegExp: faction => {
    const factionRegExp = new RegExp(faction.replace(/\s/g, '-'), 'i');
    return factionRegExp;
  },

  // Start by getting the sheet by ID
  getSpreadsheet: (req, res, next) => {
    // First option is to use ID entered into the form, then any environment
    // variables
    const doc = new GoogleSpreadsheet(auth.docID);
    sheetsHelper.setAuth(req, res, next, doc);
  },

  // Get auth credentials to make changes to sheet
  setAuth: (req, res, next, doc) => {
    const {client_email, private_key} = auth;

    // Credentials obtained via environment variables imported to auth.js
    const credsJson = {
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
    const factionRegExp = sheetsHelper.createFactionRegExp(req.faction);
    const characterSheet = spreadsheet.worksheets[0];

    characterSheet.getRows({offset: 1, orderby: 'col2'},
      (err, rows) => {
        if (err) {
          console.log(err);
          return next();
        }

        const factionRows = rows
          .filter(row => {
            const thisFaction = row.faction.replace(/\s/g, '-');

            // Filter for characters of the called faction or mercenaries
            return factionRegExp.test(thisFaction) ||
              mercRegExp.test(row.characteristics);
          })
          // Rows array has a lot of extra data, so map to get
          // only relevant characteristics
          .map(character => {
            let {
              name,
              faction,
              station,
              characteristics,
              limit,
              sscost,
              sscache
            } = character;

            // If the character is a non-faction mercenary, increase cost by 1
            sscost = factionRegExp.test(faction.replace(/\s/g, '-')) ?
              sscost : parseFloat(sscost) + 1;

            return {
              name,
              faction,
              station,
              characteristics,
              limit,
              sscost,
              sscache
            };
          }
        );

        req.data = {};
        req.data.characters = factionRows;

        // Only need to get upgrades once,
        // and Guild is the default faction on load
        if (req.faction === 'guild') {
          sheetsHelper.getUpgrades(req, res, next, spreadsheet);
        } else {
          next();
        }
      }
    );
  },

  getUpgrades: (req, res, next, spreadsheet) => {
    const upgradeSheet = spreadsheet.worksheets[1];

    upgradeSheet.getRows({offset: 1, orderby: 'col2'},
      (err, rows) => {
        if (err) {
          console.log(err);
          return next();
        }

        // Rows array has a lot of extra data, so map to get
        // only relevant characteristics
        const upgradeRows = rows.map(upgrade => {
          const {
            name,
            faction,
            cost,
            limit,
            namerestrictions,
            characteristicrestrictions1,
            characteristicrestrictions2,
            islimited
          } = upgrade;

          return {
            name,
            faction,
            cost,
            limit,
            namerestrictions,
            characteristicrestrictions1,
            characteristicrestrictions2,
            islimited
          };
        });

        req.data.upgrades = upgradeRows;

        next();
      }
    );
  }
};

export default sheetsHelper;
