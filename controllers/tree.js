'use strict';

var SmartTreesModel = require('../models/tree');
var uuid = require('node-uuid');

var Tree = function() {};
var tree = new Tree();

module.exports.route = function(app) {
  app.get('/trees', tree.getTrees);
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
