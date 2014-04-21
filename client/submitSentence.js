Template.submitSentence.helpers({
  canPlay: function() {
    var playerID = Session.get("playerID");
    var player = Players.findOne(playerID, {fields: {CanPlay: 1}});
    var canPlay = player.CanPlay;
    return canPlay;
  }    
});

Template.submitSentence.events({
  'click #sentenceButton': function(event) {
    stageOneSubmit();
  }
});

