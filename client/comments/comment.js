Template._comment.helpers({
  author: function () {
    return Meteor.users.findOne({_id: this.userId});
  },
  firstOne: function() {
    return this.index == 0;
  },
  alreadyLiked: function() {
    return _(this.likerIds).include(Meteor.userId())
  }
});


Template.changesShow.events({
  'click [data-action=post-comment]': function (event, template) {
    $body = $("#comment-body");

    if ($body.val()) {
      Meteor.call('Changes.addComment', Router.current().params._id, '', $body.val(), function(error, result) {
        $body.val('');
      });
    }

  }
});

Template.changesShow.events({
  'click [data-action=like]': function (event, template) {

    Meteor.call('Changes.likeComment', Router.current().params._id, this.index, function(error, result) {

    });

  }

});

Template.changesShow.events({
  'click [data-action=unlike]': function (event, template) {

    Meteor.call('Changes.unlikeComment', Router.current().params._id, this.index, function(error, result) {

    });

  }

});