var map;
var userMarker;
var userPos = {lat: -1, lng: -1};

function init() {
	map = new google.maps.Map(document.getElementById('map'), {
          	center: {lat: 42.360083, lng: -71.05888},
          	zoom: 13
        });

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