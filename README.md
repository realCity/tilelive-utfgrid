[![Build
Status](https://travis-ci.org/mojodna/tilelive-utfgrid.png)](https://travis-ci.org/mojodna/tilelive-utfgrid)

# tilelive-utfgrid

A [tilelive](https://github.com/mapbox/tilelive.js) provider that allows
[UTFGrid](https://github.com/mapbox/utfgrid-spec)-generating sources (i.e.
those with a `getGrid()` method) to be treated as though they generate data
tiles rather than treating grid output as "special".

This registers the `utfgrid+` prefix and currently supports the `mbtiles:`
(using [node-mbtiles](https://github.com/mapbox/node-mbtiles)) and `tmstyle:`
(using [tilelive-tmstyle](https://github.com/mojodna/tilelive-tmstyle))
protocols (although it will work with any source that implements `getGrid()`).

## Usage

To fetch grids from an MBTiles archive using `getTile`:

```javascript
"use strict";

var MBTiles = require("mbtiles"),
    tilelive = require("tilelive");

var UTFGrid = require("tilelive-utfgrid")(tilelive);

MBTiles.registerProtocols(tilelive);
UTFGrid.registerProtocols(tilelive);

tilelive.load("utfgrid+mbtiles:///path/to/archive.mbtiles", function(err, source) {
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
```
