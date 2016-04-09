'use strict';

var UserModel = require('../models/user');
var uuid = require('node-uuid');
var passwordHash = require('password-hash');

var User = function() {};
var user = new User();

module.exports.route = function(app) {
  app.get('/users', user.getUsers);
  app.get('/users/all', user.getUsers);
  app.get('/user/:id', user.getUser);
  app.post('/user/login', user.getUserByEmail);
  app.put('/user/register', user.registerUser);
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

User.prototype.getUserByEmail = function(req, res, next) {
  var userModel = new UserModel(),
      reqBody = JSON.parse(req.body);
  userModel.userByEmail(reqBody, function(result) {
    if ((!result) || (Object.getOwnPropertyNames(result).length === 0)) {
      res.send(404, {
        result: false,
        code: 404,
        message: 'Not Found'
      });
    } else {
      console.log(result);
      if (passwordHash.verify(reqBody.password, result.password)) {
        res.send(result);
      } else {
        res.send(404, {
          result: false,
          code: 404,
          message: 'Not Found'
        });
      }
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

User.prototype.registerUser = function(req, res, next) {
  var userModel = new UserModel();
  var data = JSON.parse(req.body);
  data.userId = uuid.v4();
  data.password = passwordHash.generate(data.password);
  //console.log(data);
  userModel.userRegister(data, function(result) {
    res.send({userId: data.userId});
  }, function(error) {
    res.send(500, {
      result: false,
      code: 500,
      message: 'Internal server error'
    });
  });

  return next();
};
