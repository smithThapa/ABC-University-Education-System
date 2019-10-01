//Models to use
const Forum = require('./../models/ForumModel');
//factory method for the model
const factory = require('./HandlerFactory');
//utilities methods to implement
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');

//set user id fro the creation
exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//get a forum by its unique slug
exports.getForumSlug = catchAsync(async (req, res, next) => {
  const forum = await Forum.findOne({ slug: req.params.slug }).populate({
    path: 'topics'
  });

  //if there is not found forum
  if (!forum) {
    return next(new AppError('No Forum found with that name', 404));
  }

  //response
  res.status(200).json({
    status: 'success',
    data: {
      data: forum
    }
  });
});

//get all forums
exports.getAllForums = factory.getAll(Forum, { path: 'topics' });
//get forum by id
exports.getForum = factory.getOne(Forum, { path: 'topics' });
//create forum
exports.createForum = factory.createOne(Forum);
//update forum by id
exports.updateForum = factory.updateOne(Forum);
//delete forum by id
exports.deleteForum = factory.deleteOne(Forum);

//get forum statistics
exports.getForumStats = catchAsync(async (req, res, next) => {
  //array to aggregate the forum and get the statistics by forum type
  const baseArrayAggregate = [
    {
      $lookup: {
        from: 'topics',
        localField: '_id',
        foreignField: 'forum',
        as: 'topics_array'
      }
    },
    {
      $project: {
        type: 1,
        numTopics: {
          $cond: {
            if: { $isArray: '$topics_array' },
            then: { $size: '$topics_array' },
            else: '0'
          }
        }
      }
    },
    {
      $group: {
        _id: '$type',
        numForums: { $sum: 1 },
        totalNumTopics: { $sum: '$numTopics' }
      }
    }
  ];

  //Total number of forums
  const totalBaseArrayAggregate = [
    {
      $group: {
        _id: 'Forum',
        totalNumForums: { $sum: '$numForums' },
        totalNumTopicsAllForums: { $sum: '$totalNumTopics' }
      }
    }
  ];

  //array with all months of the statistics
  const statsForumList = await factory.getAggregationStatsArray(
    Forum,
    baseArrayAggregate,
    totalBaseArrayAggregate
  );

  //response
  res.status(200).json({
    status: 'success',
    data: {
      data: statsForumList
    }
  });
});
