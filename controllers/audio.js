'use strict';

var AudioModel = require('../models/audio');
var Audio = function() {};
var audio = new Audio();

module.exports.route = function(app) {
  app.get('/tree/:treeId/audios', audio.getAudiosPerTree);
  app.put('/tree/:treeId/audio', audio.registerAudio);
};

/*
 * controller
 */
Audio.prototype.getAudiosPerTree = function(req, res, next) {
  var audioModel = new AudioModel();
  audioModel.audiosPerTree(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(500, error);
  });
  return next();
};

Audio.prototype.registerAudio = function(req, res, next) {
  var audioModel = new AudioModel();
  var data = JSON.parse(req.body);
  data.treeId = req.params.treeId;
  audioModel.registerAudio(data, function(result) {
    res.send({status: 'success'});
  }, function(error) {
    res.send(500, error);
  });
  return next();
};
