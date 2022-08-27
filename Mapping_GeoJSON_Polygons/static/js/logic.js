// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
    "Streets": streets,
    "Satellite Streets": satelliteStreets
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
    center: [43.7, -79.3],
    zoom: 11,
    layers: [satelliteStreets]
});

// Create a style for the lines.
let myStyle = {
    color: "#ffffa1",
    weight: 2
}

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);
  
// Then we add our 'streets' tile layer to the map.
//streets.addTo(map);

// Accessing the Toronto neighbourhoods GeoJSON URL
let torontoHoods = "https://raw.githubusercontent.com/Highpointer/Mapping_Earthquakes/main/torontoNeighborhoods.json";
// Accessing the airport GeoJSON URL
let airportData = "https://raw.githubusercontent.com/Highpointer/Mapping_Earthquakes/main/majorAirports.json";
// Accessing the Toronto airline routes GeoJSON URL.
let torontoData = "https://raw.githubusercontent.com/Highpointer/Mapping_Earthquakes/main/torontoRoutes.json";

console.log("Airport Data", airportData);
console.log("0. d3.json(airportData).then(function(data)", d3.json(airportData));
// Grabbing our GeoJSON data.
d3.json(torontoHoods).then(function(data) {
    console.log(data);
  // Creating a GeoJSON layer with the retrieved data.
    L.geoJSON(data).addTo(map);
});

// console.log("3. Going to display airport codes when clicking on marker");
// L.geoJson(data, {
//     pointToLayer: function(feature, latlng) {
//             return L.marker(latlng);
//     },
//     onEachFeature: function(feature, layer) {
//           layer.bindPopup("<h2>" + "Airport Code: " + feature.properties.faa + "</h2>" + "<hr>" + "<h3>" + "Airport Name: " + feature.properties.name + "</h3>");
//     }
// }).addTo(map);
// });
 
// https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/