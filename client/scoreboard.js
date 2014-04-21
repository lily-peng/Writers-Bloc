Template.scoreboard.helpers({
  players: function() {
    var players = Players.find({}, {sort: {Score: -1}});
    return players;
  }
});
