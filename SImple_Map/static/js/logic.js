// Add console.log to check to see if our code is working.
console.log("working");
// Create the map object with a center and zoom level. 13.2.4 Create a Simple Map
let map = L.map('mapid').setView([39.83, -98.58], 4);
// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
// https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/
// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);