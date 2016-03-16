var UserModel = require('../models/user');
var User = function() {};
var user = new User();

console.log(UserModel);

module.exports.route = function(app) {
  app.get('/users', user.getUsers);
  app.get('/user/:id', user.getUser);
};

/*
 * controller
 */
User.prototype.getUsers = function(req, res, next) {
  var userModel = new UserModel();
  userModel.users(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(400, error);
  });

  return next();
};

User.prototype.getUser = function(req, res, next) {
  var userModel = new UserModel();
  userModel.user(req.params, function(result) {
    if ((!result) || (Object.getOwnPropertyNames(result).length === 0)) {
      res.send(404, {
        result: false,
        code: 404,
        message: 'Not Found'
      });
    } else {
      res.send(result);
    }
  }, function(error) {
    res.send(500, {
      result: false,
      code: 500,
      message: 'Internal server error'
    });
  });

  return next();
};
