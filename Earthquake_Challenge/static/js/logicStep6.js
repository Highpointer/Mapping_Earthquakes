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
    "Satellite": satelliteStreets
};

// Create the earthquake layer for our map.
// The tectonic plate data is added as a second layer group (10 pt)
let tectonicPlates = new L.layerGroup();
let allEarthquakes = new L.layerGroup();

// We define an object that contains the overlays. This overlay will be visible all the time.
// The tectonic plate data is added to the overlay object (10 pt)
let overlays = {
    "Tectonic Plates": tectonicPlates,
    "Earthquakes": allEarthquakes
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
    center: [39.83, -98.58],
    zoom: 3,
    layers: [streets]
});

// Then we add a control to the map that will allow the user to change which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Create a style for the lines.
let myStyle = {
    color: "#ffffa1",
    weight: 2
}

// Retrieve the earthquake GeoJSON data
// This function returns the style data for each of the earthquakes we plot on the map. 
// We pass the magnitude of the earthquake into a function to calculate the radius.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    // This function determines the radius of the earthquake marker based on its magnitude.
    // Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
            return magnitude * 4;
        }
    // This function determines the colour of the circle based on the magnitude of the earthquake.
    function getColor(magnitude) {
        if (magnitude > 5) {
            return "#ea2c2c";
        }
        if (magnitude > 4) {
            return "#ea822c";
        }
        if (magnitude > 3) {
            return "#ee9c00";
        }
        if (magnitude > 2) {
            return "#eecc00";
        }
        if (magnitude > 1) {
            return "#d4ee00";
        }
            return "#98ee00";
        }
      }
// Creating a GeoJSON layer with the retrieved data.
L.geoJSON(data, {
    // We turn each feature into a circleMarker on the map.
    
    pointToLayer: function(feature, latlng) {
            console.log("Data", data);
            return L.circleMarker(latlng);
        },
      // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each circleMarker to display the magnitude and
    // location of the earthquake after the marker has been created and styled.
    onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      } 
    }).addTo(allEarthquakes);

    // Then we add the earthquake layer to our map
    allEarthquakes.addTo(map);

    // Custom Legend Control: https://leafletjs.com/examples/choropleth/
    let legend = L.control({position: 'bottomright'});

// Add the legend information to lower right, with six categories
legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend');
        const magnitudes = [0, 1, 2, 3, 4, 5];
        const colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

    // Looping through our intervals to generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }

    return div;
    };

    legend.addTo(map);

//  3. Use d3.json to make a call to get our Tectonic Plate geoJSON data.

// The d3.json() callback is working and does the following: (10 pt)
// The tectonic plate data is passed to the geoJSON() layer
// The geoJSON() layer adds color (red) and width (3) to the tectonic plate lines
// The tectonic layer group variable is added to the map
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(plateData) {
        L.geoJson(plateData, {
            color: "red",
            weight: 3
    }).addTo(tectonicPlates);

    // The earthquake data and tectonic plate data displayed on the map when the page loads  (5 pt)
    tectonicPlates.addTo(map);
    console.log("Tectonic data added");
    });
});

// Accessing the airport GeoJSON URL
// let airportData = "https://raw.githubusercontent.com/Highpointer/Mapping_Earthquakes/main/majorAirports.json";
// Accessing the Toronto airline routes GeoJSON URL.
// let torontoData = "https://raw.githubusercontent.com/Highpointer/Mapping_Earthquakes/main/torontoRoutes.json";