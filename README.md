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

## Using a Mapbox Studio Classic project as basis

You can also use a [Mapbox Studio Classic](https://www.mapbox.com/mapbox-studio-classic/#win64) tilemill 2 (.tm2) project to create a UtfGrid, for example using a regular GeoJSON file as layer. In that case, it is slightly more complex, since you need to register several other protocols, as well as manually edit the created project.yml file to add the interactivity layer as in that case, as explained [here](https://www.mapbox.com/help/style-quickstart/#utfgrid).

Required protocols (```npm i tilelive-vector  tilelive-bridge tilelive-utfgrid tilelive-tmsource tilelive-tmstyle```) and register them as follows:
```
require('tilelive-vector'  ).registerProtocols(tilelive);               // to create vector tiles
require('tilelive-bridge'  ).registerProtocols(tilelive);               // to bridge/connect to a geojson file 
require('tilelive-utfgrid' )(tilelive).registerProtocols(tilelive);     // to create an UtfGrid source
require('tilelive-tmsource')(tilelive).registerProtocols(tilelive);     // to open the geojson file in a tm2 project
require('tilelive-tmstyle' )(tilelive).registerProtocols(tilelive);     // to open a Mapbox Studio Classic tmp2 project
```
And use the following code fragment to load a layer (note that `utfgrid=` is case-sensitive and needs to be added as a prefix).
```
tilelive.load("utfgrid+tmstyle:///path/to/project.tm2", function(err, source) { ...
```
In case you not only need to serve a UtfGrid but also raster tiles, take a look at [csWeb-tile](https://github.com/TNOCS/csWeb-tile), which creates two service endpoints simultaneously (host:port//yourprojectname/z/x/y.png and host:port//yourprojectname/z/x/y.grid.json). 
