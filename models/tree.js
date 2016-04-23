/**
 *  Tree model with smart tree table info as below
 *  CREATE TABLE `SmartTrees` (
  `id` varchar(36) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `longitude` float NOT NULL,
  `latitude` float NOT NULL,
  `youtubeId` varchar(20) NOT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 *
 * CREATE TABLE `SmartTrees_Sensors` (
  `treeId` varchar(36) NOT NULL,
  `sensorId` varchar(36) NOT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`treeId`,`sensorId`),
  UNIQUE KEY `sensorId` (`sensorId`),
  CONSTRAINT `SmartTrees_Sensors_ibfk_1` FOREIGN KEY (`treeId`) REFERENCES `SmartTrees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SmartTrees_Sensors_ibfk_2` FOREIGN KEY (`sensorId`) REFERENCES `Sensors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 */

'use strict';

var util = require('util');
var Model = require('./base');
var uuid = require('node-uuid');

var TreeModel = function() {};
util.inherits(TreeModel, Model);

//Get all trees available in DB
TreeModel.prototype.trees = function(params, success, fail) {
  console.log('>>>>>>> Get trees in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT * from SmartTrees');
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

//Eg: select SmartTrees.*, count(distinct (Comments.id)) AS likecount, count(distinct (SmartTrees_Sensors.sensorId)) AS sensorCount from SmartTrees LEFT JOIN SmartTrees_Sensors ON SmartTrees.id = SmartTrees_Sensors.treeId LEFT JOIN Comments ON Comments.treeId = SmartTrees.id WHERE SmartTrees.id='45304c60-9eac-48bf-9d0b-c02dda6c6cb3' AND Comments.islike=true
TreeModel.prototype.treeDetail = function(params, success, fail) {
  console.log('>>>>>>> Get tree details in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('select SmartTrees.*, count(distinct (Comments.id)) AS likecount, count(distinct (SmartTrees_Sensors.sensorId)) AS sensorCount from SmartTrees LEFT JOIN SmartTrees_Sensors ON SmartTrees.id = SmartTrees_Sensors.treeId LEFT JOIN Comments ON Comments.treeId = SmartTrees.id WHERE SmartTrees.id=:treeId AND Comments.islike=true');
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

//Getting tree sensor type
//eg: select SmartTrees_Sensors.treeId, Sensors.* from SmartTrees_Sensors LEFT JOIN Sensors ON SmartTrees_Sensors.sensorId = Sensors.id WHERE SmartTrees_Sensors.treeId='45304c60-9eac-48bf-9d0b-c02dda6c6cb3'
TreeModel.prototype.treeSensors = function(params, success, fail) {
  console.log('>>>>>>> Get tree sensors tie in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('select SmartTrees_Sensors.treeId, Sensors.* from SmartTrees_Sensors LEFT JOIN Sensors ON SmartTrees_Sensors.sensorId = Sensors.id WHERE SmartTrees_Sensors.treeId=:treeId');
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

//select SmartTrees_Sensors.sensorId, WaterSensor.wateron, WaterSensor.watertemp from SmartTrees_Sensors LEFT JOIN WaterSensor ON WaterSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId='45304c60-9eac-48bf-9d0b-c02dda6c6cb3'
TreeModel.prototype.treeWaterSensors = function(params, success, fail) {
  console.log('>>>>>>> Get tree water sensors in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('select SmartTrees_Sensors.sensorId, WaterSensor.wateron, WaterSensor.watertemp from SmartTrees_Sensors LEFT JOIN WaterSensor ON WaterSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId=:treeId');
  console.log(sql({treeId: params.treeId}));
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

TreeModel.prototype.treeSpeedSensors = function(params, success, fail) {
  console.log('>>>>>>> Get speed sensors in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('select SmartTrees_Sensors.sensorId, SpeedSensor.speedon, SpeedSensor.speedlimit from SmartTrees_Sensors JOIN SpeedSensor ON SpeedSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId=:treeId');
  console.log(sql({treeId: params.treeId}));
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

//select SmartTrees_Sensors.sensorId, LightSensor.lighton, LightSensor.lightcolor from SmartTrees_Sensors JOIN LightSensor ON LightSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId='45304c60-9eac-48bf-9d0b-c02dda6c6cb3'
TreeModel.prototype.treeLightSensors = function(params, success, fail) {
  console.log('>>>>>>> Get tree light sensors in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('select SmartTrees_Sensors.sensorId, LightSensor.lighton, LightSensor.lightcolor from SmartTrees_Sensors JOIN LightSensor ON LightSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId=:treeId');
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

TreeModel.prototype.treeVoiceSensors = function(params, success, fail) {
  console.log('>>>>>>> Get tree voice sensors in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('select SmartTrees_Sensors.sensorId, VoiceSensor.voiceon, VoiceSensor.volume from SmartTrees_Sensors JOIN VoiceSensor ON VoiceSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId=:treeId');
  //console.log(sql({treeId: params.treeId}));
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

//Deploy created sensor to tree
TreeModel.prototype.treeAddSensor = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('INSERT INTO SmartTrees_Sensors (treeId, sensorId) VALUES (:treeId, :sensorId)');
  db.query(sql({sensorId: params.sensorId, treeId: params.treeId}))
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

//DELETE FROM SmartTrees_Sensors where treeId='8f14886c-d267-44b8-8518-8cf363634929'
TreeModel.prototype.treeDelSensor = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('DELETE FROM SmartTrees_Sensors where treeId=:treeId AND sensorId=:sensorId');
  db.query(sql({sensorId: params.sensorId, treeId: params.treeId}))
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

//Adding new tree
TreeModel.prototype.treeRegister = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('INSERT INTO SmartTrees (id, title, description, address, longitude, latitude, youtubeId) VALUES (:id, :title, :description, :address, :longitude, :latitude, :youtubeId)');
  var sqlQuery = sql({id: params.id, title: params.title, description: params.description, address: params.address, longitude: params.longitude, latitude: params.latitude, youtubeId: params.youtubeId});
  console.log(sqlQuery);
  db.query(sqlQuery)
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

module.exports = TreeModel;
