Template.chat.helpers({
  messages: function() {
    var messages = Messages.find({}, {sort: {Date: 1}});
    return messages;
  }
});

Template.chat.events({
  'click #submitMessage': function(event) {
    var gameID = Session.get("gameID");
    var playerID = Session.get("playerID");
    var playerName = Players.findOne(playerID).Name;
    var textbox = document.getElementById("chatText");
    var text = textbox.value;
    textbox.value = "";
    Meteor.call("insertMessage", gameID, playerName, text);
    var history = document.getElementById("chatHistory");
    history.scrollTop = history.scrollHeight;
  }
});
