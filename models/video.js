/**
 * Video model
 */

'use strict';

var util = require('util');
var Model = require('./base');

var VideoModel = function() {};
util.inherits(VideoModel, Model);

VideoModel.prototype.videosPerTree = function(params, success, fail) {
  console.log('>>>>>>> Get videos in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT * FROM Videos WHERE treeId=:treeId');
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

VideoModel.prototype.registerVideo = function(params, success, fail) {
  console.log('>>>>>>> Add videos in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('INSERT INTO Videos (fielname, treeId) VALUES (:filename, :treeId)');
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

VideoModel.prototype.updateVideo = function(params, success, fail) {
  console.log('>>>>>>> Add sharecount videos in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('UPDATE Videos SET shareCount=:shareCount WHERE id=:id');
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

module.exports = VideoModel;
