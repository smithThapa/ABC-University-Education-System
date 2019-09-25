//Models to use
const MaintenanceRequest = require('../models/MaintenanceRequestModel');
//Factory to get its methods to manage the model
const factory = require('./HandlerFactory');
//utils of the app to use
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const Email = require('./../utils/Email');

//set the user id to create the obejct
exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//gte all maintenance requests
exports.getAllMaintenanceRequests = factory.getAll(MaintenanceRequest);
//get maintenance requests  by id
exports.getMaintenanceRequest = factory.getOne(MaintenanceRequest);
//create maintenance request
exports.createMaintenanceRequest = factory.createOne(MaintenanceRequest);
//update maintenance request by id
exports.updateMaintenanceRequest = catchAsync(async (req, res, next) => {
  //update the maintenance request
  const data = await MaintenanceRequest.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  //no data updated
  if (!data) {
    return next(new AppError('No document found with that ID', 404));
  }

  //it is has been updated with a message to send users
  if (data.resolvedMessage) {
    //url to user to go the application
    const resolveMaintenanceURL = `${req.protocol}://${req.get('host')}/`;
    //send resolution to users
    await new Email(data.user, resolveMaintenanceURL).sendMaintenanceResolution(
      data
    );
  }

  //response
  res.status(200).json({
    status: 'success',
    data: {
      data
    }
  });
});
//delete maintenance requests by id
exports.deleteMaintenanceRequest = factory.deleteOne(MaintenanceRequest);
