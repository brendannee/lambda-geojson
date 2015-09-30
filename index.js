var _ = require('underscore');
var fs = require('fs');

// Create globals so leaflet thinks we're in a browser
GLOBAL.window = {};
GLOBAL.document = {
  documentElement: {
    style: {}
  },
  getElementsByTagName: function() { return []; },
  createElement: function() { return {}; }
};
GLOBAL.navigator = {
  userAgent: 'nodejs'
};
GLOBAL.L = require('leaflet');

var leafletPip = require('leaflet-pip');
var polyline = require('polyline');
var util = require('util');

var countiesData;
var statesData;

try {
  countiesData = JSON.parse(fs.readFileSync('data/counties.geojson', 'utf8'));
} catch(e) {
  console.error('Invalid counties file');
  process.exit(1);
}

try {
  statesData = JSON.parse(fs.readFileSync('data/states.json', 'utf8'));
} catch(e) {
  console.error('Invalid states file');
  process.exit(1);
}

var countiesLayer = L.geoJson(countiesData);


exports.handler = function(event, context) {
  var counties = {};
  var encodedPaths = event;

  if (!encodedPaths || !encodedPaths.length) {
    return context.done(new Error('Invalid Input'));
  }


  encodedPaths.forEach(function(encodedPath) {
    // Decode encoded polyline
    var decodedPath = polyline.decode(encodedPath);

    // If no points, skip
    if(decodedPath.length === 0) {
      return;
    }

    // Determine counties for points along path
    // Downsample points to speed up query
    decodedPath.forEach(function(point, idx) {
      // use first, last and every 20th point
      if (idx === 1 || idx % 20 === 0 || idx === (decodedPath.length - 1)) {
        var countyLayer = leafletPip.pointInLayer([point[1], point[0]], countiesLayer, true);

        if(countyLayer) {
          var county = countyLayer[0].feature.properties;
          counties[county.STATE + county.COUNTY] = {
            id: county.STATE + county.COUNTY,
            state: statesData[county.STATE],
            county: county.NAME
          };
        }
      }
    });
  });

  context.done(null, _.values(counties));
};
