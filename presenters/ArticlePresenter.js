const Article = require('./../models/ArticleModel');
const User = require('./../models/UserModel');
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const factory = require('./HandlerFactory');
const APIFeatures = require('./../utils/ApiFeatures');
const Email = require('./../utils/Email');

exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getArticleSlug = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (!article) {
    return next(new AppError('No Forum found with that name', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: article
    }
  });
});

exports.getAllAnnouncements = catchAsync(async (req, res, next) => {
  // to allow for nested get review on tours

  //Execute query
  const features = new APIFeatures(
    Article.find({ type: 'Announcements' }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const doc = await features.query;

  //const doc = await features.query.explain();

  //Send responce
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc
    }
  });
});

exports.getAllNews = catchAsync(async (req, res, next) => {
  // to allow for nested get review on tours

  //Execute query
  const features = new APIFeatures(Article.find({ type: 'News' }), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const doc = await features.query;

  //const doc = await features.query.explain();

  //Send responce
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc
    }
  });
});

exports.getArticleType = catchAsync(async (req, res, next) => {
  const stats = await Article.aggregate([
    // {
    //   $match: { type: 'news' }
    // },
    {
      $group: {
        _id: '$type',
        typeTotal: { $sum: 1 }
      }
    }
    // ,
    // {
    //   $sort: { avgPrice: 1 }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

exports.getAllArticles = factory.getAll(Article);
exports.getArticle = factory.getOne(Article);
exports.createArticle = catchAsync(async (req, res, next) => {
  req.body.data.user = req.body.user;

  const data = await Article.create(req.body.data);

  if (data.type === 'Announcements') {
    const { arrayRoleEmails } = req.body;

    if (arrayRoleEmails.length > 0) {
      let queryRole;
      //is user select allocate all roles
      if (arrayRoleEmails.includes('all')) {
        queryRole = {
          $and: [
            {
              $or: [{ role: 'student' }, { role: 'staff' }, { role: 'admin' }]
            },
            { testUser: { $ne: true } }
          ]
        };
      } else {
        const roles = [];
        arrayRoleEmails.forEach(element => {
          roles.push({ role: element });
        });
        queryRole = {
          $and: [{ $or: roles }, { testUser: { $ne: true } }]
        };
      }

      let users = await User.find(queryRole);

      // if (users.data.status === 'success') {
      if (users) {
        const announcementURL = `${req.protocol}://${req.get(
          'host'
        )}/announcements`;

        if (process.env.NODE_ENV.trim() === 'development' && users.length > 2) {
          users = users.slice(0, 2);
        }

        users.forEach(async elementUser => {
          await new Email(elementUser, announcementURL).sendAnnouncement(data);
        });
      }
    }
  }
  // console.log(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data
    }
  });
});
exports.updateArticle = factory.updateOne(Article);
exports.deleteArticle = factory.deleteOne(Article);

exports.getArticleStats = catchAsync(async (req, res, next) => {
  const baseArrayAggregate = [
    {
      $project: {
        type: 1
      }
    },
    {
      $group: {
        _id: '$type',
        numArticle: { $sum: 1 }
      }
    }
  ];

  const totalBaseArrayAggregate = [
    {
      $group: {
        _id: 'Article',
        totalNumArticle: { $sum: '$numArticle' }
      }
    }
  ];

  const statsArticleList = await factory.getAggregationStats(
    Article,
    baseArrayAggregate,
    totalBaseArrayAggregate
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: statsArticleList
    }
  });
});
