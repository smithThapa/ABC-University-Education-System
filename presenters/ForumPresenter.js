const Forum = require('./../models/ForumModel');
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const factory = require('./HandlerFactory');

exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getForumSlug = catchAsync(async (req, res, next) => {
  const forum = await Forum.findOne({ slug: req.params.slug }).populate({
    path: 'topics'
  });

  if (!forum) {
    return next(new AppError('No Forum found with that name', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: forum
    }
  });
});

exports.getAllForums = factory.getAll(Forum, { path: 'topics' });
exports.getForum = factory.getOne(Forum, { path: 'topics' });
// exports.getAllForums = factory.getAllBySlug(Forum, { path: 'topics' });
// exports.getForum = factory.getOneBySlug(Forum, { path: 'topics' });
exports.createForum = factory.createOne(Forum);
exports.updateForum = factory.updateOne(Forum);
exports.deleteForum = factory.deleteOne(Forum);
