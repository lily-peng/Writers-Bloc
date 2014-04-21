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
