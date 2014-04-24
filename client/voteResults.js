Template.voteResults.helpers({
  canPlay: function() {
    var playerID = Session.get("playerID");
    var player = Players.findOne(playerID, {fields: {CanPlay: 1}});
    var canPlay = player.CanPlay;
    return canPlay;
  },

  info: function() {
    var results = new Array;
    var players = Players.find({}, {sort: {Score: -1}}).fetch();
    for (var i=0; i<players.length; i++) {
      var sentence = PlayerSentences.findOne({PlayerID: players[i]._id});
      var text = sentence.Text;
      var votes = sentence.Votes;
      var line = "<p>" + i + 1 + ". \"" + sentence + "\"" + players[i].Name + " (" + votes + ")</p>";
      results[i] = line;
    }
    return results;
  }
});

Template.voteResults.events({
  'click #nextRound': function(event) {
    stageThreeSubmit();
  }
});
