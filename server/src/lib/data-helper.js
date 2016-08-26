'use strict';

var fs = require('fs');
var path = require('path');
var parse = require('csv-parse');

var DATA_PATH = '../../src/lib';
var FILE_NAME = '/character-db.csv';

var dataHelper = {
  getData: function(req, res, next) {
    var parser;
    const MercRegExp = /mercenary/i;

    // Parse CSV to get data
    parser = parse({delimiter: ',', columns: true}, function(err, data) {
      if (err) {
        console.log(err);
        return next();
      }

      const factionRegExp = new RegExp(req.faction.replace(/\s/g, '-'), 'i');
      let factionRows = data
        .filter(row => {
          const thisFaction = row.faction.replace(/\s/g, '-');

          // Filter for characters of the called faction or mercenaries
          return factionRegExp.test(thisFaction) ||
            MercRegExp.test(row.characteristics);
        })
        .map(character => {
          let {
            name,
            faction,
            station,
            characteristics,
            limit,
            ss_cost: sscost,
            ss_cache: sscache
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
        });

      req.data = {};
      req.data.characters = factionRows;

      next();
    });

    fs.createReadStream(path.join(__dirname, DATA_PATH) + FILE_NAME)
      .pipe(parser);
  }
};

module.exports = dataHelper;
