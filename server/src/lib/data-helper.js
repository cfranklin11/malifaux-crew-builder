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

    // Parse CSV to get data
    parser = parse({delimiter: ',', columns: true}, function(err, data) {
      // Rows array has a lot of extra data, so filter to get
      // only URL and status code
      let characterRows = data.map((character, index) => {
        let {
          name,
          faction,
          station,
          characteristics,
          limit,
          ss_cost: sscost,
          ss_cache: sscache
        } = character;

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

      let factionRows = characterRows.filter(row => {
        return req.faction.toLowerCase().replace(/\s/g, '-') ===
          row.faction.toLowerCase().replace(/\s/g, '-');
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