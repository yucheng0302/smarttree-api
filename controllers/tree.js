'use strict';

var SmartTreesModel = require('../models/tree');
var uuid = require('node-uuid');
var Q = require('q');

var Tree = function() {};
var tree = new Tree();

module.exports.route = function(app) {
  app.get('/trees', tree.getTrees);
  app.get('/tree/:treeId', tree.getTreeDetail);
  app.get('/tree/:treeId/sensors', tree.getTreeSensors);
  app.put('/tree/register', tree.registerTree);
  app.put('/tree/:treeId/sensor', tree.addSensor);
};

/*
 * controller
 */
Tree.prototype.getTrees = function(req, res, next) {
  var treeModel = new SmartTreesModel();
  treeModel.trees(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(500, error);
  });

  return next();
};

Tree.prototype.getTreeDetail = function(req, res, next) {
  var treeModel = new SmartTreesModel();
  treeModel.treeDetail(req.params, function(result) {
    res.send(result);
  }, function(err) {
    res.send(500, err);
  });

  return next();
};

//Helper function resolve promise for getting sensors detail per type
function waterSensors(params) {
  var d = Q.defer();
  var treeModel = new SmartTreesModel();
  treeModel.treeWaterSensors(params, function(result) {
    d.resolve(result);
  }, function(err) {
    d.reject(err);
  });
  return d.promise;
}

function speedSensors(params) {
  var d = Q.defer();
  var treeModel = new SmartTreesModel();
  treeModel.treeSpeedSensors(params, function(result) {
    d.resolve(result);
  }, function(err) {
    d.reject(err);
  });
  return d.promise;
}

function lightSensors(params) {
  var d = Q.defer();
  var treeModel = new SmartTreesModel();
  treeModel.treeLightSensors(params, function(result) {
    d.resolve(result);
  }, function(err) {
    d.reject(err);
  });
  return d.promise;
}

function voiceSensors(params) {
  var d = Q.defer();
  var treeModel = new SmartTreesModel();
  treeModel.treeVoiceSensors(params, function(result) {
    d.resolve(result);
  }, function(err) {
    d.reject(err);
  });
  return d.promise;
}

Tree.prototype.getTreeSensors = function(req, res, next) {
  console.log('>>>> Get tree sensors detail <<<<<');
  Q.all([
    waterSensors(req.params),
    speedSensors(req.params),
    lightSensors(req.params),
    voiceSensors(req.params)
  ]).then(
    function(result) {
      var data = {
        water_sensor: result[0] || [],
        speed_sensor: result[1] || [],
        light_sensor: result[2] || [],
        voice_sensor: result[3] || []
      };
      //console.log(data);
      res.send(data);
    },
    function (err) {
      res.send(500, err);
    }
  );
  return next();
};

//Adding sensors per treeId
//{sensorId: params.sensorId}
Tree.prototype.addSensor = function(req, res, next) {
  var treeModel = new SmartTreesModel();
  var data = req.body;
  treeModel.treeAddSensor(data, function(result) {
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

//Register tree
//Request body as following
/**
 * {id: params.id, title: params.title, description: params.description, address: params.address, longitude: params.longitude, latitude: params.latitude, youtubeId: params.youtubeId}
 */
Tree.prototype.registerTree = function(req, res, next) {
  var treeModel = new SmartTreesModel();
  var data = req.body;
  data.id = uuid.v4();
  treeModel.treeRegister(data, function(result) {
    res.send({id: data.id});
  }, function(error) {
    res.send(500, {
      result: false,
      code: 500,
      message: 'Internal server error'
    });
  });

  return next();
};
