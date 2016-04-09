/**
 * Sensor model
 */

'use strict';

var util = require('util');
var Model = require('./base');

var SensorModel = function() {};
util.inherits(SensorModel, Model);

SensorModel.prototype.sensors = function(params, success, fail) {
  console.log('>>>>>>> Get sensors in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT * FROM Sensors');

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

SensorModel.prototype.sensorAddTree =  function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('UPDATE Sensors SET treeId=:treeId WHERE id=:id');
  db.query(sql({treeId: params.treeId, id: params.id }))
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

SensorModel.prototype.sensorUpdate =  function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('UPDATE Sensors SET lighton=:lighton,lightcolor=:lightcolor WHERE id=:id');
  db.query(sql({lighton: params.lighton, lightcolor: params.lightcolor }))
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

SensorModel.prototype.sensorRegister = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('INSERT INTO Sensors (name, lighton, lightcolor) VALUES (:name, :lighton, :lightcolor)');
  db.query(sql({name: params.name, lighton: params.lighton, lightcolor: params.lightcolor }))
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

module.exports = SensorModel;
