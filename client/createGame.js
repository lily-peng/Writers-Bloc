Template.createGame.showCreateGame = function() {
  return Session.get("gameState") == SHOW_CREATE_GAME;
}

Template.createGame.events({
  'click #creategamenow': function(event) {
    var numberPlayers = document.getElementById("numberPlayers").value;
    var storyName = document.getElementById("storyName").value;
    var numberRounds = document.getElementById("numberRounds").value;
    var playerID = Session.get("playerID");      

    var firstSentence = document.getElementById("firstSentence").value;
    if (firstSentence == "") {
      firstSentence = firsts[Math.floor((Math.random()*firsts.length)+1)];
    }

    var lastSentence = document.getElementById("lastSentence").value;       
    if (lastSentence == "") {
      lastSentence = lasts[Math.floor((Math.random()*lasts.length)+1)];
    } 

    Meteor.call("createGame", storyName, numberPlayers, numberRounds, firstSentence, lastSentence, function(error, result) {
      Session.set("gameID", result);
    });    
  },

  'click #cancelCreateGame': function(event) {
    var playerID = Session.get("playerID");
    Meteor.call("setPlayerGameState", playerID, SHOW_LOBBY);
  }
});
