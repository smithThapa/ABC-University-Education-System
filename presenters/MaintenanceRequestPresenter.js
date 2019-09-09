const MaintenanceRequest = require('../models/MaintenanceRequestModel');
const factory = require('./HandlerFactory');

exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllMaintenanceRequests = factory.getAll(MaintenanceRequest);
exports.getMaintenanceRequest = factory.getOne(MaintenanceRequest);
exports.createMaintenanceRequest = factory.createOne(MaintenanceRequest);
exports.deleteMaintenanceRequest = factory.deleteOne(MaintenanceRequest);
