
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

    /* Set timer tick function */
    Meteor.setInterval(timerTick, 1000);
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
      }

		  /* pull currentRound from Games collection */
      try {
        var currentRoundCursor = Games.findOne(gameID, {fields: {CurrentRound: 1}});
      	currentRound = currentRoundCursor.CurrentRound;
        Session.set("currentRound", currentRound);
      } catch (err) {
      }

      /* pull number of players from Players collection */
      try {
        var numPlayersCursor = Games.findOne(gameID, {$fields: {PlayerCount: 1}});
        var numPlayers = numPlayersCursor.PlayerCount;
        Session.set("numberOfPlayers", numPlayers);
      } catch (err) {
      }

      /* pull number of players from Players collection */
      try {
        var readyPlayers = Players.find({GameID: gameID, CanPlay: false}).fetch().length;
        Session.set("numberOfReadyPlayers", readyPlayers);
      } catch (err) {
      }
    }

    /* subscribe to Games */
    Meteor.subscribe("games", gameState, gameID);

    /* subscribe to Players */
    Meteor.subscribe("players", gameID);

    /* subscribe to Sentences */
    Meteor.subscribe("playerSentences", gameID, playerID, gameState, currentRound);

    /* subscribe to Messages */
    Meteor.subscribe("messages", gameID);

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


