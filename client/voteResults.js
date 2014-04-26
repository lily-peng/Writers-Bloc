Template.voteResults.helpers({
  canPlay: function() {
    var playerID = Session.get("playerID");
    var player = Players.findOne(playerID, {fields: {CanPlay: 1}});
    var canPlay = player.CanPlay;
    return canPlay;
  },

  info: function() {
    var sentence = PlayerSentences.findOne({}, {sort: {Votes: -1}});
    var playerID = sentence.PlayerID;
	  var player = Players.find(playerID);
    return "\"" + sentence.Text + "\" -" + player.Name;
  },

  nonVotingLoser: function() {
    var player = Players.find(Session.get("playerID"));
	  if (player.Voted) {
      return false;
    }
    return true;
  }
});

Template.voteResults.events({
  'click #nextRound': function(event) {
    stageThreeSubmit();
  }
});
