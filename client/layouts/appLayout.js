

Template.appLayout.rendered = function() {
  $('.dropdown').dropdown();
}


Template.appLayout.helpers({
  me: function() {
    return Meteor.user();
  }
});

Template.appLayout.events({
  'click .sign-out': function (event, template) {
      Meteor.logout(function(err){
          if (err) {
              throw new Meteor.Error("Logout failed");
          }
      })
  }
});

