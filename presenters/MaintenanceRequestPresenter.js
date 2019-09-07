const MaintenanceRequest = require('../models/MaintenanceRequestModel');
const factory = require('./HandlerFactory');

exports.getAllMaintenanceRequests = factory.getAll(MaintenanceRequest);
exports.getMaintenanceRequest = factory.getOne(MaintenanceRequest);
exports.createMaintenanceRequest = factory.createOne(MaintenanceRequest);
exports.deleteMaintenanceRequest = factory.deleteOne(MaintenanceRequest);
