//models to use
const Topic = require('./../models/TopicModel');
//factor methods to implements
const factory = require('./HandlerFactory');
//utilities of the system
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');

//middle ware to add user id
exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//middle ware to all forum id
exports.setForumIds = (req, res, next) => {
  if (!req.body.forum) req.body.forum = req.params.forumId;
  next();
};

//function to get topic by slug
exports.getTopicSlug = catchAsync(async (req, res, next) => {
  //get the topic by the slug
  const topic = await Topic.findOne({ slug: req.params.slug }).populate({
    path: 'comments'
  });

  //no topic in the system
  if (!topic) {
    return next(new AppError('No Topic found with that name', 404));
  }

  //response
  res.status(200).json({
    status: 'success',
    data: {
      data: topic
    }
  });
});

//get all topics
exports.getAllTopics = factory.getAll(Topic, { path: 'comments' });
//get topics by id with its comments
exports.getTopic = factory.getOne(Topic, { path: 'comments' });
//create the topic
exports.createTopic = factory.createOne(Topic);
//update the topic by id
exports.updateTopic = factory.updateOne(Topic);
//delete the topic by id
exports.deleteTopic = factory.deleteOne(Topic);

//get topic stats
exports.getTopicStats = catchAsync(async (req, res, next) => {
  //array to aggregate the model by the forum types in the topics
  const baseArrayAggregate = [
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'topic',
        as: 'comments_array'
      }
    },
    {
      $lookup: {
        from: 'forums',
        localField: 'forum',
        foreignField: '_id',
        as: 'forum_array'
      }
    },
    {
      $project: {
        forumElement: { $arrayElemAt: ['$forum_array', 0] },
        forumType: '$forumElement.type',
        numComments: {
          $cond: {
            if: { $isArray: '$comments_array' },
            then: { $size: '$comments_array' },
            else: '0'
          }
        }
      }
    },
    {
      $group: {
        _id: { $ifNull: ['$forumElement.type', 'No type'] },
        numTopics: { $sum: 1 },
        totalNumComments: { $sum: '$numComments' }
      }
    }
  ];

  //array to get total of the topic model
  const totalBaseArrayAggregate = [
    {
      $group: {
        _id: 'Topic',
        totalNumTopics: { $sum: '$numTopics' },
        totalNumCommentsAllTopics: { $sum: '$totalNumComments' }
      }
    }
  ];

  //stats array with all topics and months
  const statsTopicList = await factory.getAggregationStatsArray(
    Topic,
    baseArrayAggregate,
    totalBaseArrayAggregate
  );

  //response
  res.status(200).json({
    status: 'success',
    data: {
      data: statsTopicList
    }
  });
});
