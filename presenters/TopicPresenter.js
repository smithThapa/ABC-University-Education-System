const Topic = require('./../models/TopicModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./HandlerFactory');

//middleware
exports.setForumIds = (req, res, next) => {
  if (!req.body.forum) req.body.forum = req.params.forumId;
  next();
};

exports.getAllTopics = factory.getAll(Topic);
exports.getTopic = factory.getOne(Topic);
exports.createTopic = factory.createOne(Topic);
exports.updateTopic = factory.updateOne(Topic);
exports.deleteTopic = factory.deleteOne(Topic);
