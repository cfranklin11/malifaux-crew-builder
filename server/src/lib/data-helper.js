'use strict';

var dataHelper, self;
var fs = require('fs');
var path = require('path');
var parse = require('csv-parse');

var DATA_PATH = '../../src/lib';
var FILE_NAME = '/character-db.csv';

dataHelper = self = {
  getData: function(req, res, next) {
    var parser;
    const MercRegExp = /mercenary/i;

    // Parse CSV to get data
    parser = parse({delimiter: ',', columns: true}, function(err, data) {
      const callFaction = req.faction.toLowerCase().replace(/\s/g, '-');
      let factionRows = data
        .filter(row => {
          const thisFaction = row.faction.toLowerCase().replace(/\s/g, '-');

          // Filter for characters of the called faction or mercenaries
          return callFaction === thisFaction ||
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
          sscost = callFaction === faction ? sscost : parseFloat(sscost) + 1;

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

      // req.data.leaders = factionRows.filter(row => {
      //   const leaderRegExp = /master|henchman/i;
      //   return leaderRegExp.test(row.station);
      // });

      // req.data.followers = factionRows.filter(row => {
      //   const masterRegExp = /master/i;
      //   return !masterRegExp.test(row.station);
      // });

      next();
    });

    fs.createReadStream(path.join(__dirname, DATA_PATH) + FILE_NAME)
      .pipe(parser);
  }
};

module.exports = dataHelper;