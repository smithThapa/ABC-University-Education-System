const Forum = require('./../models/ForumModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./HandlerFactory');

exports.createForum = factory.createOne(Forum);
