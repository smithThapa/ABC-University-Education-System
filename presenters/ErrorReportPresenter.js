const ErrorReport = require('../models/ErrorReportModel');
const factory = require('./HandlerFactory');

exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllErrorReports = factory.getAll(ErrorReport);
exports.getErrorReport = factory.getOne(ErrorReport);
exports.createErrorReport = factory.createOne(ErrorReport);
exports.deleteErrorReport = factory.deleteOne(ErrorReport);
exports.updateErrorReport = factory.updateOne(ErrorReport);
