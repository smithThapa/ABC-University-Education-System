const Comment = require('./../models/CommentModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./HandlerFactory');

//middleware
exports.setForumAndTopicIds = (req, res, next) => {
  if (!req.body.forum) req.body.forum = req.params.forumId;
  if (!req.body.topic) req.body.topic = req.params.topicId;
  next();
};

exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
