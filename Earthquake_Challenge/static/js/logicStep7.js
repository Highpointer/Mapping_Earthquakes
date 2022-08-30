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

// The third tile layer option as  background of our map. This is worth 5 points.
let outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Adding the "dark" since "outdoors" does not provide good contrast when zoomed out
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
// Create a base layer that holds both maps. Adding additional map overlay options is worth 5 points.
let baseMaps = {
    "Streets": streets,
    "Satellite": satelliteStreets,
    "Outdoors": outdoors,
    "Dark": dark
};

// Create the earthquake layer for our map.
// 1. Add a 3rd layer group for the major earthquake data
// The major earthquake data is added as a third layer group (10 pt)
let tectonicPlates = new L.layerGroup();
let allEarthquakes = new L.layerGroup();
let majorEarthquakes = new L.layerGroup();

// We define an object that contains the overlays. This overlay will be visible all the time.
// 2. Add a reference to the major earthquake group to the overlays object
// The major earthquake data is added to the overlay object (10 pt)
let overlays = {
    "Tectonic Plates": tectonicPlates,
    "Earthquakes": allEarthquakes,
    "Major Earthquakes<br>(Mag. 4.5 or greater)": majorEarthquakes
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
        if (magnitude >= 6) {
            return "red";
        }
        if (magnitude >= 5) {
            return "#ea2c2c";
        }
        if (magnitude >= 4) {
            return "#ea822c";
        }
        if (magnitude >= 3) {
            return "#ee9c00";
        }
        if (magnitude >= 2) {
            return "#eecc00";
        }
        if (magnitude >= 1) {
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

// THIS IS THE CODE TO ADD MAJOR EARTHQUAKES

// 3. Retrieve the major earthquake GeoJSON data >4.5 mag for the week.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(majorData) {

    // 4. Use the same style as the earthquake data.

    style: styleInfo,
    
    // 5. Change the color function to use three colors for the major earthquakes based on the magnitude of the earthquake.
    
    // See getColor function above. If mag >= 6.0, then color is deep red. if mag < 6.0 and mag >=5.0,
    // color is "#ea2c2c". If mag < 5.0 and mag >= 4.5, then color is "#ea822c".
    // 6. Use the function that determines the radius of the earthquake marker based on its magnitude.
    // Uses same function as for all earthquakes.
    
    // 7. Creating a GeoJSON layer with the retrieved data that adds a circle to the map sets the style of the circle,
    // and displays the magnitude and location of the earthquake after the marker has been created and styled.

    L.geoJSON(majorData, {
        // We turn each feature into a circleMarker on the map.
        
        pointToLayer: function(feature, latlng) {
                console.log("Data", majorData);
                return L.circleMarker(latlng);
            },
          // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each circleMarker to display the magnitude and
        // location of the earthquake after the marker has been created and styled.
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
          } 
        }).addTo(majorEarthquakes);
    
    // 8. Add the major earthquakes layer to the map.        allEarthquakes.addTo(map);
    majorEarthquakes.addTo(map);

    // 9. Close the braces and parentheses for the major earthquake data.
    });

// END OF CODE TO ADD MAJOR EARTHQUAKES

    // Custom Legend Control: https://leafletjs.com/examples/choropleth/
    let legend = L.control({position: 'bottomright'});

// Add the legend information to lower right, with six categories
legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend');
        const magnitudes = [0, 1, 2, 3, 4, 5, 6];
        const colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c",
            "red"
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