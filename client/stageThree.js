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
    Session.set("time", 15);
    Session.set("timerID", Meteor.setTimeout(stageThreeSubmit, 15000));
  }
  return show;
}