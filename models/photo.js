/**
 * Photo model
 */

'use strict';

var util = require('util');
var Model = require('./base');

var PhotoModel = function() {};
util.inherits(PhotoModel, Model);

PhotoModel.prototype.photosPerTree = function(params, success, fail) {
  console.log('>>>>>>> Get photos in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT * FROM Photos WHERE treeId=:treeId');
  db.query(sql({treeId: params.treeId}))
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

PhotoModel.prototype.registerPhoto = function(params, success, fail) {
  console.log('>>>>>>> Add photos in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('INSERT INTO Photos (filename, treeId) VALUES (:filename, :treeId)');
  db.query(sql({filename: params.filename, treeId: params.treeId}))
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

PhotoModel.prototype.updatePhoto = function(params, success, fail) {
  console.log('>>>>>>> Add sharecount photos in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('UPDATE Photos SET shareCount=:shareCount WHERE id=:id');
  db.query(sql({shareCount: params.shareCount, id: params.id}))
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

module.exports = PhotoModel;
