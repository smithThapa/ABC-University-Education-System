//Model to implement the
const Article = require('./../models/ArticleModel');
const User = require('./../models/UserModel');
//Factory to manage models
const factory = require('./HandlerFactory');
//utilities in the system
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const APIFeatures = require('./../utils/ApiFeatures');
const Email = require('./../utils/Email');

//set the user id for store the user in the model
exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//get an article by its unique slug
exports.getArticleSlug = catchAsync(async (req, res, next) => {
  //get the article by query by slugs
  const article = await Article.findOne({ slug: req.params.slug });

  //return error when there is not article
  if (!article) {
    return next(new AppError('No Forum found with that name', 404));
  }

  //successful respond with the whole article
  res.status(200).json({
    status: 'success',
    data: {
      data: article
    }
  });
});

//function to get all article that their type is Announcements
exports.getAllAnnouncements = catchAsync(async (req, res, next) => {
  //Execute query by allowing query option from the URL, type = announcement
  const features = new APIFeatures(
    Article.find({ type: 'Announcements' }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .pagination();

  //get announcements from the query
  const announcements = await features.query;

  //Send response
  res.status(200).json({
    status: 'success',
    results: announcements.length,
    data: {
      data: announcements
    }
  });
});

//get all article which their type is 'news'
exports.getAllNews = catchAsync(async (req, res, next) => {
  //Execute query with type = news and allow url query
  const features = new APIFeatures(Article.find({ type: 'News' }), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  //get the news from the query
  const news = await features.query;

  //Send response
  res.status(200).json({
    status: 'success',
    results: news.length,
    data: {
      data: news
    }
  });
});

//Get number of article by type
exports.getArticleType = catchAsync(async (req, res, next) => {
  //aggregare the article by grouping its ypes and cound the number
  const articleTypeNumbers = await Article.aggregate([
    {
      $group: {
        _id: '$type',
        typeTotal: { $sum: 1 }
      }
    }
  ]);

  //response with JSON object
  res.status(200).json({
    status: 'success',
    data: articleTypeNumbers
  });
});

//get all articles
exports.getAllArticles = factory.getAll(Article);
//get article by its id
exports.getArticle = factory.getOne(Article);
//create an article
exports.createArticle = catchAsync(async (req, res, next) => {
  //set the user
  req.body.data.user = req.body.user;

  //create the article with the body of the data
  const data = await Article.create(req.body.data);

  //if the type is announcement
  if (data.type === 'Announcements') {
    //get all roles that the user selected
    const { arrayRoleEmails } = req.body;

    //check if there is 1 or more roles to send email
    if (arrayRoleEmails.length > 0) {
      //attribute to query by role
      let queryRole;
      //is user select allocate all roles
      if (arrayRoleEmails.includes('all')) {
        //all roles, except team-maintenance
        queryRole = {
          $and: [
            {
              $or: [{ role: 'student' }, { role: 'staff' }, { role: 'admin' }]
            },
            { testUser: { $ne: true } }
          ]
        };
        //when all is not selected
      } else {
        //array with the roles selected
        const roles = [];
        //inset the roles select into the array
        arrayRoleEmails.forEach(element => {
          roles.push({ role: element });
        });
        //query statement with the role selected
        queryRole = {
          $and: [{ $or: roles }, { testUser: { $ne: true } }]
        };
      }

      //get users by the query above with the selected roles by the user
      let users = await User.find(queryRole);

      //if there is more than 1 users found
      if (users) {
        //URL to access announcements
        const announcementURL = `${req.protocol}://${req.get(
          'host'
        )}/announcements`;

        //case development to send only two email
        if (process.env.NODE_ENV.trim() === 'development' && users.length > 2) {
          users = users.slice(0, 2);
        }
        //iterate through all users found with those roles to send the email
        users.forEach(async elementUser => {
          await new Email(elementUser, announcementURL).sendAnnouncement(data);
        });
      }
    }
  }

  //response with the object
  res.status(201).json({
    status: 'success',
    data: {
      data
    }
  });
});

//update the article by id
exports.updateArticle = factory.updateOne(Article);
//delete the article by id
exports.deleteArticle = factory.deleteOne(Article);

//get statistics of the article
exports.getArticleStats = catchAsync(async (req, res, next) => {
  //array to aggregate by each required month, grouping by type
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

  //total number of the articles
  const totalBaseArrayAggregate = [
    {
      $group: {
        _id: 'Article',
        totalNumArticle: { $sum: '$numArticle' }
      }
    }
  ];

  //get an array with the statistics from the factory method
  const statsArticleList = await factory.getAggregationStatsArray(
    Article,
    baseArrayAggregate,
    totalBaseArrayAggregate
  );

  //send statistics
  res.status(200).json({
    status: 'success',
    data: {
      data: statsArticleList
    }
  });
});
