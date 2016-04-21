'use strict';

var VideoModel = require('../models/video');
var Video = function() {};
var video = new Video();

module.exports.route = function(app) {
  app.get('/tree/:treeId/videos', video.getVideosPerTree);
  app.put('/tree/:treeId/video', video.registerVideo);
};

/*
 * controller
 */
Video.prototype.getVideosPerTree = function(req, res, next) {
  var videoModel = new VideoModel();
  videoModel.videosPerTree(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(500, error);
  });
  return next();
};

Video.prototype.registerVideo = function(req, res, next) {
  var videoModel = new VideoModel();
  var data = JSON.parse(req.body);
  data.treeId = req.params.treeId;
  videoModel.registerVideo(data, function(result) {
    res.send({status: 'success'});
  }, function(error) {
    res.send(500, error);
  });
  return next();
};
