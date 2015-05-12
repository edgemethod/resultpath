Meteor.startup(function() {
  AutoForm.setDefaultTemplate("semanticUI");
});



UI.registerHelper("me", function(collectionName) {
  return Meteor.user();
});

UI.registerHelper("notFirst", function() {
  return this.index != 0
});


UI.registerHelper("author", function(collectionName) {
  return Meteor.user(this.userId);
});


UI.registerHelper("datePosted", function(collectionName) {
  return moment(this.createdAt).fromNow();
});



UI.registerHelper("routeStatusIs", function(testAgainst) {

  var currentRoute = Router.current().params.status;
  return currentRoute == testAgainst;

});

UI.registerHelper("routeNameIs", function(testAgainst) {

  var currentRoute = Router.current().route.getName();
  return currentRoute == testAgainst;

});

UI.registerHelper('addIndex', function (all) {
  if (all && all.length) {
    return _.map(all, function(val, index) {
      val.index = index;
      return val;
    });
  }
    else {
      return all
    }
});

_.mixin({
  titlecase: function(str) {
    return str.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );

    //return str.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    //return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  },
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
});