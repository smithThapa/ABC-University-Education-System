const moment = require('moment');

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

exports.getForumStats = catchAsync(async (req, res, next) => {
  const arrayMonths = [1, 2, 3, 6, 12];

  const statsForumList = [];

  const date = moment([2019, 0]).format();
  // .subtract(1, 'months')
  // .calendar();

  console.log(date);

  await Promise.all(
    arrayMonths.map(async month => {
      const statsForumMonth = await Forum.aggregate([
        {
          $match: {
            createdAt: {
              $gt: new Date(new Date() - 1000 * 60 * 60 * 24 * 30 * month)
              // $lt: new Date(
              //   new Date() - 1000 * 60 * 60 * 24 * 30 * (month - 1)
              // )
            }
          }
        },
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
            // maxNumberTopics: { $max: '$numTopics' },
            // minNumberTopics: { $min: '$numTopics' },
            // avgNumberTopics: { $avg: '$numTopics' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const statsForumTotalMonth = await Forum.aggregate([
        {
          $match: {
            createdAt: {
              $gt: new Date(new Date() - 1000 * 60 * 60 * 24 * 30 * month)
            }
          }
        },
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
        },
        {
          $group: {
            _id: 'Forum',
            totalNumForums: { $sum: '$numForums' },
            totalNumTopicsAllForums: { $sum: '$totalNumTopics' }
            // maxNumberForums: { $max: '$numForums' },
            // minNumberForums: { $min: '$numForums' },
            // avgNumberForums: { $avg: '$numForums' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      statsForumList.push([
        `${month.toString().length === 1 ? `0${month}` : month} Months`,
        statsForumMonth,
        statsForumTotalMonth
      ]);
    })
  );

  const statsForum = await Forum.aggregate([
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
        // maxNumberTopics: { $max: '$numTopics' },
        // minNumberTopics: { $min: '$numTopics' },
        // avgNumberTopics: { $avg: '$numTopics' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const statsForumTotal = await Forum.aggregate([
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
    },
    {
      $group: {
        _id: 'Forum',
        totalNumForums: { $sum: '$numForums' },
        totalNumTopicsAllForums: { $sum: '$totalNumTopics' }
        // maxNumberForums: { $max: '$numForums' },
        // minNumberForums: { $min: '$numForums' },
        // avgNumberForums: { $avg: '$numForums' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  statsForumList.push(['Total', statsForum, statsForumTotal]);

  statsForumList.sort();

  res.status(200).json({
    status: 'success',
    data: {
      data: statsForumList
    }
  });
});
