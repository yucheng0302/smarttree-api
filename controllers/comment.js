var CommentModel = require('../models/comment');
var Comment = function() {};
var comment = new Comment();

module.exports.route = function(app) {
  app.get('/comments', comment.getComments); //to make the lab work
  app.get('/comments/all', comment.getComments);
  app.put('/comment/add', comment.postComment);
};

/*
 * controller
 */
Comment.prototype.getComments = function(req, res, next) {
  var commentModel = new CommentModel();
  commentModel.comments(req.params, function(result) {
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
