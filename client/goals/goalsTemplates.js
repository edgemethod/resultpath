
Template._goalsCard.rendered = function() {
  $('.dropdown').dropdown();
};

Template._goalsCard.events({
  'click [data-action=add-result]': function (event, template) {
    event.preventDefault();

    //console.log(this);
    $value = $(event.target).parents('.menu').find('input.value');
    $description = $(event.target).parents('.menu').find('input.description');


    if ($value.val() &&  Number($value.val()) && $description.val()) {
      Meteor.call('Changes.addResult', Router.current().params._id, 'goals.' + this.index + '.results', $description.val(), Number($value.val()), function(error, result) {
        $value.val('');
        $description.val('');
        $(event.target).parents('.dropdown').dropdown('hide');
      });
    }

  },
  'click [data-set-status]': function (event, template) {
    event.preventDefault();

    $statusItem = $(event.target);

    if ($statusItem.attr('data-set-status')) {

      var data = {}; data['goals.' + this.index + '.status'] = $statusItem.attr('data-set-status');

        Changes.update({ _id: Router.current().params._id}, {
          $set: data
        }, {}, function() {

        });

    }
  },


});

Template._add_goal.events({
  'click [data-action=add-goal]': function (event, template) {
    event.preventDefault();


    //console.log(this);
    $value = $(event.target).parents('.input').find('input');

    if ($value.val()) {

      console.log($value.val());


        Changes.update({ _id: Router.current().params._id}, {
          $addToSet: {goals: {title: $value.val(), createdAt: new Date}}
        }, {}, function(error, result) {
          console.log(error);
          console.log(result);
          $value.val('');
          $(event.target).parents('.dropdown').dropdown('hide');

        });

    }

  },


});

Template._goalsCard.helpers({
  me: function() {
    return Meteor.user();
  },
  resultsCount: function() {
    if (this.results && this.results.length > 0) return this.results.length;
    else return 'No'
  },
});
