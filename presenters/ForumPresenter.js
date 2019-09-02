const Forum = require('./../models/ForumModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./HandlerFactory');

exports.getAllForums = factory.getAll(Forum);
exports.getForum = factory.getOne(Forum, {
  path: 'topics',
  select: 'title _id'
});
exports.createForum = factory.createOne(Forum);
exports.updateForum = factory.updateOne(Forum);
exports.deleteForum = factory.deleteOne(Forum);
