Meteor.startup({

Meteor.methods({
  addSentence: function(gameId, playerId, roundNumber, text, votes, randomNumber) {
    Sentences.insert({
      gameId: gameId,
      playerId: playerId,
      roundNumber: roundNumber,
      text: text,
      votes: votes,
      randomNumber: randomNumber
    });
  }

  getStory: function(gameId) {
    return Sentences.find({gameId: gameId});
  }
});

