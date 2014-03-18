/*global describe, it, before, beforeEach, after, afterEach */
"use strict";

var assert = require("assert");

var async = require("async"),
    MBTiles = require("mbtiles"),
    tilelive = require("tilelive-cache")(require("tilelive"));

var UTFGrid = require("../")(tilelive);

MBTiles.registerProtocols(tilelive);
UTFGrid.registerProtocols(tilelive);


describe("UTFGrid", function() {
  var grid,
      mbtiles;

  before(function(done) {
    var uri = "mbtiles://./test/fixtures/plain_2.mbtiles";

    return async.series({
      mbtiles: async.apply(tilelive.load, uri),
      grid: async.apply(tilelive.load, "utfgrid+" + uri)
    }, function(err, results) {
      if (err) {
        return done(err);
      }

      mbtiles = results.mbtiles;
      grid = results.grid;

      return done();
    });
  });

  it("should fetch grids as tiles", function(done) {
    return async.parallel({
      mbtiles: async.apply(mbtiles.getGrid, 0, 0, 0),
      grid: async.apply(grid.getTile, 0, 0, 0)
    }, function(err, results) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(results.mbtiles, results.grid);

      return done();
    });
  });
});
