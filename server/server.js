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

  /* handles submissions */ 
  stageOneSubmit: function(gameID, playerID, roundNumber, text) {

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

    /* Get the number of players in game */
    var numPlayers = Games.findOne(gameID, {$fields: {PlayerCount: 1}}).PlayerCount;
    var numReadyPlayers = Players.find({GameID: gameID, CanPlay: false}).fetch().length;

    /* Get the number of sentences from this round */
    var numSentences = PlayerSentences.find({
			GameID: gameID, 
			RoundNumber: roundNumber
		}).fetch().length;

    /* Enable all players and move onto voting stage if ready */
    if (numPlayers == numReadyPlayers) {
	    /* Set all players to gameState */
	    for (var i=0; i<numPlayers; i++) {
			  Players.update(
					{GameID: gameID, GameState: {$ne: 8}}, 
					{$set: {GameState: 8, CanPlay: true}}
				);
	    }
    }
  },

  /* handles votes */
  stageTwoSubmit: function(gameID, playerID, sentenceID, roundNumber) {

    /* Vote for a sentence */
    if (sentenceID != null) {
		  PlayerSentences.update(
				sentenceID,
				{$inc: {Votes: 1}}
			);
       
      /* Reward player for participating */
      Players.update(playerID, {Voted: true});
	  }

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
       
    /* See if everyone has voted */
    if (numPlayers == numReadyPlayers) {

      /* Find highest score */
      var topScore = PlayerSentences.findOne({GameID: gameID, RoundNumber: roundNumber}, {sort: {Votes: -1}}).Votes;

      /* How many with that score? */
      var winners = PlayerSentences.find({Votes: topScore}).fetch();

      Players.update({GameID: gameID}

      /* Award winner(s) */
      /*
      if (winners.length == 1) {
		    var winnerID = PlayerSentences.findOne({GameID: gameID, RoundNumber: roundNumber}, {sort: {Votes: -1}}).PlayerID;
		    Players.update(
		      winnerID,
		      {$inc: {Score: 3}}
		    );
      } else {
        for (var i=0; i<winners.length; i++) {
				  var winnerID = winners[i].PlayerID;
				  Players.update(
				    winnerID,
				    {$inc: {Score: 2}}
				  );
        }
      }
      */
      //TODO: +1 to all 2nd place

      /* Add one sentence to the story */
      var bestSentence = PlayerSentences.findOne({GameID: gameID, RoundNumber: roundNumber, PlayerID: winnerID}).Text;
      Games.update(gameID, {$push: {Sentences: bestSentence}});

	    /* Reward voters and all players to gameState */
	    for (var i=0; i<numPlayers; i++) {
        Players.update(
          {GameID: gameID, Voted: true},
          {$inc: {Score: 1}, Voted: false}
        );
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

      console.log("Round " + currentRound + " of " + rounds);        

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

