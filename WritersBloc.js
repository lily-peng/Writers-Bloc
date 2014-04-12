//SHARED AREA-------------------------------------------------------------------------------------

Games = new Meteor.Collection("games");
Players = new Meteor.Collection("players");
Sentences = new Meteor.Collection("sentences");


//CLIENT------------------------------------------------------------------------------------------

if (Meteor.isClient) {

  //Show functions
  Meteor.subscribe("games");
  Meteor.subscribe("players");
  Meteor.subscribe("sentences");

  Session.set("showLobby", true);
  Session.set("showCreateGame", false);
  Session.set("showJoinGame", false);
  Session.set("showWaitForGame", false);
  Session.set("showSettings", false);
  Session.set("showStageOne", false);
  Session.set("showStageTwo", false);
  Session.set("showStageThree", false);

  Template.hello.greeting = function () {
    return "Welcome to Writers-Bloc";
  };

  Template.lobby.showLobby = function() {
    return Session.get("showLobby");
  }

  Template.createGame.showCreateGame = function() {
    return Session.get("showCreateGame");
  }

  Template.joinGame.showJoinGame = function() {
    return Session.get("showJoinGame");
  }

  //Template Functions

  //TRY TO GET THIS CODE TO DISPLAY GAMES THAT ARE ABLE TO JOIN
  Template.joinGame.availableGames = function() {
    var games = Games.find({});
    return games;
  }

  //Template Events
 
  //just a cancel button, throw away/modify later
  Template.hello.events({
    'click #return': function (event) {
      Session.set("showLobby", true);
      Session.set("showCreateGame", false);
      Session.set("showJoinGame", false);
      Session.set("showSettings", false);
      Session.set("showStageOne", false);
      Session.set("showStageTwo", false);
      Session.set("showStageThree", false);
    }
  });

  Template.lobby.events({
    'click #creategame': function (event) {
      Session.set("showLobby", false);
      Session.set("showCreateGame", true);
    },

    'click #joingame': function (event) {
      Session.set("showLobby", false);
      Session.set("showJoinGame", true);
    },

    'click #settings': function (event) {
      Session.set("showLobby", false);
      Session.set("showSettings", true);
    }
  });

  Template.createGame.events({
    'click #creategamenow': function(event) {
      var playerName = document.getElementById("playerName").value;
      var numberPlayers = document.getElementById("numberPlayers").value;
      var storyName = document.getElementById("storyName").value;

      Meteor.call('createGame', storyName, numberPlayers, function(error, result) {
          Session.set("myGameID", result);
      });
      var myGameID = Session.get("myGameID");
      alert(myGameID);
      Meteor.call('createPlayer', gameID);

      Session.set("showCreateGame", false);
      Session.set("showLobby", true);
    }
  });

}

//SERVER------------------------------------------------------------------------------------------

if (Meteor.isServer) {

  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
   
    createGame: function(storyName, numberPlayers, gameID) {
      return Games.insert({Title: storyName, PlayerCount: 1, PlayersPerGame: numberPlayers});
    },

    createPlayer: function(playerName, gameID) {
      Players.insert({Name: playerName, Score: 0, Sentences: "", GameID: gameID});
    }

  });

  Meteor.publish("games", function() {
    return Games.find({$where: 'this.PlayerCount < this.PlayersPerGame'});
  });
}
