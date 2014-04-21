timerTick = function() {
  var time = Session.get("time");
  Session.set("time", time - 1);
}

Template.timer.helpers({
  time: function() {
    var time = Session.get("time");
    if (time >= 70) {
      return "1:" + (time - 60);
    } else if (time >= 60) {
      return "1:0" + (time - 60);
    } else if (time >= 10) {
      return "0:" + time;
    } else {
      return "0:0" + time;
    }
  }
});
