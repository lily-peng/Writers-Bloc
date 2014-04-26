Template.results.showResults = function() {
  return Session.get("gameState") == SHOW_RESULTS;
}

Template.results.helpers({
  author: function() {
    var author = Players.findOne({}, {sort: {Score: -1}});
    return author.Name;
  },

  title: function() {
    var title = Games.findOne({}).Title;
	  return title;
  },  

  firstSentence: function() {
    var firstSentence = Games.findOne({}).FirstSentence;
    return firstSentence;
  },

  lastSentence: function() {
    var lastSentence = Games.findOne({}).LastSentence;
    return lastSentence;
  },

  sentences: function() {
    var sentences = Games.findOne({}).Sentences;
    return sentences;
  }
});
