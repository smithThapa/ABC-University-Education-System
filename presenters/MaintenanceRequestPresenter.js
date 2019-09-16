const MaintenanceRequest = require('../models/MaintenanceRequestModel');
const factory = require('./HandlerFactory');
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const Email = require('./../utils/Email');

exports.setUserId = (req, res, next) => {
  //Allows nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllMaintenanceRequests = factory.getAll(MaintenanceRequest);
exports.getMaintenanceRequest = factory.getOne(MaintenanceRequest);
exports.createMaintenanceRequest = factory.createOne(MaintenanceRequest);

exports.updateMaintenanceRequest = catchAsync(async (req, res, next) => {
  const data = await MaintenanceRequest.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!data) {
    return next(new AppError('No document found with that ID', 404));
  }

  //it is has been updated with a message to send users
  if (data.resolvedMessage) {
    // console.log(data.user);

    const resolveMaintenanceURL = `${req.protocol}://${req.get('host')}/`;
    //send resolution to users
    await new Email(data.user, resolveMaintenanceURL).sendMaintenanceResolution(
      data
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      data
    }
  });
});

exports.deleteMaintenanceRequest = factory.deleteOne(MaintenanceRequest);
