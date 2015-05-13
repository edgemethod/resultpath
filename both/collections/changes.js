var Collections = {};

ResultsSchema = new SimpleSchema({
  description: {
    type: String,
    autoform: {
      label: "Description / Notes",
      placeholder: 'i.e. activity, time period, caveats, etc'
    },
    max: 255
  },
  value: {
    type: String,
    optional: true,
    autoform: {
      label: "Value ",
      placeholder: 'Numeric'

    }
  },
  userId: {
    type: String,
    autoform: {
      label: false,
      afFieldInput: {
        type: "hidden"
      }
    },
    autoValue: function () {
      if (this.isSet) {
        return;
      }
      if (this.isInsert) {
        return Meteor.userId();
      } else {
        this.unset();
      }
    }
  },
  createdAt: {
    type: Date,
    autoform: {
      label: false,
      afFieldInput: {
        type: "hidden"
      }
    }
  }
});


GoalsSchema = new SimpleSchema({
  title: {
    type: String,
    autoform: {
      label: "Goal",
      placeholder: 'i.e. some measurable objective'
    },
    max: 255
  },
  description: {
    optional: true,
    type: String,
    autoform: {
      label: "Description ",
      placeholder: '... further explaination'
    },
    max: 255
  },
  chartable: {
    optional: true,
    type: Boolean,
    autoform: {
      label: "Chartable ",
      placeholder: 'Check this if a meaningful chart could be created from result values'
    }
  },
  userId: {
    type: String,
    //autoform: { type: "hidden" },
    autoform: {
      label: false,
      afFieldInput: {
        type: "hidden",
      }
    },
    autoValue: function () {
      if (this.isSet) {
        return;
      } else {
        return Meteor.userId();
      }
    }
  },
  createdAt: {
    type: Date,
    autoform: {
      label: false,
      afFieldInput: {
        type: "hidden"
      }
    }

  },
  results: {
    optional: true,
    type: [ResultsSchema],
    defaultValue: [],

  }
});


StepsSchema = new SimpleSchema({

  _id: {
    type: String,
    autoValue: function () {
      if (this.isSet) {
        return;
      }
      if (this.isInsert || !this.isSet) {
        return Random.id();
      } else {
        this.unset();
      }
    },
    autoform: {
      label: false,
      afFieldInput: {
        type: "hidden",
      }
    }
  },
  title: {
    type: String,
    autoform: {

    },
    max: 255
  },
  status: {

    type: String,
    autoValue: function () {
      if (this.isSet) {
        return;
      } else {
        return 'unassigned'
      }
    },
    autoform: {

    },
    max: 255
  },

  description: {
    type: String,
    optional: true,
    autoform: {
      type: "textarea"
    }
  },

  userId: {
    type: String,
    //autoform: { type: "hidden" },

    autoValue: function () {
      if (this.isSet) {
        return;
      } else {
        return Meteor.userId();
      }
    },
    autoform: {
      label: false,
      afFieldInput: {
        type: "hidden"
      }
    }

  },
  assignedTo: {
    type: String,
    optional: true,
    autoform: {
      label: false,
      afFieldInput: {
        type: "hidden"
      }
    }
  },
  estimatedHours: {
    type: Number,
    optional: true
  },
  activities: {
    optional: true,
    type: [ResultsSchema],
    defaultValue: [],
    autoform: {
      //type: "hidden"
    }
  },
});


CommentsSchema = new SimpleSchema({
  body: {
    type: String,
    autoform: {
      label: false,
    }
  },
  userId: {
    type: String,
    autoform: {
      label: false,
      type: "hidden"
    }
  },
  /*
  image: {
    type: String,
    optional: true,
    autoform: {
      label: "Image",
      'label-type': 'placeholder',
      placeholder: 'Image File',
      class: "additional",
      type: "hidden",
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images'
      }
    }
  },*/
  numberOfLikes: {
    type: Number,
    optional: true,
    defaultValue: 0,
    autoform: {
      label: false,
      type: "hidden"
    }
  },
  likerIds: {
    optional: true,
    type: [String],
    defaultValue: [],
    autoform: {
      label: false,
      type: "hidden"
    }
  },
  createdAt: {
    type: Date,
    autoform: {
      label: false,
      type: "hidden"
    }
  }
});

Changes = new Mongo.Collection('Changes');

Changes.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
});


Changes.helpers({
  datePosted: function () {
    return moment(this.createdAt).format('M/D');
  },
  author: function () {
    return Meteor.users.findOne({_id: this.userId});
  },
  group: function () {
    return Groups.findOne({_id: this.groupId});
  },
  voters: function () {
    return Meteor.users.find({_id: {$in: this.voterIds}});
  },
  members: function () {
    return Meteor.users.find({_id: {$in: this.memberIds}});
  },
  ratedFactorsForOption: function (optionIndex) {
    var decision = this;
    return _.map(decision.factors, function(factor) {
      factorRatings = _.where(decision.options[optionIndex].ratings, {factorId: factor._id});
      sumTotal = _.reduce(factorRatings, function(memo, f){ return memo + f.value; }, 0)
      factor.average_rating = Math.round(sumTotal / factorRatings.length);
      return factor;
    });
  },
  weightedRatingForOption: function (optionIndex) {
      var thisRating = _.reduce(this.ratedFactorsForOption(optionIndex), function(memo, ratedFactor){
        return memo + ((ratedFactor.average_rating * ratedFactor.importance) / 100);
      }, 0);
      return Math.round(thisRating / this.factors.length );
  },
  imageObject: function () {
    return Images.findOne({_id: this.image});
  },
});

RegExp.escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

Changes.search = function(query, limit) {
  if (!query) {
    {}
  }
  return Changes.find({
    name: { $regex: RegExp.escape(query), $options: 'i' }
  }, {
    sort: {createdAt: -1}, limit: limit
  });
};

Changes.attachSchema(new SimpleSchema({
  url: {
    type: String,
    autoform: {
      placeholder: "The URL you're suggesting a change to"
    },
    max: 255
  },
  title: {
    type: String,
    label: "Title",
    autoform: {
      placeholder: 'Quick headline style summary of this idea'
    },
    max: 255
  },
  image: {
    type: String,
    optional: true,
    autoform: {
      label: "Image",
      'label-type': 'placeholder',
      placeholder: 'Image File',
      class: "additional",
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images'
      }
    }
  },

  details: {
    type: String,
    optional: true,
    autoform: {
      type: "textarea",
      placeholder: '...more info, reasons why this will help, evaluation criteria, etc.'
    },
  },
  userId: {
    type: String,
    autoform: { type: "hidden" },
    autoValue: function () {
      if (this.isSet) {
        return;
      }
      if (this.isInsert) {
        return Meteor.userId();
      } else {
        this.unset();
      }
    }
  },
  createdAt: {
    type: Date
  },
  steps: {
    type: [StepsSchema],
    defaultValue: [],
    optional: true,
    autoform: {
      label: false
    }
  },
  goals: {
    type: [GoalsSchema],
    defaultValue: [],
    optional: true,
    autoform: {
      label: false,
      afArrayField: {
        label: false

      }
    }
  },
  status: {
    type: String,
    autoValue: function () {
      if (this.isSet) {
        return;
      }
      if (this.isInsert) {
        return 'proposed'
      } else {
        this.unset();
      }
    },
    autoform: {
      placeholder: 'Status'
    },
    max: 255
  },
  comments: {
    optional: true,
    type: [CommentsSchema],
    defaultValue: [],
    autoform: {
      type: "hidden"
    }
  }
}));

Collections['changes'] = Changes;