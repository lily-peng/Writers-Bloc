Session.set('gameId', 1);
Session.set('roundNumber', 1);
Session.set('playerId', 1);
Session.set('gameStage', 1);

Template.story.sentences = function() {
  return Sentences.find({}, {sort: {roundNumber: 1}});
}

Template.stage1.events = {
  'click #stage1Submit': function(event) {
    var sentenceText = document.getElementById('sentence');

    if (sentence.value != '') {
      Meteor.call('addSentence', Session.get('gameId'), Session.get('playerId'), Session.get('roundNumber'), sentenceText, 0, Math.random());
      document.getElementById('sentence').value = '';
      sentence.value = '';
    } else {
      alert('Please type a sentence!');
    }
  }
}

Template.stage2.sentences = function() {
  return Sentences.find({}, {sort: {randomNumber: -1}});
}

Template.stage2.events = {
  'click #stage2Submit': function(event) {
    return;  
  }
}
