var map;
var infowindow;
var userMarker;
var closestStation;
var userPos = {lat: -1, lng: -1};
var xhr = new XMLHttpRequest();
var trainStatusURL = "https://rocky-taiga-26352.herokuapp.com/redline.json";
var stations = {"Alewife":{coords:{lat:42.395428, lng:-71.142483}, connectedTo:["Davis"]},
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
			   };

function init() {
	map = new google.maps.Map(document.getElementById('map'), {
          	center: {lat: 42.360083, lng: -71.05888},
          	zoom: 13
        });

	infowindow = new google.maps.InfoWindow({
    		content: ""
  		});

	populateStations();
	getUserLocation();
	getTrainStatus();

	// Update every 30 seconds
	setInterval(function() {
  		getTrainStatus();
	}, 30000);

	map.addListener("click", function() {
		infowindow.close();
	})
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
	placeMarker(userPos, "Current Location", "http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
  	map.panTo(userPos);
}

function calculateClosestStation() {
	var shortestDistance = -1;

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

function getTrainStatus() {
	xhr.open("get", trainStatusURL, true);
	xhr.responseType = "json";
	xhr.onload = function() {
		if (xhr.status == 200) {
			parseTrainStatus(xhr.response);
		} else {
			console.warn("Unable to retrieve train status.");
		}
    };
    xhr.send();
}

function parseTrainStatus(TrainStatus) {
	if (xhr.readyState == 4 && xhr.status == 200) {
		for (var i = 0; i < TrainStatus.TripList.Trips.length; i++) {
			var trip = TrainStatus.TripList.Trips[i];

			for (var j = 0; j < trip.Predictions.length; j++) {
				var prediction = trip.Predictions[j];

				if (stations[prediction.Stop]["LastUpdated"] == undefined || 
					stations[prediction.Stop]["LastUpdated"] < TrainStatus.TripList.CurrentTime) {

					stations[prediction.Stop]["LastUpdated"] = TrainStatus.TripList.CurrentTime;
					stations[prediction.Stop]["UpcomingTrains"] = [];
				}

				stations[prediction.Stop]["UpcomingTrains"].push({destination:trip.Destination,
																  secondsAway:prediction.Seconds})
			}
		}
	}
}

function markerClicked(marker) {
	var station;
	var iwContent = document.createElement("div");
	var iwStationName = document.createElement("h1");
	var iwStationDist = document.createElement("h2");
	var iwLastUpdated = document.createElement("h2");

	iwContent.className = "iwContent";
	iwStationName.className = "iwStationName";
	iwStationDist.className = "iwData";
	iwLastUpdated.className = "iwData";

	iwContent.appendChild(iwStationName);
	iwContent.appendChild(iwStationDist);
	iwContent.appendChild(iwLastUpdated);

	if (marker.title != "Current Location"){
		station = stations[marker.title];

		iwStationName.innerHTML = marker.title;

		if (station.UpcomingTrains != undefined) {
			station.UpcomingTrains.sort(function(a, b) {
				return a.secondsAway - b.secondsAway;
			});

			for (var i = 0; i < station.UpcomingTrains.length; i++) {
				var upcomingTrain = station.UpcomingTrains[i];

				if (upcomingTrain.secondsAway > 0) {
					var upcomingTrainItem = document.createElement("div");
					var upcomingTrainDestination = document.createElement("span");
					var upcomingTrainTime = document.createElement("span");

					upcomingTrainItem.className = "upcomingTrainItem";
					upcomingTrainDestination.className = "upcomingTrainDestination";
					upcomingTrainTime.className = "upcomingTrainTime";

					upcomingTrainDestination.innerHTML = upcomingTrain.destination;
					upcomingTrainTime.innerHTML = toTimeString(upcomingTrain.secondsAway);

					upcomingTrainItem.appendChild(upcomingTrainDestination);
					upcomingTrainItem.appendChild(upcomingTrainTime);
					iwContent.appendChild(upcomingTrainItem);
				}
			}
			var date = new Date();
			var diffSeconds = Math.floor(date.getTime() / 1000) - station.LastUpdated;
			if (diffSeconds < 1) {
				diffSeconds = 1;
			}
			iwLastUpdated.innerHTML = "Last Updated: " + toTimeString(diffSeconds);
		} else {
			iwLastUpdated.innerHTML = "No Station Info Available";
		}
	} else {
		station = stations[closestStation];
		iwStationName.innerHTML = marker.title;
		iwLastUpdated.innerHTML = "Closest Station: " + closestStation
	}

	if (station.distance == undefined) {
		iwStationDist.innerHTML = "Distance: unknown";
	} else {
		iwStationDist.innerHTML = "Distance: " + station.distance + "km";
	}

	infowindow.setContent(iwContent);
	infowindow.open(map, marker);
}

/* helper function, formats time in seconds since epoch to XXm YYs from now*/
function toTimeString(seconds) {
	var minute = Math.floor(seconds / 60);
	var second = seconds % 60;
	var string = "";
	if (minute > 0) {
		string = minute + "m";
	}
	if (second > 0) {
		string = string + " " + second + "s";
	}
	return string;
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

	return Math.round(d * Math.pow(10,2)) / Math.pow(10,2);
}