AppController = RouteController.extend({
  layoutTemplate: 'appLayout'
});

// Actions
ChangesNewController = AppController.extend({});
ChangesShowController = AppController.extend({});
ChangesEditController = AppController.extend({});

ChangesController = AppController.extend({
  template: 'changes'
});
