/**
 * User model
 */

var util = require('util');
var Model = require('./base');

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

  db.query(sql({ id: params.id }))
    .on('result', function(res) {
      res.on('row', function onRow(row) {
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
