
Router.route('/', function () {
    this.redirect('changes', {status: 'proposed'});
});




Router.route('/changes/new', {
  name: 'changes.new'
});


Router.route('/changes/:status', {
  name: 'changes',
  waitOn: function() { return Meteor.subscribe('changes', this.params.status, 100) },
  data: function () { return Changes.find({}) }
});

Router.route('/change/:_id', {
  name: 'changes.show',
  waitOn: function() { return Meteor.subscribe('change', this.params._id) },
  data: function () { return Changes.findOne({_id: this.params._id}) }
});

Router.route('/change/:_id/edit', {
  name: 'changes.edit',
  waitOn: function() { return Meteor.subscribe('change', this.params._id) },
  data: function () { return Changes.findOne({_id: this.params._id}) }
});



// (Global) Before hooks for any route

Router.onBeforeAction(function(pause) {

  if (!Meteor.loggingIn() && !Meteor.user()) {
    this.render('signIn');
  } else {
    this.next();
  }

});
