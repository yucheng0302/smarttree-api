'use strict';

var PhotoModel = require('../models/photo');
var Photo = function() {};
var photo = new Photo();

module.exports.route = function(app) {
  app.get('/tree/:treeId/photos', photo.getPhotosPerTree);
  app.put('/tree/:treeId/photo', photo.registerPhoto);
};

/*
 * controller
 */
Photo.prototype.getPhotosPerTree = function(req, res, next) {
  var photoModel = new PhotoModel();
  photoModel.photosPerTree(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(500, error);
  });
  return next();
};

Photo.prototype.registerPhoto = function(req, res, next) {
  var photoModel = new PhotoModel();
  var data = JSON.parse(req.body);
  data.treeId = req.params.treeId;
  photoModel.registerPhoto(data, function(result) {
    res.send({status: 'success'});
  }, function(error) {
    res.send(500, error);
  });
  return next();
};
