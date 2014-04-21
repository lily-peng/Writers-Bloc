Template.joinGame.showJoinGame = function() {
  return Session.get("gameState") == SHOW_JOIN_GAME;
}

Template.joinGame.helpers({
  availableGames: function() {
    var games = Games.find({});
    if (games)
      return games;
    return "";
  }
});

Template.joinGame.events({
  'click #join': function(event) {
    var clicked = event.target;
    var gameID = clicked.name;
    var playerID = Session.get("playerID");
	  Meteor.call("incrementNumberPlayers", gameID);
    Meteor.call("setGameID", playerID, gameID);
    Session.set("gameID", gameID);
    Meteor.call("setPlayerGameState", playerID, SHOW_WAIT_FOR_GAME);
  },

  'click #cancelJoinGame': function(event) {
    var playerID = Session.get("playerID");
    Meteor.call("setPlayerGameState", playerID, SHOW_LOBBY);
  }
});
