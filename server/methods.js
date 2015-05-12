Meteor.methods({
  'Changes.likeComment': function (_id, commentIndex) {
    if (!Meteor.user()) {
      return;
    }

    var change = Changes.findOne({"_id" : _id});

    if (_(change.comments[commentIndex].likerIds).include(Meteor.userId())) {
      return;
    }

    var likerIds = "comments." + commentIndex + ".likerIds";
    var numberOfLikes = "comments." + commentIndex + ".numberOfLikes";
    var insertQuery = {'$inc': {}, '$addToSet': {}};
        insertQuery['$inc'][numberOfLikes] = 1;
        insertQuery['$addToSet'][likerIds] = Meteor.userId();

    Changes.update({_id: _id}, insertQuery);
    return true;


  },
  'Changes.unlikeComment': function (_id, commentIndex) {
    if (!Meteor.user()) {
      return;
    }

    var change = Changes.findOne({"_id" : _id});

    if (!_(change.comments[commentIndex].likerIds).include(Meteor.userId())) {
      return;
    }

    var likerIds = "comments." + commentIndex + ".likerIds";
    var numberOfLikes = "comments." + commentIndex + ".numberOfLikes";
    var pullQuery = {'$inc': {}, '$pull': {}};
        pullQuery['$inc'][numberOfLikes] = -1;
        pullQuery['$pull'][likerIds] = Meteor.userId();

    Changes.update({_id: _id}, pullQuery);
    return true;


  },
  'Changes.addComment': function (_id, arrayIndex, commentBody) {
    var change = Changes.findOne(_id);

    // stop if not logged in, or this user isn't a member of the change

    if (!Meteor.user()) {
      return 'denied';
    }

    var theComment = {
      body: commentBody,
      userId: Meteor.userId(),
      createdAt: new Date()

    };


    if (theComment.body) {
      var data = {};
      if (arrayIndex) colIndex = arrayIndex + ".comments";
      else colIndex = "comments";

      data[colIndex] = theComment;

      Changes.update({ _id: _id}, {
        $addToSet: data
      }, {});

    }

  },

  'Changes.addResult': function (_id, arrayIndex, description, value) {

    check([arrayIndex, _id, description], [String]);
    check(value, Number);

    var change = Changes.findOne(_id);

    // stop if not logged in, or this user isn't a member of the change

    if (!Meteor.user()) {
      return 'denied';
    }

    var theResult = {
      value: value,
      description: description,
      userId: Meteor.userId(),
      createdAt: new Date()
    };


    if (theResult.value) {
      var data = {};
      data[arrayIndex] = theResult;

      Changes.update({ _id: _id}, {
        $addToSet: data
      }, {});
    }

  }



});
