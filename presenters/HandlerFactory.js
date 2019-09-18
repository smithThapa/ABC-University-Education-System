const moment = require('moment');

const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const APIFeatures = require('./../utils/ApiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id, req.body);

    // eslint-disable-next-line no-restricted-syntax
    for (const key in req.body) {
      // eslint-disable-next-line no-prototype-builtins
      if (req.body.hasOwnProperty(key)) {
        if (key !== 'user') doc[key] = req.body[key];
      }
    }

    await doc.save();

    // console.log(doc);
    // doc.
    // const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    // console.log(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions, selectAttributes) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    if (selectAttributes) {
      query = query.select(selectAttributes);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested get review on tours
    let filter = {};
    if (req.params.forumId) {
      filter = {
        forum: req.params.forumId
      };
    }
    if (req.params.topicId) {
      filter = {
        topic: req.params.topicId
      };
    }
    // if (req.params.forumSlug) {
    //   filter = {
    //     forum: req.params.forumSlug
    //   };
    // }

    //Execute query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    if (popOptions) {
      features.query = features.query.populate(popOptions);
    }
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

exports.getAggregationStats = async function(
  Model,
  baseArrayAggregate,
  totalBaseArrayAggregate
) {
  const arraList = [];

  const arrayMonths = [1, 2, 3, 6, 12];
  const sortBaseArrayAggregate = [{ $sort: { _id: 1 } }];

  await Promise.all(
    arrayMonths.map(async month => {
      const dateQuery = moment()
        .startOf('month')
        .subtract(month - 1, 'months')
        .format();

      const queryMatchArray = [
        {
          $match: {
            createdAt: {
              $gt: new Date(dateQuery)
            }
          }
        }
      ];

      const statsMonth = await Model.aggregate(
        queryMatchArray
          .concat(baseArrayAggregate)
          .concat(sortBaseArrayAggregate)
      );

      const statsTotalMonth = await Model.aggregate(
        queryMatchArray
          .concat(baseArrayAggregate)
          .concat(totalBaseArrayAggregate)
          .concat(sortBaseArrayAggregate)
      );

      arraList.push([
        `${month.toString().length === 1 ? `0${month}` : month} Months`,
        statsMonth,
        statsTotalMonth
      ]);
    })
  );

  const stats = await Model.aggregate(
    baseArrayAggregate.concat(sortBaseArrayAggregate)
  );

  const statsTotal = await Model.aggregate(
    baseArrayAggregate
      .concat(totalBaseArrayAggregate)
      .concat(sortBaseArrayAggregate)
  );

  arraList.push(['Total', stats, statsTotal]);

  arraList.sort();

  return arraList;
};
