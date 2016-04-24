/**
 * Sensor model (inheritance table design of sensor for extendability)
 * CREATE TABLE `Sensors` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `sensorType` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sensorType` (`sensorType`),
  CONSTRAINT `Sensors_ibfk_1` FOREIGN KEY (`sensorType`) REFERENCES `SensorType` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 */

'use strict';

var util = require('util');
var Model = require('./base');
var uuid = require('node-uuid');
var DB_Config = require('../lib/db_config');
console.log(DB_Config);

var SensorModel = function() {};
util.inherits(SensorModel, Model);

SensorModel.prototype.sensorsType = function(params, success, fail) {
  console.log('>>>>>>> Get sensors type in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT * FROM SensorType');
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

SensorModel.prototype.sensors = function(params, success, fail) {
  console.log('>>>>>>> Get sensors in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT Sensors.*, SmartTrees_Sensors.treeId FROM Sensors LEFT JOIN SmartTrees_Sensors ON Sensors.id = SmartTrees_Sensors.sensorId');
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

//Get sensor per tree
SensorModel.prototype.sensorsPerTree = function(params, success, fail) {
  console.log('>>>>>>> Get sensors per tree in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT SmartTrees_Sensors.sensorId, Sensors.* FROM SmartTrees_Sensors JOIN Sensors ON Sensors.id = SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId=:treeId');
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

//Get sensor details
//select SmartTrees_Sensors.treeId, Sensors.sensorType, Sensors.name, WaterSensor.*, VoiceSensor.*, SpeedSensor.*, LightSensor.* FROM Sensors LEFT JOIN SmartTrees_Sensors ON SmartTrees_Sensors.sensorId=Sensors.id LEFT JOIN WaterSensor ON Sensors.id=WaterSensor.id LEFT JOIN VoiceSensor ON Sensors.id=VoiceSensor.id LEFT JOIN LightSensor ON LightSensor.id=Sensors.id LEFT JOIN SpeedSensor ON Sensors.id=LightSensor.id WHERE Sensors.id='9311ea88-079e-11e6-b512-3e1d05defe78'
SensorModel.prototype.sensorPerId = function(params, success, fail) {
  console.log('>>>>>>> Get sensor per id in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('select SmartTrees_Sensors.treeId, Sensors.sensorType, Sensors.name, WaterSensor.*, VoiceSensor.*, SpeedSensor.*, LightSensor.* FROM Sensors LEFT JOIN SmartTrees_Sensors ON SmartTrees_Sensors.sensorId=Sensors.id LEFT JOIN WaterSensor ON Sensors.id=WaterSensor.id LEFT JOIN VoiceSensor ON Sensors.id=VoiceSensor.id LEFT JOIN LightSensor ON LightSensor.id=Sensors.id LEFT JOIN SpeedSensor ON Sensors.id=LightSensor.id WHERE Sensors.id=:id');
  db.query(sql({id: params.id}))
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

//Get sensor when already know sensorType
SensorModel.prototype.sensorPerIdType = function(params, success, fail) {
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var query = 'select SmartTrees_Sensors.treeId, Sensors.name, {typeSensor}.* FROM Sensors LEFT JOIN SmartTrees_Sensors ON SmartTrees_Sensors.sensorId=Sensors.id LEFT JOIN {typeSensor} ON Sensors.id={typeSensor}.id WHERE Sensors.id=:id';
  query = query.replace(/{typeSensor}/g, DB_Config.getTableSensor(params.type));
  console.log(query);
  var sql = db.prepare(query);
  db.query(sql({id: params.id}))
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

//eg: INSERT INTO Sensors (id, name, sensorType) VALUES ('9311ea88-079e-11e6-b512-3e1d05defe78', 'Sensor 1-1', 1)
SensorModel.prototype.sensorRegister = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('INSERT INTO Sensors (id, name, sensorType) VALUES (:id, :name, :type)');
  db.query(sql({name: params.name, id: params.id, type: params.type }))
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

//Register sensor detail into appropriate table
SensorModel.prototype.sensorDetailRegister = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('INSERT INTO ' + DB_Config.getTableSensor(params.type) + ' (id) VALUES (:id)');
  db.query(sql({id: params.id}))
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

SensorModel.prototype.waterSensorUpdate = function(params, success, fail) {
  executeQuery(this, {
    query: 'UPDATE WaterSensor SET wateron=:on, watertemp=:watertemp WHERE id=:id',
    obj: {on: params.on, watertemp: params.watertemp, id: params.id}
  }, success, fail);
};

SensorModel.prototype.lightSensorUpdate = function(params, success, fail) {
  executeQuery(this, {
    query: 'UPDATE LightSensor SET lighton=:on, lightcolor=:lightcolor WHERE id=:id',
    obj: {on: params.on, lightcolor: params.lightcolor, id: params.id}
  }, success, fail);
};

SensorModel.prototype.speedSensorUpdate = function(params, success, fail) {
  executeQuery(this, {
    query: 'UPDATE SpeedSensor SET speedon=:on, speedlimit=:speedlimit WHERE id=:id',
    obj: {on: params.on, speedlimit: params.speedlimit, id: params.id}
  }, success, fail);
};

SensorModel.prototype.voiceSensorUpdate = function(params, success, fail) {
   executeQuery(this, {
    query: 'UPDATE VoiceSensor SET voiceon=:on, volume=:volume WHERE id=:id',
    obj: {on: params.on, volume: params.volume, id: params.id}
  }, success, fail);
};

//Common function generate sql query and execute
function executeQuery(self, data, success, fail) {
  //var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare(data.query);
  db.query(sql(data.obj))
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
}

module.exports = SensorModel;
