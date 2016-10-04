"use strict";

var url = require("url");

var PREFIX = "utfgrid+";

function isEmptyGrid(grid) {
  return grid.keys.length <= 1;
}

module.exports = function(tilelive, options) {
  var UTFGrid = function(uri, callback) {
    uri = url.parse(uri, true);

    uri.protocol = uri.protocol.replace(PREFIX, "");

    return tilelive.load(uri, function(err, source) {
      if (err) {
        return callback(err);
      }

      if (typeof(source.getGrid) !== "function") {
        return callback(new Error("No getGrid() method for " + uri));
      }

      // proxy source methods
      this.getTile = function getTileInterceptor(z, x, y, callback) {
        source.getGrid(z, x, y, function getTileCallbackInterceptor(err, tile, options) {
          if(err) return callback(err, tile, options);
          
          if(isEmptyGrid(tile)) return callback(err, {solid: '0,0,0,0'}, options);
          
          return callback(err, new Buffer(JSON.stringify(tile)), options);
        });
      }
      
      if(source.putTile) {
        this.putTile = function putTileInterceptor(z, x, y, buffer, callback) {
          source.putGrid(z, x, y, JSON.parse(buffer), callback);
        }
      }

      ["getInfo", "putInfo", "startWriting", "stopWriting", "close"].forEach(function(method) {
        if (source[method]) {
          this[method] = source[method].bind(source);
        }
      }.bind(this));

      return callback(null, this);
    }.bind(this));
  };

  UTFGrid.registerProtocols = function(tilelive) {
    // TODO iterate over previously registered protocols and prepend this?
    tilelive.protocols[PREFIX + "carto+file:"] = this;
    tilelive.protocols[PREFIX + "mapnik:"] = this;
    tilelive.protocols[PREFIX + "mbtiles:"] = this;
    tilelive.protocols[PREFIX + "tmstyle:"] = this;
  };

  UTFGrid.registerProtocols(tilelive);

  return UTFGrid;
};
