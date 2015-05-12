Template.changes.rendered = function() {
  $('.dropdown').dropdown();
};


Template.changes.helpers({
  title: 'Proposed'
});

Template.changesNew.helpers({
  title: 'Describe your idea'
});

Template.changesNew.rendered = function() {
  $('.accordion').accordion();
};

Template.changesShow.initUI = function() {
  $('.dropdown').dropdown();
  $('.menu.tabular .item')
    .tab()
  ;
};

Template.changesEdit.rendered = function() {
  Template.changesShow.initUI();
};

Template.changesShow.rendered = function() {
  Template.changesShow.initUI();
};


Template.changesShow.helpers({
  details: function() {
    if (this.details) return this.details.replace("\n", "<br/><br/>");
  }
});

Template._status_dropdown.helpers({
  "status": function() {
    return _(this.status).titlecase().replace("-", " ");
  }
});

Template.changesShow.events({
    'click [data-change-status]': function (event, template) {
    event.preventDefault();

    $statusItem = $(event.target);

    if ($statusItem.attr('data-change-status')) {

        Changes.update({ _id: Router.current().params._id}, {
          $set: {status:  $statusItem.attr('data-change-status') }
        }, {}, function() {

        });

    }
  }
});


Template.changes.helpers({
  status: function() {
    return _(Router.current().params.status).titlecase().replace("-", " ");
  }
});


AutoForm.hooks({
  changesEditForm: {
    onSuccess: function(formType, result) {
      Router.go('changes.show',  {_id: Router.current().params._id} );
    }
  },
  changesNewForm: {
    onSuccess: function(formType, result) {
      Router.go('changes.show',  {_id: result} );
    }
  }
});

