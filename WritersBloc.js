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

  /* Game state constants */
  SHOW_LOBBY = 0;
  SHOW_CREATE_GAME = 1;
  SHOW_JOIN_GAME = 2;
  SHOW_WAIT_FOR_GAME = 3;
  SHOW_SETTINGS = 4;
  SHOW_RULES = 5;
  SHOW_START_GAME = 6;
  SHOW_STAGE_ONE = 7;
  SHOW_STAGE_TWO = 8;
  SHOW_STAGE_THREE = 9;
  SHOW_RESULTS = 10;

  Meteor.startup(function () {   
    /* Subscribe to static collections */
    Meteor.subscribe("firstSentences");
    Meteor.subscribe("lastSentences");

    //Session.set("playerID", null);

    /* Create the player */
    var playerName = prompt("Please enter your name:", "");
    Meteor.call("createPlayer", playerName, function(error, result) {
      Session.set("playerID", result);
    });

    /* Set initial Session variables */
    Session.set("gameState", SHOW_LOBBY);
    Session.set("gameID", null);
    Session.set("notSubmitted", true);
    Session.set("showSubmitted", false);
    Session.set("roundNum", 0);   
  });
 
  Deps.autorun(function () {
    /* Reactive variables */
    var gameID = Session.get("gameID");
    var playerID = Session.get("playerID");
    var gameState = null;
    var currentRound = null;
    
    if (playerID != undefined) {
      /* pull gameState from Players collection */
      try {
  			var gameStateCursor = Players.findOne(playerID, {fields: {GameState: 1}});
				gameState = gameStateCursor.GameState;
				Session.set("gameState", gameState);
			} catch (err) {
        //console.log("No gameState!");
      }

		  /* pull currentRound from Games collection */
      try {
        var currentRoundCursor = Games.findOne(gameID, {fields: {CurrentRound: 1}});
      	currentRound = currentRoundCursor.CurrentRound;
        Session.set("currentRound", currentRound);
      } catch (err) {
        //console.log("No currentRound!");
      }
    }

    /* subscribe to Games */
    Meteor.subscribe("games", gameState, gameID);

    /* subscribe to Players */
    Meteor.subscribe("players", gameID);

    /* subscribe to Sentences */
    Meteor.subscribe("playerSentences", gameID, gameState, currentRound);

    /* join a game I created */
    if (gameState == SHOW_CREATE_GAME && gameID != null) {
      Meteor.call("setGameID", playerID, gameID);
      Meteor.call("setIsHost", playerID, true);
      Meteor.call("setPlayerGameState", playerID, SHOW_WAIT_FOR_GAME);
    }

    /* leave a game I am not in */
    else if (gameState == 0 && gameID != null) {
      Session.set("gameID", null);
    }
  });

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

  Template.stageOne.showStageOne = function() {
    return Session.get("gameState") == SHOW_STAGE_ONE;
  }

  Template.stageTwo.showStageTwo = function() {
    return Session.get("gameState") == SHOW_STAGE_TWO;
  }

  Template.stageThree.showStageThree = function() {
    return Session.get("gameState") == SHOW_STAGE_THREE;
  }

  Template.results.showResults = function() {
    return Session.get("gameState") == SHOW_RESULTS;
  }

  Template.waitForGame.showWaitForGame = function() {
    return Session.get("gameState") == SHOW_WAIT_FOR_GAME;
  }

  ////////////////////Template Helpers//////////////////////////

  Template.joinGame.helpers({
    availableGames: function() {
      var games = Games.find({});
      if (games)
	      return games;
      return "";
    }
  });

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

  Template.stageOne.helpers({
    game: function() {
      var game = Games.findOne({});
      if (game)
        return game;
      return "";
    },

    canPlay: function() {
      var playerID = Session.get("playerID");
      var player = Players.findOne(playerID, {fields: {CanPlay: 1}});
      var canPlay = player.CanPlay;
      return canPlay;
    }
  });

  Template.stageTwo.helpers({
    game: function() {
      var game = Games.findOne({});
      if (game)
        return game;
      return "";
    },

    canPlay: function() {
      var playerID = Session.get("playerID");
      var player = Players.findOne(playerID, {fields: {CanPlay: 1}});
      var canPlay = player.CanPlay;
      return canPlay;
    },

    sentences: function() {
      var sentences = PlayerSentences.find({});
      return sentences;
    }    
  });

  Template.round.helpers({
    title: function() {
      var currentRound = Session.get("currentRound");
      var finalRound = Games.findOne({}).Rounds;
      if (currentRound == finalRound) {
        return "Last round, double points!";
      } else {
        return "Round " + currentRound + " of " + finalRound;
      }
    }
  }); 
  /////////////////Template Events//////////////////////////////////
  
  Template.goBack.events({
    'click #lobby' : function(event) {
      var playerID = Session.get("playerID");
      Meteor.call("setPlayerGameState", playerID, SHOW_LOBBY);
    }
  });

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

      Meteor.call("createGame", storyName, parseInt(numberPlayers), parseInt(numberRounds), firstSentence, lastSentence, function(error, result) {
        Session.set("gameID", result);
      });    
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
    }
  });

  Template.waitForGame.events({
    'click #start': function(event) {
      var gameID = Session.get("gameID");
      Meteor.call("incrementRound", gameID);
      Meteor.call("setGroupGameState", gameID, SHOW_STAGE_ONE);
    }
  });

  Template.stageOne.events({
    'click #submit': function(event) {
      var gameID = Session.get("gameID");
      var currentRound = Session.get("currentRound");
      var playerID = Session.get("playerID");
      var text = document.getElementById("sentence").value;
      Meteor.call("stageOneSubmit", gameID, playerID, currentRound, text);
    }
  });

  Template.stageTwo.events({
    'click #submit': function(event) {
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
      Meteor.call("stageTwoSubmit", gameID, playerID, sentenceID, currentRound);    
    }
  });
}

