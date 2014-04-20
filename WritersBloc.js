//SHARED AREA-------------------------------------------------------------------------------------

firsts = new Array('It was a dark and stormy night.',
'\"How many demons have you slain?\" the man said to Balendro. \"Just one, but it was a big one.\"',
'\"Fight the state.\" These were the words that have echoed in my mind for years.',
'It was an abnormally bright day in November when we parted ways.',
'I had heard this story from various people, and as generally happens in situations such as this, every person told a different tale.',
'It wasn\'t until he was on the firing squad that the Major thought about this day.',
'\"Where am I?!\" Nathaniel screamed into the darkness.',
'The park was empty, considering the weather.',
'My story begins on the happiest day of my life.',
'I remember thinking, \"I can still win this.\"',
'As soon as she entered the room, I could tell she would be nothing but trouble.',
'In the dark, damp cell, he began scribbling on the walls.',
'I really should have known when to give up.',
'There was no possibility of taking a walk that day.',
'I remember her well.',
'It was the afternoon of his forty-eighth birthday when Charles\' life was turned upside down.',
'For the longest time, I used to go to bed early.',
'\"That was a mistake.\"',
'He was a man named John Slattery, and he almost deserved it.',
'We were halfway out of town when the drugs started to kick in.',
'\"Why don\'t you start at the beginning? It\'s always the easiest,\" she said as we both put back another shot.',
'People always ask me \"Do you consider your book to be autobiographical?\"',
'\"Who are you?\"',
'She waited impatiently for the bus to pick up the kids.',
'\"Sorry I\'ve been gone so long. I won\'t let you down again.\"',
'They called him the Code Warrior. He lives now, but only in our memories.',
'I\'ve always loved this town.',
'I would rather have not known.',
'I couldn\'t help but overhear the women in the corner',
'We were scheduled to leave exactly at noon.',
'No one could believe they were back together.',
'She was crazy.',
'The whole idea didn\'t really appeal to him.');

lasts = new Array('The end. Or is it?',
                                    'It couldn\'t have been more perfect.',
                                    'Tomorrow, I\'ll think of some way to get him back. After all, tomorrow is another day.',
                                    'She smiled.',
                                    'She lowered the sword and noticed that the twitch had stopped.',
                                    '\"Wow, I can\'t believe that actually worked!\"',
                                    'At this point, what difference could it possibly have made?',
                                    '\"Isn\'t this where we began?\"',
                                    '\"They\'re never going to believe this back home.\"',
                                    'The prophecy was fulfilled.',
                                    'You just can\'t make this stuff up.',
                                    '\"But I can\'t leave. Everything I hate is right here...\"',
                                    'And they all lived happily ever after.',
                                    'He never knew my name, and still doesn\'t. I\'d prefer to keep it that way.',
                                    '\"Stand still. It\'ll all be over soon.\"',
                                    '\"All right, folks, you\'ve seen enough. Move along now.\"',
                                    'She had a feeling that this one would leave a scar.',
                                    '\"You\'ll have to wait for me. I still have work to do.\"',
                                    '\"Today you...tomorrow me.\"',
                                    '\"Goodbye, my friend.\"',
                                    'He rode off into the sunset.',
                                    'He drove off, filled with hope for the first time in years.',
                                    'And, with that, the attack began at 6:23 AM, just as they said it would.',
                                    'I was right.',
                                    'She was right.',
                                    'He spoke with almost robotic intonation. \"The decision rests with you. We\'ll be waiting for your answer.\"',
                                    'And there was nothing we could do to stop it.',
                                    'It was flawless.',
                                    'After all, what\'s the worst that could happen?',
                                    'She knew it to be true, for it was written.',
                                    'And that\'s why you always leave a note.',
                                    'I never said it\'d be a happy ending, did I?',
                                    'I suppose everything worked out in the end.',
                                    'It was all a dream.');

Games = new Meteor.Collection("games");
Players = new Meteor.Collection("players");
FirstSentences = new Meteor.Collection("firstSentences");
for (var i = 0; i < firsts.length; i++) {
    FirstSentences.insert(firsts[i]);
}
LastSentences = new Meteor.Collection("lastSentences");
for (var i = 0; i < lasts.length; i++) {
    LastSentences.insert(lasts[i]);
}
PlayerSentences = new Meteor.Collection("playerSentences");

//CLIENT------------------------------------------------------------------------------------------

