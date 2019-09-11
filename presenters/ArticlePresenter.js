const Article = require('../models/ArticleModel');
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const factory = require('./HandlerFactory');
const APIFeatures = require('./../utils/ApiFeatures');

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

exports.getAllArticles = factory.getAll(Article);
exports.getArticle = factory.getOne(Article);
exports.createArticle = factory.createOne(Article);
exports.updateArticle = factory.updateOne(Article);
exports.deleteArticle = factory.deleteOne(Article);
