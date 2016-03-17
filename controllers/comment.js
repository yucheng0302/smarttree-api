var CommentModel = require('../models/comment');
var Comment = function() {};
var comment = new Comment();

module.exports.route = function(app) {
  app.get('/comments', comment.getComments);
  app.post('/comment', comment.postComment);
};

/*
 * controller
 */
Comment.prototype.getComments = function(req, res, next) {

  return next();

};

Comment.prototype.postComment = function(req, res, next) {
  return next();
};
