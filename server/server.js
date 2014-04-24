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
      CanPlay: false,
      Voted: false
    });
    return id;
  },

  setIsHost: function(playerID, isHost) {
    Players.update(playerID, {$set: {Host: isHost}});
  },
  
  setGameID: function(playerID, gameID) {
    Players.update(playerID, {$set: {GameID: gameID}});
  },

  fillGame: function(gameID) {
    /* Close off the game so others cannot join */
    var currentPlayers = Games.findOne(gameID).PlayerCount;
    Games.update(gameID, {$set: {PlayersPerGame: currentPlayers}}); 
  },
  
  incrementNumberPlayers: function(gameID) {
    Games.update(gameID, {$inc: {PlayerCount: 1}});
  },

  decrementNumberPlayers: function(gameID, playerID, wasHost) {
    Games.update(gameID, {$inc: {PlayerCount: -1}});
    if (Games.findOne(gameID).PlayerCount == 0) {
      Games.remove(gameID);
    } else if (wasHost) {
      Players.update({_id: {$ne: playerID},GameID: gameID}, {$set: {Host: true}});  
    }
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

  insertMessage: function(gameID, playerName, text) {
    var now = new Date();
    Messages.insert({GameID: gameID, PlayerName: playerName, Text: text, Date: now});
  },

  incrementScore: function(playerID, points) {
    Players.update(playerID, {$inc: {Score: points}});
  },

  setPlayerVoted: function(playerID, voted) {
    Players.update(playerID, {$set: {Voted: voted}});
  },

  /* handles submissions */ 
  stageOneSubmit: function(gameID, playerID, roundNumber, text, numPlayers, numReadyPlayers) {

    /* Add the sentence to the collection if they participated */
    if (text != "") {
		  PlayerSentences.insert({
				GameID: gameID, 
				PlayerID: playerID, 
		    RoundNumber: roundNumber,
				Text: text, 
				Votes: 0,
		    Random: Math.random()
			});
    }

    /* Disable the player until the next stage */
    Players.update(
			playerID, {
				$set: {
		      CanPlay: false
				}  	
   	  }
		);

    /* Enable all players and move onto voting stage if ready */
    if (numPlayers == numReadyPlayers + 1) {
	    /* Set all players to gameState */
	    for (var i=0; i<numPlayers; i++) {
			  Players.update(
					{GameID: gameID, GameState: {$ne: 8}}, 
					{$set: {GameState: 8, CanPlay: true}}
				);
	    }
    }
  },

  stageTwoSubmit: function(gameID, playerID, sentenceID, roundNumber, numPlayers, numReadyPlayers) {

    /* Vote for a sentence */
    if (sentenceID != null) {
		  PlayerSentences.update(
				sentenceID,
				{$inc: {Votes: 1}}
			);
       
      /* Reward player for participating */
      Players.update(playerID, {$set: {Voted: true}});
	  }

    /* Disable the player until the next stage */
    Players.update(
			playerID, {
				$set: {
		      CanPlay: false
				}  	
   	  }
		);

    /* See if everyone has voted */
    if (numPlayers == numReadyPlayers + 1) {	
      /* Give players their points */
      //TODO: implement ACTUAL scoring system (should this even be done here?)
      var players = Players.find({GameID: gameID}).fetch();
      for (var i=0; i<players.length; i++) {
        var pid = players[i]._id;
        var points = PlayerSentences.findOne({GameID: gameID, RoundNumber: roundNumber, PlayerID: pid}).Votes;
        Players.update(pid, {$inc: {Score: points}});
      }      

      /* Add a sentence to the story */
      var bestSentence = PlayerSentences.findOne({GameID: gameID, RoundNumber: roundNumber}, {sort: {Votes: -1}});
      console.log("Best sentence: " + bestSentence.Text);
      Games.update(gameID, {$push: {Sentences: bestSentence.Text}});
     
      /* Set all players to gameState */
	    for (var i=0; i<numPlayers; i++) {
			  Players.update(
					{GameID: gameID, GameState: {$ne: 9}}, 
					{$set: {GameState: 9, CanPlay: true}}
				);
	    }
    }
  },

  stageThreeSubmit: function(gameID, playerID, currentRound) {

    /* Disable the player until the next stage */
    Players.update(
			playerID, {
				$set: {
		      CanPlay: false
				}  	
   	  }
		);  

    /* Get the number of players in game */
    var numPlayers = Games.findOne(gameID, {$fields: {PlayerCount: 1}}).PlayerCount;
    var numReadyPlayers = Players.find({GameID: gameID, CanPlay: false}).fetch().length;

    /* See if all players are ready */     	
    if (numPlayers == numReadyPlayers) {

      var rounds = Games.findOne(gameID, {Rounds: 1}).Rounds;
			var nextStage;

      /* See if game is over */
      if (currentRound == rounds) {

        /* Results */
        nextStage = 10;
      } else {

        /* Stage 1 */
        nextStage = 7;

				/* Increment the round */
	      Games.update(gameID, {$inc: {CurrentRound: 1}});
      }

		  /* Set all players to gameState */
		  for (var i=0; i<numPlayers; i++) {
				Players.update(
					{GameID: gameID, GameState: {$ne: nextStage}}, 
					{$set: {GameState: nextStage, CanPlay: true}}
				);
		  } 
    }
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

Meteor.publish("playerSentences", function(gameID, playerID, gameState, roundNumber) {
  if (gameState == 8) {
    return PlayerSentences.find({GameID: gameID, RoundNumber: roundNumber, PlayerID: {$ne: playerID}});
  } else if (gameState == 9) {
    return PlayerSentences.find({GameID: gameID, RoundNumber: roundNumber});
  }
  return null;
});

Meteor.publish("messages", function(gameID) {
  return Messages.find({GameID: gameID});
});

