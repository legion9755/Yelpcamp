// const campground = require("../../models/campground");

mapboxgl.accessToken = 'pk.eyJ1IjoidmJ2ayIsImEiOiJjbHlvbWNyNm0wM2duMmpzZ2RsZ3F6MWo5In0.tYSNX1uFR2R0g0_vV6c12w';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 14, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
const marker1 = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map);

