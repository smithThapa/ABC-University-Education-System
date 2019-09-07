const ErrorReport = require('../models/ErrorReportModel');
const factory = require('./HandlerFactory');

exports.getAllErrorReports = factory.getAll(ErrorReport);
exports.getErrorReport = factory.getOne(ErrorReport);
exports.createErrorReport = factory.createOne(ErrorReport);
exports.deleteErrorReport = factory.deleteOne(ErrorReport);
exports.updateErrorReport = factory.updateOne(ErrorReport);
