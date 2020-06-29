//
// Minimap
//

function mminitialize() {

  var guessMarker;

  // Mini map setup
  var mapOptions = {
    center: new google.maps.LatLng(0, 0, true),
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var mMap = new google.maps.Map(document.getElementById('miniMap'), mapOptions);

  // Marker selection setup
  if (lang == "fr") {
    var guessMarkerOptions = new google.maps.Marker({
      map: mMap,
      visible: true,
      title: 'Ton estimation',
      draggable: false
    });
  } else if (lang == "en") {
    var guessMarkerOptions = new google.maps.Marker({
      map: mMap,
      visible: true,
      title: 'Your guess',
      draggable: false
    });
  }
  // Mini map marker setup
  function setGuessMarker(guess) {
    if (guessMarker) {
      guessMarker.setPosition(guess);
    } else {
      guessMarker = new google.maps.Marker(guessMarkerOptions);
      guessMarker.setPosition(guess);
    };
  };

  // Mini map click
  google.maps.event.addListener(mMap, 'click', function(event) {
    document.getElementById('guessButton').disabled = false;
    if (lang == "fr") {
      document.getElementById('guessButton').innerHTML = "<i class='fas fa-map-marker-alt'></i>&nbsp;Où est cet endroit ?";
    } else if (lang == "en") {
      document.getElementById('guessButton').innerHTML = "<i class='fas fa-map-marker-alt'></i>&nbsp;Make a guess";
    }
    window.guessLatLng = event.latLng;
    setGuessMarker(window.guessLatLng);
  });

};
