

Meteor.methods({

  invite: function (address, _id) {

    check([address, _id], [String]);
    var change = Changes.findOne(_id);

    // only change members can do this
    if (!Meteor.user() || !_.contains(change.memberIds, Meteor.userId())) {
      return 'denied';
    }

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    var invite = Random.id(8)

    Changes.update({ _id: _id}, {
      $addToSet: {invites: invite}
    }, function() {


      // set reply address
      if (Meteor.user().profile && Meteor.user().profile.email) var reply = Meteor.user().profile.email;
      else var reply = "invites@resultpath.com";



      Email.send({
        to: address,
        from: "invites@userforge.com",
        "reply-to": reply,
        subject: "You're invited to collaborate on " + change.title,
        text: "Hello!\n\n" + Meteor.user().profile.name + " would like you to join as a collaborator for " + change.title + "!\n\n Sign-in takes less than 30 seconds, lets's get started:\nhttp://resultpath.com/change/" + change._id + "/" + invite
      });


    });


  }
});

Meteor.methods({
  accept: function (invite, _id) {

    check([invite, _id], [String]);
    var change = Changes.findOne(_id);

    //  change members can't do this, only Users who are not yet members
    if (!Meteor.user()) {
      return "You're not logged in.";
    }
    if (_.contains(change.memberIds, Meteor.userId())) {
      return "You're already a collaborator!";
    }

    // add member
    Changes.update({ _id: _id}, {
      $addToSet: {memberIds: Meteor.user()._id}
    });

    // remove invite
    Changes.update({ _id: _id}, { $pull: {invites: invite} });

    return 'Success';

  }
});

Meteor.methods({
  decline: function (invite, _id) {

    check([invite, _id], [String]);
    var change = Changes.findOne(_id);

    //  change members can't do this, only Users who are not yet members
    if (!Meteor.user()) {
      return "You're not logged in.";
    }
    if (_.contains(change.memberIds, Meteor.userId())) {
      return "You're already a collaborator!";
    }

    Changes.update({ _id: _id}, { $pull: {invites: invite}});

    return 'Success';

  }
});