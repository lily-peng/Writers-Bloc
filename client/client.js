/**
* Templates
*/
Template.messages.messages = function () {
  return Messages.find({}, { sort: { time: +1 }});
  
  //return messages.find({room:Session.get("room")}) //get the room name set in the router
}

Template.lobby.events = {
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      //here is what happens if you click the button
      
      console.log("You pressed the button");
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

/*Meteor.Router.add({
  '/': 'home',
  '/rooms/:id': function(id) {
     Session.set("room",id); //set the room for the template
     return "messages"; //If you're template is called messages
  },
  '*': 'not_found'
});*/


