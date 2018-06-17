url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Function to determine marker size based on population
//function markerSize(population) {
//  return population / 40;
//}

// Get data, create layer for faultlines.
var faultMap = L.featureGroup()
//d3.csv("./Resources/PB2002_steps.csv", function(error, data){
d3.csv("PB2002_steps.csv", function(error, data){
    if (error) return console.warn(error);
    for (i=0; i<data.length; i++) {
        var points = [[+data[i].StartLat, +data[i].StartLong], [+data[i].FinalLat, +data[i].FinalLong]];
        var line = L.polyline(points, {
                color: "orange",
                weight: 2
        });
        faultMap.addLayer(line);
    };
});

// Perform a GET request to the query URL
d3.json(url, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  //createFeatures(data.features);
});

function colorDots(mag) {
    if (mag>=0 && mag<1) {
        return "#00FD51";
    }
    if (mag>=1 && mag<2) {
        return "#C7FD00";
    }
    if (mag>=2 && mag<3) {
        return "#FDF200";
    }
    if (mag>=3 && mag<4) {
        return "#F9CC00";
    }
    if (mag>=4 && mag<5) {
        return "#FD6B00";
    }
    if (mag>=5) {
        return "#FD1300";
    }
}
    
function createFeatures(quake_data){
    // Define arrays to hold created city and state markers
    var cityMarkers = [];
    var stateMarkers = [];
    

    var lat_long
    for (var i = 0; i < quake_data.length; i++) {
      // Setting the marker radius for the state by passing population into the markerSize function
      lat_long = [ quake_data[i].geometry.coordinates[1], quake_data[i].geometry.coordinates[0], quake_data[i].geometry.coordinates[2]]
      stateMarkers.push(
        //lat_long = quake_data[i].geometry.coordinates 
        //L.circle(quake_data[i].geometry.coordinates, {
        L.circle(lat_long, {
          stroke: false,
          fillOpacity: 0.5,
          //color: "white",
          fillColor: colorDots(quake_data[i].properties.mag),
         radius: quake_data[i].properties.mag*5000  
        //}).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}`));
        }).bindPopup(`<h3>${quake_data[i].properties.place}</h3><hr><p>${new Date(quake_data[i].properties.time)}`)
      );
    };
 

    // Define variables for our base layers
    var streetmap = L.tileLayer(
      "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiZHlsYnVyZ2VyIiwiYSI6ImNqaHNkZXpyYTAxdDAzcXJ6dzA3NHR5dXMifQ.oZt5CGSYffy4dZqIFSQciQ"
    );
    var darkmap = L.tileLayer(
      "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiZHlsYnVyZ2VyIiwiYSI6ImNqaHNkZXpyYTAxdDAzcXJ6dzA3NHR5dXMifQ.oZt5CGSYffy4dZqIFSQciQ"
    );

    // Create two separate layer groups: one for cities and one for states
    var states = L.layerGroup(stateMarkers);
    //var cities = L.layerGroup(cityMarkers);
    var fault_lines = L.layerGroup(faultMap);

    // Create a baseMaps object
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };

    // Create an overlay object
    var overlayMaps = {
      "Earthquakes": states,
      "Fault Lines": faultMap
    };

    // Define a map object
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, states, fault_lines]
    });

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);


    // Add a legend.
    function getColor(d) {
        switch(d) {
            case 1: return "#00FD51";
            case 2: return "#C7FD00";
            case 3: return "#FDF200";
            case 4: return "#F9CC00";
            case 5: return "#FD6B00";
            case 6: return "#FD1300";
            default: return "#ffff33";
        }
    };
    var Legend = L.control({position: "bottomright"});
    Legend.onAdd = function(map) {
        var legdiv = L.DomUtil.create('div', 'info legend'),
            status = [1, 2, 3, 4, 5, 6],
            labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
        // loop through our status intervals and generate a label with a coloured square for each interval
        for (var i = 0; i < status.length; i++) {
            legdiv.innerHTML +=
                '<i style="background:' + getColor(status[i]) + '"></i> ' +	(status[i] ? labels[i] + '<br>' : '+');
        }
        return legdiv;
    };
    Legend.addTo(myMap);
}