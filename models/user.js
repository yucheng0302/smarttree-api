/**
 * User model
 */

var util = require('util');
var Model = require('./base');
var uuid = require('node-uuid');

var UserModel = function() {};
util.inherits(UserModel, Model);

UserModel.prototype.users = function(params, success, fail) {
  console.log('>>>>>>> Get users in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT * FROM Users');

  db.query(sql())
    .on('result', function(res) {
      res.on('data', function onRow(row) {
        logger.debug({ 'row': row });
        self.addResult(row);
      })
      .on('error', self.queryError.bind(self))
      .on('end', self.queryEnd.bind(self));
    })
    .on('error', self.resultError.bind(self))
    .on('end', self.resultEnd.bind(self));

  db.end();
};

UserModel.prototype.user = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT * FROM Users WHERE userId = :id');
  //console.log(params.id);
  db.query(sql({ id: params.id }))
    .on('result', function(res) {
      res.on('data', function onRow(row) {
        logger.debug({ 'row': row });
        self.setResult(row);
      })
      .on('error', self.queryError.bind(self))
      .on('end', self.queryEnd.bind(self));
    })
    .on('error', self.resultError.bind(self))
    .on('end', self.resultEnd.bind(self));

  db.end();
};

UserModel.prototype.userByEmail = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT * FROM Users WHERE email = :email AND password= :password');
  db.query(sql({ email: params.email, password: params.password }))
    .on('result', function(res) {
      res.on('data', function onRow(row) {
        logger.debug({ 'row': row });
        self.setResult(row);
      })
      .on('error', self.queryError.bind(self))
      .on('end', self.queryEnd.bind(self));
    })
    .on('error', self.resultError.bind(self))
    .on('end', self.resultEnd.bind(self));

  db.end();
};

UserModel.prototype.userRegister = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  //console.log(params);
  var sql = db.prepare('INSERT INTO Users (userId, email, userName, phoneNum, password) VALUES (:userId, :email, :userName, :phoneNum, :password)');
  db.query(sql({userId: params.userId, email: params.email, userName: params.userName, phoneNum: params.phoneNum, password: params.password }))
    .on('result', function(res) {
      res.on('data', function onRow(row) {
        logger.debug({ 'row': row });
        self.setResult(row);
      })
      .on('error', self.queryError.bind(self))
      .on('end', self.queryEnd.bind(self));
    })
    .on('error', self.resultError.bind(self))
    .on('end', self.resultEnd.bind(self));

  db.end();
};

module.exports = UserModel;
