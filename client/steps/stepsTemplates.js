
Template._stepsCard.rendered = function() {
  $('.dropdown').dropdown();
};

Template._stepsCard.events({
  'click [data-set-status]': function (event, template) {
    event.preventDefault();

    $statusItem = $(event.target);

    if ($statusItem.attr('data-set-status')) {

      var data = {}; data['steps.' + this.index + '.status'] = $statusItem.attr('data-set-status');

        Changes.update({ _id: Router.current().params._id}, {
          $set: data
        }, {}, function() {

          setTimeout(function() {
            Template._stepsCard.rendered();
          },1000)

        });

    }
  },

  'click [data-action=set-estimated-hours]': function (event, template) {
    event.preventDefault();

    $value = $(event.target).parents('.input').find('input');

    if ($value.val() &&  Number($value.val()) ) {

      var data = {}; data['steps.' + this.index + '.estimatedHours'] = Number($value.val());

        Changes.update({ _id: Router.current().params._id}, {
          $set: data
        }, {}, function() {
          $value.val('');
          $(event.target).parents('.dropdown').dropdown('hide');
        });

    }
  },
  'click [data-action=show-log]': function (event, template) {
    Session.set("showLog", this._id)


  },
  'click [data-action=hide-log]': function (event, template) {
    Session.set("showLog", null)
  },
  'click .log-activity': function (event, template) {
    var $modal = $('.add-activity-modal');
    var $index = this.index;

    $(".add-activity-modal").modal({
      detachable: false,
      onApprove: function() {

        $value = $modal.find('input[name="value"]');
        $description = $modal.find('input[name="description"]');



        if ($value.val() &&  Number($value.val()) && $description.val()) {


          Meteor.call('Changes.addResult', Router.current().params._id, 'steps.' + $index + '.activities', $description.val(), Number($value.val()), function(error, result) {

            $value.val('');
            $description.val('');
          });
        } else {
          return false
        }


      }
    }).modal('show')

  }

});

Template._add_step.events({

  'click [data-action=add-step]': function (event, template) {
    event.preventDefault();

    $value = $(event.target).parents('.input').find('input');

    if ($value.val()) {

        Changes.update({ _id: Router.current().params._id}, {
          $addToSet: {steps: {title: $value.val()}}
        }, {}, function() {

          $value.val('');
          $(event.target).parents('.dropdown').dropdown('hide');

        });

    }

  },


});

Template._stepsCard.helpers({
  me: function() {
    return Meteor.user();
  },
  totalHours: function() {
    var hours = _.reduce(this.activities, function(memo, h){ return memo + Number(h.value); }, 0);
    if (hours > 0) return ' ' + hours + 'h in ';
    else return ''
  },
  activityCount: function() {
    if (this.activities && this.activities.length > 0) return this.activities.length;
    else return "No"
  },
  statusIsNot: function(compareTo) {
    return (this.status != compareTo)
  },
  showLog: function() {
    return (Session.get('showLog') == this._id || this.status != 'complete')
  },
  statusColor: function() {
    switch(this.status) {
      case 'unassigned':
        return 'basic';
          break;
      case 'in-progress':
        return 'blue';
          break;
      case 'started':
        return 'blue';
          break;
      case 'complete':
        return 'green'
          break;
      default:
        return 'grey'
    }
  }
});

Template.afObjectField_steps.helpers({
  title: function() {
    return this.name + ".title"
  },
  description: function() {
    return this.name + ".description"
  },
  estimatedHours: function() {
    return this.name + ".estimatedHours"
  },
  assignedTo: function() {
    return this.name + ".assignedTo"
  },
  activities: function() {
    return this.name + ".activities"
  }
});


Template.afObjectField_results.helpers({
  value: function() {
    return this.name + ".value"
  },
  description: function() {
    return this.name + ".description"
  },
  userId: function() {
    return this.name + ".userId"
  },
  createdAt: function() {
    return this.name + ".createdAt"
  }
});