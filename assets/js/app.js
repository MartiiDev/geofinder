var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var getLang = urlParams.get('lang');
var lang;
if (!urlParams.has('lang')) {
  lang = "fr";
} else if (getLang == "en") {
  lang = "en";
  $('.guessButton').html("<i class='fas fa-globe-europe'></i>&nbsp;Chose a location");
  $('.round').html('<em>Round: </em>0/5<br>');
  $('.roundScore').html('<em>Last score: </em>0<br>');
  $('.totalScore').html('<em>Total score: </em>0<br>');
}

$(document).ready(function() {
  // Config
  var game = {
    round: {
      id: 1,
      score: {
        final: 0,
        rewarded: 0
      }
    },
    totalScore: 0,
    timedOut: false,
    distance: 0
  };

  var round = game.round.id;
  var points = game.round.score.rewarded;
  var roundScore = game.round.score.final;
  var totalScore = game.totalScore;
  var distance = game.distance;

  // Init maps
  svinitialize();
  mminitialize();

  // Scoreboard & Guess button event
  // Init Timer
  resetTimer();

  // Timer
  function timer() {
    count = count - 1;
    if (count <= 0) {
      game.timedOut = true;
      clearInterval(counter);
      if (round < 5) {
        endRound();
      } else if (round >= 5) {
        endRound();
      }
    }
    $("#timer").text(count);
  };

  // Guess Button
  $('#guessButton').click(function() {
    doGuess();
  });

  // End of round continue button click
  $('#roundEnd').on('click', '.closeBtn', function() {
    $('#roundEnd').modal('hide');
    if (round == 5) {
      endGame();

    } else {
      round++;
      if (lang == "fr") {
        $('.round').html('<em>Manche: </em>' + round + '/5<br>');
        $('.roundScore').html('<em>Dernier score: </em>' + roundScore + '<br>');
        $('.totalScore').html('<em>Score total: </em>' + totalScore + '<br>');
      } else if (lang == "en") {
        $('.round').html('<em>Round: </em>' + round + '/5<br>');
        $('.roundScore').html('<em>Last score: </em>' + roundScore + '<br>');
        $('.totalScore').html('<em>Total score: </em>' + totalScore + '<br>');
      }
      
      // Reload maps to refresh coords
      locLatLongs = window.locLL.toString();
      guessLatLongs = window.guessLatLng.toString();
      svinitialize();
      mminitialize();
      rminitialize();

      // Reset Timer
      resetTimer();
    }
  });

  // End of game 'play again' button click
  $('#endGame').on('click', '.playAgain', function() {
    window.location.reload();
  });

  // Functions
  // Reset Timer
  function resetTimer() {
    count = 10;
    counter = setInterval(timer, 1000);
  }

  // Calculate distance between points function
  function calcDistance(fromLat, fromLng, toLat, toLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
  }
  function doGuess() {
    if (window.guessLatLng) {
      if (lang == "fr") {
        document.getElementById('guessButton').innerHTML = "<i class='fas fa-globe-europe'></i>&nbsp;Choisis un emplacement";
      } else if (lang == "en") {
        document.getElementById('guessButton').innerHTML = "<i class='fas fa-globe-europe'></i>&nbsp;Chose a location";
      }
      document.getElementById('guessButton').disabled = true;
      if (game.timedOut == false) {
        // Stop Counter
        clearInterval(counter);

        // Reset marker function
        function resetMarker() {
          //Reset marker
          if (guessMarker !== null) {
            guessMarker.setMap(null);
          }
        }

        // Explode latLng variables into separate variables for calcDistance function
        locLatLongs = window.locLL.toString();
        guessLatLongs = window.guessLatLng.toString();

        // Make arrays and clean from (){} characters
        window.locArray = locLatLongs.replace(/[\])}[{(]/g, '').split(',');
        window.guessArray = guessLatLongs.replace(/[\])}[{(]/g, '').split(',');

        // Calculate distance between points, and convert to kilometers
        distance = Math.ceil(calcDistance(window.locArray[0], window.locArray[1], window.guessArray[0], window.guessArray[1]) / 1000);

        // Calculate points awarded via guess proximity
        function inRange(x, min, max) {
          return (min <= x && x <= max);
        }

        // Real basic point thresholds depending on kilometer distances
        if (inRange(distance, 1, 2)) {
          points = 10000;
        } else if (inRange(distance, 3, 10)) {
          points = 7000;
        } else if (inRange(distance, 11, 50)) {
          points = 4000;
        } else if (inRange(distance, 51, 200)) {
          points = 3000;
        } else if (inRange(distance, 201, 500)) {
          points = 2000;
        } else if (inRange(distance, 501, 800)) {
          points = 1000;
        } else if (inRange(distance, 801, 1300)) {
          points = 500;
        } else if (inRange(distance, 1301, 1600)) {
          points = 400;
        } else if (inRange(distance, 1601, 2300)) {
          points = 300;
        } else if (inRange(distance, 2301, 2800)) {
          points = 200;
        } else if (inRange(distance, 2801, 3200)) {
          points = 100;
        } else if (inRange(distance, 3200, 4500)) {
          points = 50;
        } else if (inRange(distance, 4501, 6000)) {
          points = 25;
        } else {
          points = 0;
        }

        if (round < 5) {
          endRound();
        } else if (round >= 5) {
          endRound();
        }

      }
      
      timer();
      window.guessLatLng = '';
      rminitialize();
    }
  }

  function endRound() {
    if (game.timedOut == true) {
      roundScore = 0;
    } else {
      roundScore = points;
      totalScore = totalScore + points;
    }

    // If distance is undefined, that means they ran out of time and didn't click the guess button
    if (typeof distance === 'undefined' || game.timedOut == true) {
      if (lang == "fr") {
        $('#roundEnd').html('<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-body"><h3 class="text-center"><i class="fas fa-stopwatch"></i> Trop tard...</h3><div id="roundMap"></div><br><p class="text-center">Tu n\'as pas répondu à temps.<br>Tu n\'as gagné aucun point pendant cette manche.</p></div><div class="modal-footer"><button class="btn btn-primary closeBtn" type="button" style="background-color: rgb(0,178,255);"><i class="far fa-hand-point-right" style="padding-top: 4px;"></i>&nbsp;Continuer</button></div></div></div>');
      } else if (lang == "en") {
        $('#roundEnd').html('<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-body"><h3 class="text-center"><i class="fas fa-stopwatch"></i> Too late...</h3><div id="roundMap"></div><br><p class="text-center">You have not answered in time.<br>You haven\'t scored any points this round.</p></div><div class="modal-footer"><button class="btn btn-primary closeBtn" type="button" style="background-color: rgb(0,178,255);"><i class="far fa-hand-point-right" style="padding-top: 4px;"></i>&nbsp;Continue</button></div></div></div>');
      }
      $('#roundEnd').modal({
          backdrop: 'static',
          keyboard: false
      })
      $('#roundEnd').modal('show');

      locLatLongs = window.locLL.toString();
      window.guessLatLng = '';
      rminitialize();
      // Stop Counter
      clearInterval(counter);

      // Reset marker function
      function resetMarker() {
        //Reset marker
        if (guessMarker !== null) {
          guessMarker.setMap(null);
        }
      }

      window.guessLatLng = '';
      ranOut = false;
      points = 0;

    } else {
      if (lang == "fr") {
        $('#roundEnd').html('<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-body"><h3 class="text-center"><i class="fas fa-map-marker-alt"></i>&nbsp;' + distance + 'km</h3><div id="roundMap"></div><br><p class="text-center">Ton point était à <strong>' + distance + 'km</strong> de l\'endroit réel.<br>Tu as gagné <strong>' + roundScore + ' points </strong>pendant cette manche.</p></div><div class="modal-footer"><button class="btn btn-primary closeBtn" type="button" style="background-color: rgb(0,178,255);"><i class="far fa-hand-point-right" style="padding-top: 4px;"></i>&nbsp;Continuer</button></div></div></div>');
      } else if (lang == "en") {
        $('#roundEnd').html('<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-body"><h3 class="text-center"><i class="fas fa-map-marker-alt"></i>&nbsp;' + distance + 'km</h3><div id="roundMap"></div><br><p class="text-center">Your guess was <strong>' + distance + 'km</strong> away from the actual location.<br>You have scored <strong>' + roundScore + ' points </strong>this round.</p></div><div class="modal-footer"><button class="btn btn-primary closeBtn" type="button" style="background-color: rgb(0,178,255);"><i class="far fa-hand-point-right" style="padding-top: 4px;"></i>&nbsp;Continue</button></div></div></div>');
      }
      $('#roundEnd').modal({
          backdrop: 'static',
          keyboard: false
      })
      $('#roundEnd').modal('show');
    }

    // Reset Params
    window.guessLatLng = '';
    game.timedOut = false;
  }

  function endGame() {

    roundScore = points;
    totalScore = totalScore + points;

    if (lang == "fr") {
      $('.roundScore').html('<em>Dernier score: </em>' + roundScore + '<br>');
      $('.totalScore').html('<em>Score total: </em>' + totalScore + '<br>');
    } else if (lang == "en") {
      $('.roundScore').html('<em>Last score: </em>' + roundScore + '<br>');
      $('.totalScore').html('<em>Total score: </em>' + totalScore + '<br>');
    }

    if (lang == "fr") {
      $('#endGame').html('<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-body"><h3 class="text-center"><i class="fas fa-trophy"></i>&nbsp;' + totalScore + ' points</h3><br><p class="text-center">Ton score total est <strong>' + totalScore + ' points</strong>.<br>Feras-tu mieux la prochaine fois?</p></div><div class="modal-footer"><a class="btn btn-danger d-lg-flex mr-auto" href="/">Quitter</a><a class="btn btn-primary d-lg-flex playAgain" href="" style="background-color: rgb(0,178,255);"><i class="fas fa-redo" style="padding-top: 4px;"></i>&nbsp;Rejouer</a></div></div></div>');
    } else if (lang == "en") {
      $('#endGame').html('<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-body"><h3 class="text-center"><i class="fas fa-trophy"></i>&nbsp;' + totalScore + ' points</h3><br><p class="text-center">Your final score is <strong>' + totalScore + ' points</strong>.<br>Can you do better next time?</p></div><div class="modal-footer"><a class="btn btn-danger d-lg-flex mr-auto" href="/">Quit</a><a class="btn btn-primary d-lg-flex playAgain" href="" style="background-color: rgb(0,178,255);"><i class="fas fa-redo" style="padding-top: 4px;"></i>&nbsp;Play again</a></div></div></div>');
    }
    $('#endGame').modal({
        backdrop: 'static',
        keyboard: false
    })
    $('#endGame').modal('show');

    rminitialize();

    // We're done with the game
    window.finished = true;
  }
});