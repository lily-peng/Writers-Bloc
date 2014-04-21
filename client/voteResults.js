Template.voteResults.helpers({
  canPlay: function() {
    var playerID = Session.get("playerID");
    var player = Players.findOne(playerID, {fields: {CanPlay: 1}});
    var canPlay = player.CanPlay;
    return canPlay;
  },

  sentences: function() {
    var sentences = PlayerSentences.find({}, {sort: {Votes: -1}});
    return sentences;
  }
});

Template.voteResults.events({
  'click #nextRound': function(event) {
    stageThreeSubmit();
  }
});
