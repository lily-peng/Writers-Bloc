Template.waitForGame.showWaitForGame = function() {
  return Session.get("gameState") == SHOW_WAIT_FOR_GAME;
}

Template.waitForGame.helpers({    
  game: function() {
    var game = Games.findOne({});
    if (game)
      return game;
    return "";
  },

  players: function() {
    var players = Players.find({});
    if (players)
      return players;
    return "";
  },

  isHost: function() {
    var playerID = Session.get("playerID");
    var player = Players.findOne(playerID, {fields: {Host: 1}});
    var isHost = player.Host;
    return isHost;
  }
});

Template.waitForGame.events({
  'click #start': function(event) {
    var gameID = Session.get("gameID");
    Meteor.call("fillGame", gameID);
    Meteor.call("incrementRound", gameID);
    Meteor.call("setGroupGameState", gameID, SHOW_STAGE_ONE);
  }
});
