Meteor.startup(function() {

  //Meteor.users.remove('MpwLQgW93mTN4BPdo');


  ServiceConfiguration.configurations.remove({
      service: 'google'
  });

  ServiceConfiguration.configurations.insert({
      service: 'google',
      clientId: Meteor.settings['google'].clientId,
      secret: Meteor.settings['google'].secret
  });

});

Accounts.onCreateUser(function(options, user) {
  console.log(user);

  if (user.services['google']) {
    user.emails = [user.services['google'].email];
    var picture = user.services['google'].picture;
    var given_name = user.services['google'].given_name;
    var family_name = user.services['google'].family_name;

  }
  //if (user.services['google']) user.emails = user.services['google'].emails;
  user.profile = options.profile;
  if (picture) user.profile.picture = picture;
  if (given_name) user.profile.given_name = given_name;
  if (family_name) user.profile.family_name = family_name;
  return user;
});
