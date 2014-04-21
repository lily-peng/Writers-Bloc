Template.lobby.showLobby = function() {
  return Session.get("gameState") == SHOW_LOBBY;
}

Template.lobby.events({
  'click #creategame': function (event) {
    var playerID = Session.get("playerID");
    Meteor.call("setPlayerGameState", playerID, SHOW_CREATE_GAME);
  },

  'click #joingame': function (event) {
    var playerID = Session.get("playerID");
    Meteor.call("setPlayerGameState", playerID, SHOW_JOIN_GAME);
  },

  'click #settings': function (event) {
    var playerID = Session.get("playerID");
    Meteor.call("setPlayerGameState", playerID, SHOW_SETTINGS);
  }
});

