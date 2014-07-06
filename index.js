"use strict";

var url = require("url");

var PREFIX = "utfgrid+";

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
      this.getTile = source.getGrid.bind(source);

      ["getInfo", "close"].forEach(function(method) {
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
