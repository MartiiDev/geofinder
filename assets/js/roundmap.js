//
// End of round map
//

function rminitialize() {
  // console.log('End of round called');
  var currentLLArr = locLatLongs.replace(/[\])}[{(]/g, '').split(',');
  var actualLtLng = new google.maps.LatLng(currentLLArr[0], currentLLArr[1]);
  if (typeof guessLatLongs !== 'undefined') {
    var GuessLLArr = guessLatLongs.replace(/[\])}[{(]/g, '').replace(/\s/g, '').split(',');
    var guessLtLng = new google.maps.LatLng(GuessLLArr[0], GuessLLArr[1]);
  }

  var mapOptions = {
    zoom: 2,
    center: actualLtLng,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var map = new google.maps.Map($('#roundMap')[0], mapOptions);

  if (lang == "fr") {
    var actualMarker = new google.maps.Marker({
      position: actualLtLng,
      title: "Position réelle",
      icon: 'assets/img/actual.png'
    });
  } else if (lang == "en") {
    var actualMarker = new google.maps.Marker({
      position: actualLtLng,
      title: "Actual location",
      icon: 'assets/img/actual.png'
    });
  }

  if (lang == "fr") {
    var guessMarker = new google.maps.Marker({
      position: guessLtLng,
      title: "Ton estimation",
      icon: 'assets/img/guess.png'
    });
  } else if (lang == "en") {
    var guessMarker = new google.maps.Marker({
      position: guessLtLng,
      title: "Your guess",
      icon: 'assets/img/guess.png'
    });
  }

  actualMarker.setMap(map);
  guessMarker.setMap(map);
};
