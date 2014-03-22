/**
* Templates
*/

var inLobby = false;
Meteor.subscribe("players");

Template.messages.messages = function () {
  return Messages.find({}, { sort: { time: +1 }});
  
  //return messages.find({room:Session.get("room")}) //get the room name set in the router
}

Template.lobbybutton.events = {
  'click' : function () {
    if (typeof console !== 'undefined')
      //here is what happens if you click the button
      console.log("inLobby: " + inLobby);
      inLobby = true;
      $('#input').html(Meteor.render(Template.input));
      $('#messages').html(Meteor.render(Template.messages));
      $('#messages').html(Meteor.render(Template.lobby));
      console.log("inLobby: " + inLobby);
      
      lobbystart();
    }
}

Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      if (Meteor.user())
        var name = Meteor.user().profile.name;
      else
        //here you can try to do Guest1, Guest2, etc.
        var name = 'Guest';
      var message = document.getElementById('message');

      if (message.value != '') {
        Messages.insert({
          name: name,
          message: message.value,
          time: Date.now(),
        });

        document.getElementById('message').value = '';
        message.value = '';
      }
    }
  }
}

Template.lobbybutton.show = function () {
  // show main chat if button not clicked
  return !(inLobby);
};

Template.input.show = function () {
  // show main chat if button not clicked
  return !(inLobby);
};

Template.messages.show = function () {
  // show main chat if button not clicked
  return !(inLobby);
};

Template.lobby.show = function () {
  // show lobby if lobbybutton is clicked, triggering inLobby
  return inLobby;
};

Template.lobby.events = {
  'lobbystart' : function () {
    console.log("here");
    if (! Meteor.userId()) { // must be logged in to join lobbies
      console.log("not logged in");
      return;
    }
    var name = $('Meteor.userId()').val().trim();
    console.log("Name: " + displayName(name));
  }

}

function lobbystart () {
  console.log("here");
  if (! Meteor.user()) { // must be logged in to join lobbies
    console.log("not logged in");
    return;
  }
  //var name = $('Meteor.userId()').val().trim();
  var name = Meteor.user().profile.name;
  console.log("Name: " + name);
}

Template.lobby.name = function () {
    return Meteor.user().profile.name;
}

/*Template.lobby.waiting = function () {
  var players = Players.find({_id: {$ne: Session.get('player_id')},
                              name: {$ne: ''},
                              game_id: {$exists: false}});

  return players;
};

Template.lobby.count = function () {
  var players = Players.find({_id: {$ne: Session.get('player_id')},
                              name: {$ne: ''},
                              game_id: {$exists: false}});

  return players.count();
};*/

/*Meteor.Router.add({
  '/': 'home',
  '/rooms/:id': function(id) {
     Session.set("room",id); //set the room for the template
     return "messages"; //If you're template is called messages
  },
  '*': 'not_found'
});*/


