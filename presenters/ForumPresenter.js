const Forum = require('./../models/ForumModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./HandlerFactory');

exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllForums = factory.getAll(Forum, { path: 'topics' });
exports.getForum = factory.getOne(Forum, { path: 'topics' });
// exports.getAllForums = factory.getAllBySlug(Forum, { path: 'topics' });
// exports.getForum = factory.getOneBySlug(Forum, { path: 'topics' });
exports.createForum = factory.createOne(Forum);
exports.updateForum = factory.updateOne(Forum);
exports.deleteForum = factory.deleteOne(Forum);
