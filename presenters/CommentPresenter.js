//Models to use
const Comment = require('./../models/CommentModel');
//methods to user from facrory
const factory = require('./HandlerFactory');

//middleware to et user id
exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//method to set fourm and topic id
exports.setForumAndTopicIds = (req, res, next) => {
  if (!req.body.forum) req.body.forum = req.params.forumId;
  if (!req.body.topic) req.body.topic = req.params.topicId;
  next();
};

//get all comments
exports.getAllComments = factory.getAll(Comment);
//get comment by id
exports.getComment = factory.getOne(Comment);
//create comment
exports.createComment = factory.createOne(Comment);
//update comment by id
exports.updateComment = factory.updateOne(Comment);
//delete comment byid
exports.deleteComment = factory.deleteOne(Comment);
