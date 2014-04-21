Template.story.helpers({
  firstSentence: function() {
    var sentence = Games.findOne({}).FirstSentence;
    return sentence;
  },

  lastSentence: function() {
    var sentence = Games.findOne({}).LastSentence;
    return sentence;
  },

  sentences: function() {
    var sentences = Games.findOne({}).Sentences;
    return sentences;
  }
});

