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
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

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
// exports.getOneBySlug = (Model, popOptions, selectAttributes) =>
//   catchAsync(async (req, res, next) => {
//     let query = Model.find({ slug: req.params.id });

//     if (popOptions) {
//       query = query.populate(popOptions);
//     }

//     if (selectAttributes) {
//       query = query.select(selectAttributes);
//     }

//     const doc = await query;

//     if (!doc) {
//       return next(new AppError('No document found with that ID', 404));
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         data: doc
//       }
//     });
//   });

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

// exports.getAllBySlug = (Model, popOptions) =>
//   catchAsync(async (req, res, next) => {
//     // const tour = await Tour.findOne({ slug: req.params.slug });
//     // to allow for nested get review on tours
//     let filter = {};
//     if (req.params.forumId) {
//       filter = {
//         slug: req.params.fourmId
//       };
//     }
//     if (req.params.topicId) {
//       filter = {
//         slug: req.params.topicId
//       };
//     }

//     //Execute query
//     const features = new APIFeatures(Model.find(filter), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .pagination();

//     if (popOptions) {
//       features.query = features.query.populate(popOptions);
//     }
//     const doc = await features.query;
//     //const doc = await features.query.explain();

//     //Send responce
//     res.status(200).json({
//       status: 'success',
//       results: doc.length,
//       data: {
//         data: doc
//       }
//     });
//   });
