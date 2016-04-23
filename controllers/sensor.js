'use strict';

var SensorModel = require('../models/sensor');
var Sensor = function() {};
var sensor = new Sensor();
var uuid = require('node-uuid');

module.exports.route = function(app) {
  app.get('/sensors', sensor.getSensors);
  app.get('/sensor/:id', sensor.getSensorPerId);
  app.get('/sensors/types', sensor.getSensorTypes);
  app.put('/sensor/register', sensor.registerSensor);
  app.put('/sensor/:type/:id/update', sensor.updateSensor);
};

/*
 * controller
 */
Sensor.prototype.getSensorTypes = function(req, res, next) {
  var sensorModel = new SensorModel();
  sensorModel.sensorsType(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(500, error);
  });
  return next();
};

Sensor.prototype.getSensors = function(req, res, next) {
  var sensorModel = new SensorModel();
  sensorModel.sensors(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(500, error);
  });
  return next();
};

Sensor.prototype.getSensorPerId = function(req, res, next) {
  var sensorModel = new SensorModel();
  sensorModel.sensorPerId(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(500, error);
  });
  return next();
};

Sensor.prototype.registerSensor = function(req, res, next) {
  var sensorModel = new SensorModel();
  var data = JSON.parse(req.body);
  data.id = uuid.v4();
  console.log(data);
  sensorModel.sensorRegister(data, function(result) {
    sensorModel.sensorDetailRegister(data, function(result) {
      res.send({id: data.id});
    }, function(err) {
      res.send(500, {
        result: false,
        code: 500,
        message: err
      });
    });
  }, function(err) {
    res.send(500, {
      result: false,
      code: 500,
      message: err
    });
  });

  return next();
};

Sensor.prototype.updateSensor = function(req, res, next) {
  var params = JSON.parse(req.body);
  params.id = req.params.id;
  var func = getUpdateFunc(parseInt(req.params.type, 10));
  func(JSON.parse(req.body), function(result) {
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

/**
 * Helper function get correct update function based on sensor type
 */
//1. water
//2. light
//3. speed
//4. voice
function getUpdateFunc(type) {
  var sensorModel = new SensorModel();
  if (type === 1) {
    return sensorModel.waterSensorUpdate;
  } else if (type === 4) {
    return sensorModel.voiceSensorUpdate;
  } else  if (type === 3) {
    return sensorModel.speedSensorUpdate;
  } else {
    return sensorModel.lightSensorUpdate;
  }
}

