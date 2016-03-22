/**
 * Comment model
 */

var util = require('util');
var Model = require('./base');

var CommentModel = function() {};
util.inherits(CommentModel, Model);

CommentModel.prototype.comments = function(params, success, fail) {
  console.log('>>>>>>> Get comments in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT Comments.comment, Comments.rating, Users.userName FROM Comments INNER JOIN Users ON Comments.userId = Users.userId');

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

CommentModel.prototype.add = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  console.log(params);
  var sql = db.prepare('INSERT INTO Comments (userId, comment, rating) VALUES (:userId, :comment, :rating)');
  db.query(sql({userId: params.userId, comment: params.comment, rating: params.rating }))
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

module.exports = CommentModel;
