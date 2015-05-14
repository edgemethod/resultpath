
Meteor.publishComposite('changes',  function(query, limit) {
  check(query, String);
  //Counts.publish(this, 'changes', Changes.find({memberIds: this.userId}), { noReady: true });

  return {
    find: function() {

      return Changes.find({
        status: { $regex: query, $options: 'i' }
      }, {
        sort: {createdAt: -1}, limit: limit
      });

    },
    children: [
      /*
      {
        find: function(change) {
          return Meteor.users.find({_id: { $in: change.memberIds }});
        }
      },*/
      {
        find: function(change) {
          return Images.find({_id: change.image});
        }
      }
    ]
  };
});

Meteor.publishComposite('change',  function(_id) {
  check(_id, String);
  //Counts.publish(this, 'changes', Changes.find({memberIds: this.userId}), { noReady: true });

  return {
    find: function() {
      return Changes.find({_id: _id});
    },
    children: [
      {
        find: function(change) {
          var interactorIds = [change.userId];
          interactorIds.concat( _.map(change.activities, function(result) {result.userId}) );
          interactorIds.concat( _.map(change.results, function(result) {result.userId}) );
          interactorIds.concat(_.map(change.comments, function(c) {c.userId}) );
          return Meteor.users.find({_id: { $in: interactorIds }});
        }
      },
      {
        find: function(change) {
          return Images.find({_id: change.image});
          //return Images.find({_id: {$in: _.map(change.image, function(o) {return o.image})}});
        }
      }
    ]
  };
});
