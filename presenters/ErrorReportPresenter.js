//Models to use
const ErrorReport = require('../models/ErrorReportModel');
//factor methods to use in the presenter
const factory = require('./HandlerFactory');

//set user id to add the creation
exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//get all error reports
exports.getAllErrorReports = factory.getAll(ErrorReport);
//get one error report by id
exports.getErrorReport = factory.getOne(ErrorReport);
//create error report
exports.createErrorReport = factory.createOne(ErrorReport);
//delete error report by id
exports.deleteErrorReport = factory.deleteOne(ErrorReport);
//update error report by id
exports.updateErrorReport = factory.updateOne(ErrorReport);
