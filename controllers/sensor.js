'use strict';

var SensorModel = require('../models/sensor');
var Sensor = function() {};
var sensor = new Sensor();

module.exports.route = function(app) {
  app.get('/sensors', sensor.getSensors);
  app.put('/sensor/register', sensor.registerSensor);
  app.put('/sensor/update', sensor.updateSensor);
};

/*
 * controller
 */
Sensor.prototype.getSensors = function(req, res, next) {
  var sensorModel = new SensorModel();
  sensorModel.sensors(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(400, error);
  });

  return next();
};

Sensor.prototype.registerSensor = function(req, res, next) {
  var sensorModel = new SensorModel();
  sensorModel.sensorRegister(JSON.parse(req.body), function(result) {
    res.send(200);
  }, function(error) {
    res.send(500, {
      result: false,
      code: 500,
      message: 'Internal server error'
    });
  });

  return next();
};

Sensor.prototype.updateSensor = function(req, res, next) {
  var sensorModel = new SensorModel();
  sensorModel.sensorUpdate(JSON.parse(req.body), function(result) {
    res.send(200);
  }, function(error) {
    res.send(500, {
      result: false,
      code: 500,
      message: 'Internal server error'
    });
  });

  return next();
};
