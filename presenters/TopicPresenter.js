const Topic = require('./../models/TopicModel');
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const factory = require('./HandlerFactory');

//middleware
//middleware to add forum if it is provided
exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.setForumIds = (req, res, next) => {
  if (!req.body.forum) req.body.forum = req.params.forumId;
  next();
};

exports.getTopicSlug = catchAsync(async (req, res, next) => {
  const topic = await Topic.findOne({ slug: req.params.slug }).populate({
    path: 'comments'
  });

  if (!topic) {
    return next(new AppError('No Topic found with that name', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: topic
    }
  });
});

exports.getAllTopics = factory.getAll(Topic, { path: 'comments' });
exports.getTopic = factory.getOne(Topic, { path: 'comments' });
// exports.getAllTopics = factory.getAllBySlug(Topic, { path: 'comments' });
// exports.getTopic = factory.getOneBySlug(Topic, { path: 'comments' });
exports.createTopic = factory.createOne(Topic);
exports.updateTopic = factory.updateOne(Topic);
exports.deleteTopic = factory.deleteOne(Topic);
