stageTwoSubmit = function() {
  Meteor.clearTimeout(Session.get("timerID"));
  var gameID = Session.get("gameID");
  var playerID = Session.get("playerID");
  var currentRound = Session.get("currentRound");
	var sentenceID = null;
  var radioButtons = document.getElementsByName('sentenceRadio');
  for (var i=0; i<radioButtons.length; i++) {
    var currentRadio = radioButtons[i];
    if (currentRadio.checked) {
      sentenceID = currentRadio.value;
    }
  }
  var numPlayers = Session.get("numberOfPlayers"); 
  var readyPlayers = Session.get("numberOfReadyPlayers");
  Meteor.call("stageTwoSubmit", gameID, playerID, sentenceID, currentRound, numPlayers, readyPlayers); 
}

Template.stageTwo.showStageTwo = function() {
  var show = Session.get("gameState") == SHOW_STAGE_TWO;
  if (show) {
    Session.set("time", 60);
    Session.set("timerID", Meteor.setTimeout(stageTwoSubmit, 60000));
  }
  return show;
}

Template.stageTwo.helpers({
  game: function() {
    var game = Games.findOne({});
    if (game)
      return game;
    return "";
  }
});
