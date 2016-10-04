var map;
var userMarker;
var userPos = {lat: -1, lng: -1};
var markerList = [];
var stations = {
				   "Alewife":{coords:{lat:42.395428, lng:-71.142483}, connectedTo:["Davis"]},
				   "Davis":{coords:{lat:42.39674, lng:-71.121815}, connectedTo:["Porter Square"]},
				   "Porter Square":{coords:{lat:42.3884, lng:-71.11914899999999}, connectedTo:["Harvard Square"]},
				   "Harvard Square":{coords:{lat:42.373362, lng:-71.118956}, connectedTo:["Central Square"]},
				   "Central Square":{coords:{lat:42.365486, lng:-71.103802}, connectedTo:["Kendall/MIT"]},
				   "Kendall/MIT":{coords:{lat:42.36249079, lng:-71.08617653}, connectedTo:["Charles/MGH"]},
				   "Charles/MGH":{coords:{lat:42.361166, lng:-71.070628}, connectedTo:["Park Street"]},
				   "Park Street":{coords:{lat:42.35639457, lng:-71.0624242}, connectedTo:["Downtown Crossing"]},
				   "Downtown Crossing":{coords:{lat:42.355518, lng:-71.060225}, connectedTo:["South Station"]},
				   "South Station":{coords:{lat:42.352271, lng:-71.05524200000001}, connectedTo:["Broadway"]},
				   "Broadway":{coords:{lat:42.342622, lng:-71.056967}, connectedTo:["Andrew"]},
				   "Andrew":{coords:{lat:42.330154, lng:-71.057655}, connectedTo:["JFK/UMass"]},
				   "JFK/UMass":{coords:{lat:42.320685, lng:-71.052391}, connectedTo:["Savin Hill", "North Quincy"]},
				   "Savin Hill":{coords:{lat:42.31129, lng:-71.053331}, connectedTo:["Fields Corner"]},
				   "Fields Corner":{coords:{lat:42.300093, lng:-71.061667}, connectedTo:["Shawmut"]},
				   "Shawmut":{coords:{lat:42.29312583, lng:-71.06573796000001}, connectedTo:["Ashmont"]},
				   "Ashmont":{coords:{lat:42.284652, lng:-71.06448899999999}, connectedTo:[]},
				   "North Quincy":{coords:{lat:42.275275, lng:-71.029583}, connectedTo:["Wollaston"]},
				   "Wollaston":{coords:{lat:42.2665139, lng:-71.0203369}, connectedTo:["Quincy Center"]},
				   "Quincy Center":{coords:{lat:42.251809, lng:-71.005409}, connectedTo:["Quincy Adams"]},
				   "Quincy Adams":{coords:{lat:42.233391, lng:-71.007153}, connectedTo:["Braintree"]},
				   "Braintree":{coords:{lat:42.2078543, lng:-71.0011385}, connectedTo:[]}
				}

function init() {
	map = new google.maps.Map(document.getElementById('map'), {
          	center: {lat: 42.360083, lng: -71.05888},
          	zoom: 13
        });

	populateStations();
	getUserLocation();
}

function getUserLocation() {
	if ("geolocation" in navigator) {/* geolocation is available */
  		navigator.geolocation.getCurrentPosition(function(position) {
  			userPos.lat = position.coords.latitude;
  			userPos.lng = position.coords.longitude;
  			handleUserLocation()
  		}, function (err) {
  			console.warn('ERROR(' + err.code + '): ' + err.message);
  			alert("Unable to get current location");
  		})
	} else {
		alert("Geolocation is not supported by your web browser.");
	}
}

function handleUserLocation() {
	populateUserMarker();
	calculateClosestStation();
}

function populateUserMarker() {
	placeMarker(userPos, "You are here", "http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
  	map.panTo(userPos);
}

function calculateClosestStation() {
	var shortestDistance = -1;
	var closestStation;

	for (var stationName in stations) {
		var distance = haversine_distance(userPos, stations[stationName].coords)
		stations[stationName]["distance"] = distance;
		if (shortestDistance == -1 || distance < shortestDistance) {
			shortestDistance = distance;
			closestStation = stationName;
		}
	}
	var polylineCoords = [stations[closestStation].coords, userPos];
	drawPath('#0000FF', polylineCoords);
}

function populateStationMarkers() {
	for (var i = 0; i < stationList.length; i++) {
		station = stationList[i];
		
	}
}

function populateStations() {
	var polylineCoords = [];
	var station;
	for (var stationName in stations) {
		station = stations[stationName];
		placeMarker(station.coords, stationName, "mbta.png");

		polylineCoords[0] = station.coords;
		for (var i = 0; i < station.connectedTo.length; i++) {
			polylineCoords[1] = stations[station.connectedTo[i]].coords;
			drawPath('#FF0000', polylineCoords);
		}
	}
}

function connectStationMarkers() {
	
	var path;
	var connectedIndicies;

	for (var i = 0; i < connectedStations.length; i++) {
		connectedIndicies = connectedStations[i];
		
	}
}

/* helper function, draws path of specified color between polylineCoords */
function drawPath(color, polylineCoords) {
	var path = new google.maps.Polyline({
	    path: polylineCoords,
	    geodesic: true,
	    strokeColor: color,
	    strokeOpacity: 1.0,
	    strokeWeight: 2,
	    map: map
  	});
}

/* helper function, places marker at coords */
function placeMarker(coords, title, icon) {
	var marker = new google.maps.Marker({
    	position: coords,
    	map: map,
    	title: title,
    	icon: icon
  	});
  	google.maps.event.addListener(marker, 'click', function() { 
   		 markerClicked(marker);
	});
}

function markerClicked(marker) {
	alert(marker.title);
}

/* modified from http://stackoverflow.com/a/14561433 */
Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

function haversine_distance(coords1, coords2) {
	var R = 6371; // km 
	var dLat = (coords2.lat - coords1.lat).toRad();
	var dLon = (coords2.lng - coords1.lng).toRad();
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
            Math.cos(coords1.lat.toRad()) * Math.cos(coords2.lat.toRad()) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
	var d = R * c; 

	return d;
}