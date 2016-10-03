var map;
var userMarker;
var stationMarkers = [];
var userPos = {lat: -1, lng: -1};
var stationMarkers = {};
var stationList = [{name:"South Station", coords:{lat:42.352271, lng:-71.05524200000001}},
				   {name:"Andrew", coords:{lat:42.330154, lng:-71.057655}},
				   {name:"Porter Square", coords:{lat:42.3884, lng:-71.11914899999999}},
				   {name:"Harvard Square", coords:{lat:42.373362, lng:-71.118956}},
				   {name:"JFK/UMass", coords:{lat:42.320685, lng:-71.052391}},
				   {name:"Savin Hill", coords:{lat:42.31129, lng:-71.053331}},
				   {name:"Park Street", coords:{lat:42.35639457, lng:-71.0624242}},
				   {name:"Broadway", coords:{lat:42.342622, lng:-71.056967}},
				   {name:"North Quincy", coords:{lat:42.275275, lng:-71.029583}},
				   {name:"Shawmut", coords:{lat:42.29312583, lng:-71.06573796000001}},
				   {name:"Davis", coords:{lat:42.39674, lng:-71.121815}},
				   {name:"Alewife", coords:{lat:42.395428, lng:-71.142483}},
				   {name:"Kendall/MIT", coords:{lat:42.36249079, lng:-71.08617653}},
				   {name:"Charles/MGH", coords:{lat:42.361166, lng:-71.070628}},
				   {name:"Downtown Crossing", coords:{lat:42.355518, lng:-71.060225}},
				   {name:"Quincy Center", coords:{lat:42.251809, lng:-71.005409}},
				   {name:"Quincy Adams", coords:{lat:42.233391, lng:-71.007153}},
				   {name:"Ashmont", coords:{lat:42.284652, lng:-71.06448899999999}},
				   {name:"Wollaston", coords:{lat:42.2665139, lng:-71.0203369}},
				   {name:"Fields Corner", coords:{lat:42.300093, lng:-71.061667}},
				   {name:"Central Square", coords:{lat:42.365486, lng:-71.103802}},
				   {name:"Braintree", coords:{lat:42.2078543, lng:-71.0011385}}]

function init() {
	map = new google.maps.Map(document.getElementById('map'), {
          	center: {lat: 42.360083, lng: -71.05888},
          	zoom: 13
        });

	populateStationMarkers();
	getUserLocation();
}

function getUserLocation() {
	if ("geolocation" in navigator) {/* geolocation is available */
  		navigator.geolocation.getCurrentPosition(function(position) {
  			userPos.lat = position.coords.latitude;
  			userPos.lng = position.coords.longitude;
  			populateUserMarker()
  		}, function (err) {
  			console.warn('ERROR(' + err.code + '): ' + err.message);
  			alert("Unable to get current location");
  		})
	} else {
		alert("Geolocation is not supported by your web browser.");
	}
}

function populateUserMarker() {
	userMarker = new google.maps.Marker({
    	position: userPos,
    	map: map
  	});

  	map.panTo(userPos);
}

function populateStationMarkers() {
	var marker;
	for (var i = 0; i < stationList.length; i++) {
		station = stationList[i]
		marker = new google.maps.Marker({
	    	position: station.coords,
	    	map: map,
	    	title: station.name
	  	});
	  	stationMarkers[station.name] = marker;
	}
}