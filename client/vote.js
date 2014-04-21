Template.vote.helpers({
  canPlay: function() {
    var playerID = Session.get("playerID");
    var player = Players.findOne(playerID, {fields: {CanPlay: 1}});
    var canPlay = player.CanPlay;
    return canPlay;
  },

  sentences: function() {
    var sentences = PlayerSentences.find({}, {sort: {Random: 1}});
    return sentences;
  }    
});

Template.vote.events({
  'click #castVote': function(event) {
	  stageTwoSubmit();  
  }
});
