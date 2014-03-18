"use strict";

var MBTiles = require("mbtiles"),
    tilelive = require("tilelive");

var UTFGrid = require("../")(tilelive);

MBTiles.registerProtocols(tilelive);
UTFGrid.registerProtocols(tilelive);

tilelive.load("utfgrid+mbtiles://../test/fixtures/plain_2.mbtiles", function(err, source) {
  if (err) {
    console.error(err.stack);
    process.exit(1);
  }

  return source.getTile(0, 0, 0, function(err, data, headers) {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }

    console.log("Headers:", headers);
    console.log("UTFGrid:", data);
  });
});
