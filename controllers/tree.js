'use strict';

var SmartTreesModel = require('../models/tree');
var uuid = require('node-uuid');

var Tree = function() {};
var tree = new Tree();

module.exports.route = function(app) {
  app.get('/trees', tree.getTrees);
  app.put('/tree/register', tree.registerTree);
  app.put('/tree/addsensor', tree.addSensor);
  app.put('/tree/like', tree.updateLike);
};

/*
 * controller
 */
Tree.prototype.getTrees = function(req, res, next) {
  var treeModel = new SmartTreesModel();
  treeModel.trees(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(400, error);
  });

  return next();
};

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

Tree.prototype.updateLike = function(req, res, next) {
  var treeModel = new SmartTreesModel();
  var data = req.body;
  treeModel.treeUpdateLike(data, function(result) {
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
