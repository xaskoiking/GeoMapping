//Step 0: Declaring the variables ( API URL)
var apiURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


//Step 1: Creating map object
var map = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 4
});


//----------------- FUNCTIONS -----------------------------#
//Step 2.1: Create a function, which takes in the a value and multiply by 3 for the size of the circle
function markerSize(magnitude) {
    return magnitude * 3;
};


//Step 2.2: Create a function getColor, which will help in assiging the legened layer
function getColor(col) {
    return col < 1 ?  'green' :
           col < 2  ? 'yellowgreen' :
           col < 3  ? 'forestgreen' :
           col < 4  ? 'brown' :
                     'red';
}


//Step 2.3: Create a function chooseColor, which will assign the color based on magnitude size.
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

//Step 4: Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);


//Step 5: Call the API and get the geojson data
d3.json(apiURL, function(data) {
  // 5.1) Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    //5.2)  Adding in the styles
    style: function(feature) {
      return {
        color: "white",
        // 5.3) Select the color based on the magnitude
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // 5.4) On Each feature to add the pop up
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

//Step 6: Adding the legend to the map
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