if (Meteor.isClient) {

  var SHOW_LOBBY = 0;
  var SHOW_CREATE_GAME = 1;
  var SHOW_JOIN_GAME = 2;
  var SHOW_WAIT_FOR_GAME = 3;
  var SHOW_SETTINGS = 4;
  var SHOW_RULES = 5;
  var SHOW_START_GAME = 6;
  var SHOW_STAGE_ONE = 7;
  var SHOW_STAGE_TWO = 8;
  var SHOW_STAGE_THREE = 9;

  Meteor.startup(function () {  
    // code to run on server at startup
    // prompt for name
    var playerName = prompt("Please enter your name:", "");
    var playerID;
    Meteor.call('createPlayer', playerName, function(error, result) {
      console.log("PLAYER_ID: " + result);
      Session.set("myPlayerID", result);
    });    
    console.log("SESSION_PLAYER_ID: " + Session.get("myPlayerID"));
    Session.set("gameState", SHOW_LOBBY);
  });
 
  Deps.autorun(function () {
    var gameState = Session.get("gameState");
    var gameID = Session.get("myGameID");
    Meteor.subscribe("games", gameState, gameID);
    Meteor.subscribe("players", gameID);
    Meteor.subscribe("firstSentences");
    Meteor.subscribe("lastSentences");
  });

  Session.set("gameState", SHOW_LOBBY);
  Session.set("notSubmitted", true);
  Session.set("showSubmitted", false);
  Session.set("roundNum", 0);
  
  Template.lobby.showLobby = function() {
    return Session.get("gameState") == SHOW_LOBBY;
  }

  Template.createGame.showCreateGame = function() {
    return Session.get("gameState") == SHOW_CREATE_GAME;
  }

  Template.joinGame.showJoinGame = function() {
    return Session.get("gameState") == SHOW_JOIN_GAME;
  }
  
  Template.rules.showRules = function() {
    return Session.get("gameState") == SHOW_RULES;
  }
  
  Template.startGame.showStartGame = function() {
    return Session.get("gameState") == SHOW_START_GAME;
  }
  
  Template.startGame.notSubmitted = function() {
    return Session.get("notSubmitted");
  }
  
  Template.startGame.showSubmitted = function() {
    return Session.get("showSubmitted");
  }

  Template.waitForGame.showWaitForGame = function() {
    return Session.get("gameState") == SHOW_WAIT_FOR_GAME;
  }

  ////////////////////Template Helpers//////////////////////////

  Template.joinGame.helpers({
    availableGames: function() {
      var games = Games.find({});
      return games;
    }
  });

  Template.waitForGame.helpers({    
    game: function() {
      var game = Games.find({});
      return game;
    }
  });

  Template.waitForGame.helpers({
    players: function() {
      var players = Players.find({});
      return players;
    }
  });
  
  Template.startGame.helpers({
    firstSentence: function() {
      var sent = Session.get("firstSentence");
      return sent;
    },
    
    lastSentence: function() {
      var sent = Session.get("lastSentence");
      return sent;
    }
  });
  
  /////////////////Template Events//////////////////////////////////
  
  Template.goBack.events({
    'click #lobby' : function(event) {
      Session.set("gameState", SHOW_LOBBY);
    }
  });

  Template.lobby.events({
    'click #creategame': function (event) {
      Session.set("gameState", SHOW_CREATE_GAME);
    },

    'click #joingame': function (event) {
      Session.set("gameState", SHOW_JOIN_GAME);
    },

    'click #settings': function (event) {
      Session.set("gameState", SHOW_SETTINGS);
    }
  });

  Template.createGame.events({
    'click #creategamenow': function(event) {
      var numberPlayers = document.getElementById("numberPlayers").value;
      var storyName = document.getElementById("storyName").value;
      var playerID = Session.get("myPlayerID");
      var myGameID;
      Meteor.call("createGame", myGameID, storyName, parseInt(numberPlayers), function(error, result) {
        console.log("GAME_ID: " + result);
        myGameID = result;
      });
      var firstSentence = document.getElementById("firstSentence").value;
      var lastSentence = document.getElementById("lastSentence").value;     
      if (firstSentence != ""){
          Session.set("firstSentence", firstSentence);
      } else {
          var rand1 = Math.floor((Math.random()*firsts.length)+1);
          Session.set("firstSentence", firsts[rand1]); //set firstSentence to random
      }
      if (lastSentence != ""){
          Session.set("lastSentence", lastSentence);
      } else {
          var rand2 = Math.floor((Math.random()*lasts.length)+1);
          Session.set("lastSentence", lasts[rand2]); //set lastSentence to random
      }
      
      Meteor.call("setGameID", playerID, myGameID);
      Session.set("myGameID", myGameID);
      console.log("SESSION_GAME_ID: " + Session.get("myGameID"));
      Session.set("gameState", SHOW_WAIT_FOR_GAME);
    }
  });
  
  Template.joinGame.events({
    'click #join': function(event) {
      var clicked = event.target;
      var clickedName = clicked.name;
      var playerID = Session.get("myPlayerID");
      Meteor.call("incrementNumberPlayers", clickedName);
      Meteor.call("setGameID", playerID, clickedName);
      Session.set("myGameID", clickedName);
      Session.set("gameState", SHOW_WAIT_FOR_GAME);
    }
  });
  
  var sec = 10;
  
  Template.rules.events({
      'click #startgame' : function(event) {
          
          Session.set("timer", setInterval(function() {
              if (sec > 0) {
                  sec--;
                  document.getElementById("timer").innerHTML = sec;
              }
              else { //here, put what happens when the timer runs out
                  sec=0;
                  document.getElementById("timer").innerHTML = 0;
                  if (Session.get("showSubmitted") == false) { //times out and you haven't submitted
                      var increment = Session.get("roundNum");
                      increment++;
                      Session.set("roundNum", increment);
                      var roundNum = Session.get("roundNum");
                      Session.set("notSubmitted", false);
                      Session.set("showSubmitted", true);
                      var sentence = document.getElementById("sentence").value; //should just submit whatever's in text box, but doesnt work.
                      var myGameID = Session.get("myGameID");
                      var myPlayerID = Session.get("myPlayerID");
                      Meteor.call("setRound", myGameID, roundNum);
                      Meteor.call('addPlayerSentence', myGameID, myPlayerID, sentence, 0);
                  }
              }
          }, 1000));
          
          Session.set("showRules", false);
          Session.set("showStartGame", true);
      }
  });
  
  Template.startGame.events({
      'click #submitSentence' : function(event) {
          var increment = Session.get("roundNum");
          increment++;
          Session.set("roundNum", increment);
          var roundNum = Session.get("roundNum");
          
          Session.set("notSubmitted", false);
          Session.set("showSubmitted", true);
          var sentence = document.getElementById("sentence").value;
          //console.log("sentence: " + sentence);
          var myGameID = Session.get("myGameID");
          //console.log("myGameID: " + myGameID);
          //console.log("mgid type: " + typeof(myGameID));
          var myPlayerID = Session.get("myPlayerID");
          //console.log("myPlayerID: " + myPlayerID);
          //console.log("mpid type: " + typeof(myPlayerID));
          //console.log("HEREEEEEEEEE: " + Meteor.call('addPlayerSentence', myPlayerID, sentence));
          Meteor.call("setRound", myGameID, roundNum);
          Meteor.call('addPlayerSentence', myGameID, myPlayerID, sentence, 0);
          
      }
      
  });
  
  Template.sentences.sentence = function() {
    var sentences = PlayerSentences.find({}).fetch();
    return sentences;
  }
}

