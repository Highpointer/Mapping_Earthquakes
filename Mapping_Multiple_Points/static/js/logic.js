// Add console.log to check to see if our code is working.
console.log("working");
// Create the map object with a center and zoom level. 13.2.4 Create a Simple Map
//let map = L.map('mapid').setView([33.4254, -111.9403], 14);
let map = L.map('mapid').setView([39.83, -98.58], 5);
//  Add a marker to the map for Tempe, Arizona.
// L.circle([33.4254, -111.9403], {radius: 100}).addTo(map);
// L.circleMarker([33.4254, -111.9403], {
//     radius: 300,
//     color: "black",
//     fillColor: '#ffffa1'
// }).addTo(map);
// An array containing each city's location, state, and population.
// Get data from cities.js
let cityData = cities;
// Loop through the cities array and create one marker for each city.
cityData.forEach(function(city) {
    console.log(city)
    L.circleMarker(city.location, {radius: city.population/100000})
    .bindPopup("<h2>" + city.city + ", " + city.state + "</h2> <hr> <h3>Population " + city.population.toLocaleString() + "</h3>").addTo(map);
});
// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
// https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/
// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);