//SERVER------------------------------------------------------------------------------------------

if (Meteor.isServer) {

  Meteor.startup(function () {

  });

  Meteor.methods({
    
    createGame: function(storyName, numberPlayers, rounds, firstSentence, lastSentence) {
      var id = Games.insert({
        Title: storyName, 
        PlayerCount: 1, 
        PlayersPerGame: numberPlayers, 
        CurrentRound: 0, 
        Rounds: rounds,
        FirstSentence: firstSentence, 
        LastSentence: lastSentence,
        Sentences: []
      });
      return id;
    },

    createPlayer: function(playerName) {
      var id = Players.insert({
        Name: playerName, 
        Score: 0, 
        GameState: 0,
        GameID: null,
        Host: false,
        CanPlay: false
      });
      return id;
    },

    setIsHost: function(playerID, isHost) {
      Players.update(playerID, {$set: {Host: isHost}});
    },
    
    setGameID: function(playerID, gameID) {
      Players.update(playerID, {$set: {GameID: gameID}});
    },
    
    incrementNumberPlayers: function(gameID) {
	    Games.update(gameID, {$inc: {PlayerCount: 1}});
    },

    setPlayerGameState: function(playerID, gameState) {
      Players.update(
				playerID, {
					$set: {GameState: gameState}
				}
			);
    },
 
    setGroupGameState: function(gameID, gameState) {
      Meteor._debug("Setting group game state");
      /* Get the number of players in game */
      var numPlayers = Players.find({GameID: gameID}).fetch().length;

      /* Set all players to gameState */
      for (var i=0; i<numPlayers; i++) {
		    Players.update({
				  GameID: gameID,
          GameState: {$ne: gameState}
				}, {
					$set: {
						GameState: gameState, 
						CanPlay: true
					}
				});
      }
    },
    
    incrementRound: function(gameID) {
	    Games.update(gameID, {$inc: {CurrentRound: 1}});
    },

    stageOneSubmit: function(gameID, playerID, roundNumber, text) {
      /* Get the number of players in game */
      var numPlayers = Players.find({GameID: gameID}).fetch().length;

      /* Add the sentence to the collection */
      PlayerSentences.insert({
				GameID: gameID, 
				PlayerID: playerID, 
        RoundNumber: roundNumber,
				Text: text, 
				Votes: 0
			});

      /* Disable the player until the next stage */
      Players.update(
				playerID, {
					$set: {
			      CanPlay: false
					}  	
	   	  }
			);

      /* Get the number of sentences from this round */
      var numSentences = PlayerSentences.find({
				GameID: gameID, 
				RoundNumber: roundNumber
			}).fetch().length;

      /* Enable all players and move onto voting stage if ready */
      if (numSentences == numPlayers) {
		    /* Set all players to gameState */
		    for (var i=0; i<numPlayers; i++) {
				  Players.update(
						{GameID: gameID, GameState: {$ne: 8}}, 
						{$set: {GameState: 8, CanPlay: true}}
					);
		    }
      }
    },

    stageTwoSubmit: function(gameID, playerID, sentenceID, roundNumber) {
      /* Get the number of players in game */
      var numPlayers = Players.find({GameID: gameID}).fetch().length;
      console.log("Number of players: " + numPlayers);  
 
      /* Vote for a sentence */
      PlayerSentences.update(
				sentenceID,
				{$inc: {Votes: 1}}
			);
      console.log("PlayerSentences.update(" + sentenceID + ", {$inc: {Votes: 1}});");

      /* Disable the player until the next stage */
      Players.update(
				playerID, {
					$set: {
			      CanPlay: false
					}  	
	   	  }
			);
 
      var sentences = PlayerSentences.find({GameID: gameID, RoundNumber: roundNumber}, {Votes: 1}).fetch(); 
      var numVotes = 0;
      for (var i=0; i<sentences.length; i++) {
        numVotes += sentences[i].Votes;
      }
      console.log("Votes cast: " + numVotes);

      /* Enable all players and move onto voting stage if ready */
      if (numVotes == numPlayers) {

		    /* Set all players to gameState */
		    for (var i=0; i<numPlayers; i++) {
				  Players.update(
						{GameID: gameID, GameState: {$ne: 7}}, 
						{$set: {GameState: 7, CanPlay: true}}
					);
		    }
      	
				/* Increment the round */
      	Games.update(gameID, {$inc: {CurrentRound: 1}});      
			}

      /* Check to see if game is over */
      //todo

      
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
  
  Meteor.publish("playerSentences", function(gameID, gameState, roundNumber) {
    if (gameState == 8)
      return PlayerSentences.find({GameID: gameID, RoundNumber: roundNumber});
    return null;
  });
}