//SERVER------------------------------------------------------------------------------------------

if (Meteor.isServer) {

  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    
    createGame: function(gameID, storyName, numberPlayers) {
      var id = Games.insert({Title: storyName, PlayerCount: 1, PlayersPerGame: numberPlayers, Round: 0});
      return id;
    },

    createPlayer: function(playerName) {
       var id = Players.insert({Name: playerName, Score: 0, GameID: null});
       return id;
    },
    
    setGameID: function(playerID, gameID) {
        Players.update(playerID, {$set: {GameID: gameID}});
    },
    
    incrementNumberPlayers: function(gameID) {
	  Games.update(gameID, {$inc: {PlayerCount: 1}});
    },
    
    setRound: function(gameID, roundNum){
        Games.update(gameID, {$set: {Round: roundNum}});
    },
    
    addPlayerSentence: function(gameID, playerID, text, votes) {
        PlayerSentences.insert({GameID: gameID, PlayerID: playerID, Text: text, Votes: votes});
    }   
  });

  Meteor.publish("games", function(gameState, gameID) {
	if (gameState < 3) {
      return Games.find({$where: "this.PlayerCount < this.PlayersPerGame"});
    } else {
      return Games.find(gameID);
    }
  });
  
  Meteor.publish("players", function(gameID) {
    return Players.find({GameID: gameID});
  });
  
  Meteor.publish("playerSentences", function() {
      return PlayerSentences.find({});
  });
}
