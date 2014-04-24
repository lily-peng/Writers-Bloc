Template.results.showResults = function() {
  return Session.get("gameState") == SHOW_RESULTS;
}

Template.results.helpers({
  author: function() {
    var author = Players.findOne({}, {sort: {Score: -1}});
    return author.Name;
  }
});
