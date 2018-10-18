//Step 1: Creating map object
var map = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 4
});

//Step 2: Create a function, which takes in the a value and multiply by 3 for the size of the circle
function markerSize(magnitude) {
    return magnitude * 3;
};

var markers = new L.FeatureGroup();

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


function getColor(d) {
    return d < 1 ?  'green' :
           d < 2  ? 'yellowgreen' :
           d < 3  ? 'forestgreen' :
           d < 4  ? 'brown' :
                     'red';
}

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(mag) {
    if(mag < 1)
    {
      return "green";
    }
    else if(mag < 2)
    {
      return "yellowgreen";
    }
    else if(mag < 3)
    {
      return "forestgreen";
    }
    else if(mag < 4)
    {
      return "brown";
    }
    else 
    {
      return "red";
    }
}


d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2>" + "Magnitude =" + feature.properties.mag + "</h2>");
    },
   pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, 
                    { 
                        radius: markerSize(geoJsonPoint.properties.mag),
                        stroke : true,
                        color : '#3388ff'
                     });
        },
  }).addTo(map);
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magThreshold = [0,1,2,3,4,5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magThreshold.length; i++) {
        div.innerHTML +=
     '<i style="background:' + getColor(magThreshold[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
             magThreshold[i] + (magThreshold[i + 1] ? '&ndash;' + magThreshold[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
