const Topic = require('./../models/TopicModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./HandlerFactory');

exports.getAllTopics = factory.getAll(Topic);
exports.getTopic = factory.getOne(Topic);
exports.createTopic = factory.createOne(Topic);
exports.updateTopic = factory.updateOne(Topic);
exports.deleteTopic = factory.deleteOne(Topic);
