stageThreeSubmit = function() {
  Meteor.clearTimeout(Session.get("timerID"));
  var gameID = Session.get("gameID");
  var playerID = Session.get("playerID");
  var currentRound = Session.get("currentRound");
  Meteor.call("stageThreeSubmit", gameID, playerID, currentRound);
}

Template.stageThree.showStageThree = function() {
  var show = Session.get("gameState") == SHOW_STAGE_THREE;
  if (show) {
    Session.set("time", 10);
    Session.set("timerID", Meteor.setTimeout(stageThreeSubmit, 10000));
  }
  return show;
}
