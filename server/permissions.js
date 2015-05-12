Changes.allow({
  'insert': function(userId, doc) {
    return userId;
  },
  'update': function(userId, doc, fields, modifier) {
    return userId;
    //return userId === doc.userId;
  },
  'remove': function(userId, doc) {
    return userId;

    //return userId === doc.userId;
  }
});

Images.allow({
  insert: function(userId, doc) {
    return true;
  },
  download: function(userId) {
    return true;
  }
});