'use strict';

var CommentModel = require('../models/comment');
var Comment = function() {};
var comment = new Comment();

module.exports.route = function(app) {
  app.get('/comments', comment.getAllComments); //to make the lab work
  app.get('/comments/all', comment.getAllComments);
  app.get('/comments/tree/:treeId', comment.getCommentsPerTreeId);
  app.get('/comment/tree/:treeId/likecount', comment.getCommentLike);
  app.put('/comment/add', comment.postComment);
  app.del('/comment/:commentId', comment.deleteComment);
};

/*
 * controller
 */
Comment.prototype.getAllComments = function(req, res, next) {
  var commentModel = new CommentModel();
  commentModel.comments(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(400, error);
  });
  return next();
};

Comment.prototype.getCommentsPerTreeId = function(req, res, next) {
  var commentModel = new CommentModel();
  commentModel.commentsPerTree(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(400, error);
  });
  return next();
};

Comment.prototype.getCommentLike = function(req, res, next) {
  var commentModel = new CommentModel();
  commentModel.likesPerTree(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(400, error);
  });
  return next();
};

Comment.prototype.postComment = function(req, res, next) {
  var commentModel = new CommentModel();
  commentModel.add(JSON.parse(req.body), function(result) {
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

Comment.prototype.deleteComment = function(req, res, next) {
  var commentModel = new CommentModel();
  commentModel.deleteComment(req.params, function(result) {
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
