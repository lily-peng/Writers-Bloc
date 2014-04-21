stageOneSubmit = function() {
  Meteor.clearTimeout(Session.get("timerID"));
  var gameID = Session.get("gameID");
  var currentRound = Session.get("currentRound");
  var playerID = Session.get("playerID");
  var text = document.getElementById("sentence").value;
  Meteor.call("stageOneSubmit", gameID, playerID, currentRound, text);
}

Template.stageOne.showStageOne = function() {
  var show = Session.get("gameState") == SHOW_STAGE_ONE;
  if (show) {
    Session.set("time", 90);
    Session.set("timerID", Meteor.setTimeout(stageOneSubmit, 90000));
  }
  return show;
}

Template.stageOne.helpers({
  game: function() {
    var game = Games.findOne({});
    if (game)
      return game;
    return "";
  },
});
