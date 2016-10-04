var map;
var userMarker;
var userPos = {lat: -1, lng: -1};
var stationList = [{name:"Alewife", coords:{lat:42.395428, lng:-71.142483}},
				   {name:"Davis", coords:{lat:42.39674, lng:-71.121815}},
				   {name:"Porter Square", coords:{lat:42.3884, lng:-71.11914899999999}},
				   {name:"Harvard Square", coords:{lat:42.373362, lng:-71.118956}},
				   {name:"Central Square", coords:{lat:42.365486, lng:-71.103802}},
				   {name:"Kendall/MIT", coords:{lat:42.36249079, lng:-71.08617653}},
				   {name:"Charles/MGH", coords:{lat:42.361166, lng:-71.070628}},
				   {name:"Park Street", coords:{lat:42.35639457, lng:-71.0624242}},
				   {name:"Downtown Crossing", coords:{lat:42.355518, lng:-71.060225}},
				   {name:"South Station", coords:{lat:42.352271, lng:-71.05524200000001}},
				   {name:"Broadway", coords:{lat:42.342622, lng:-71.056967}},
				   {name:"Andrew", coords:{lat:42.330154, lng:-71.057655}},
				   {name:"JFK/UMass", coords:{lat:42.320685, lng:-71.052391}},
				   {name:"Savin Hill", coords:{lat:42.31129, lng:-71.053331}},
				   {name:"Fields Corner", coords:{lat:42.300093, lng:-71.061667}},
				   {name:"Shawmut", coords:{lat:42.29312583, lng:-71.06573796000001}},
				   {name:"Ashmont", coords:{lat:42.284652, lng:-71.06448899999999}},
				   {name:"North Quincy", coords:{lat:42.275275, lng:-71.029583}},
				   {name:"Wollaston", coords:{lat:42.2665139, lng:-71.0203369}},
				   {name:"Quincy Center", coords:{lat:42.251809, lng:-71.005409}},
				   {name:"Quincy Adams", coords:{lat:42.233391, lng:-71.007153}},
				   {name:"Braintree", coords:{lat:42.2078543, lng:-71.0011385}}]
var connectedStations = [[0, 1],
						[1, 2],
						[2, 3],
						[3, 4],
						[4, 5],
						[5, 6],
						[6, 7],
						[7, 8],
						[8, 9],
						[9, 10],
						[10, 11],
						[11, 12],
						[12, 13],
						[13, 14],
						[14, 15],
						[15, 16],
						[17, 18],
						[18, 19],
						[19, 20],
						[20, 21],
						[12, 17]];

function init() {
	map = new google.maps.Map(document.getElementById('map'), {
          	center: {lat: 42.360083, lng: -71.05888},
          	zoom: 13
        });

	populateStationMarkers();
	connectStationMarkers();
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
	userMarker = new google.maps.Marker({
    	position: userPos,
    	map: map
  	});
  	map.panTo(userPos);
}

function calculateClosestStation() {

}

function populateStationMarkers() {
	var marker;
	for (var i = 0; i < stationList.length; i++) {
		station = stationList[i]
		marker = new google.maps.Marker({
	    	position: station.coords,
	    	map: map,
	    	title: station.name,
	    	icon: "mbta.png"
	  	});
	}
}

function connectStationMarkers() {
	/* Connects alewife to ashmont */
	var polylineCoords = [];
	var path;
	var connectedIndicies;

	for (var i = 0; i < connectedStations.length; i++) {
		connectedIndicies = connectedStations[i];
		polylineCoords[0] = stationList[connectedIndicies[0]].coords;
		polylineCoords[1] = stationList[connectedIndicies[1]].coords;

		path = new google.maps.Polyline({
		    path: polylineCoords,
		    geodesic: true,
		    strokeColor: '#FF0000',
		    strokeOpacity: 1.0,
		    strokeWeight: 2,
		    map: map
	  	});
	}
}
