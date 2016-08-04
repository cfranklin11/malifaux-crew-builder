'use strict';

var dataHelper, self;
var fs = require('fs');
var parse = require('csv-parse');

var DATA_PATH = '/character-db.csv';

dataHelper = self = {
  getData: function(req, res, next) {
    var parser;

    // Parse CSV to get data
    parser = parse({delimiter: ',', columns: true}, function(err, data){
        // Rows array has a lot of extra data, so filter to get
        // only URL and status code
        let characterRows = data.map((character, index) => {
          let {
            name,
            faction,
            station,
            characteristics,
            limit,
            sscost,
            sscache
          } = character;

          return {
            name,
            faction,
            station,
            characteristics,
            limit,
            sscost,
            sscache,
            id: index
          };
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
    });

    fs.createReadStream(__dirname + DATA_PATH).pipe(parser);
  }
};

module.exports = dataHelper;