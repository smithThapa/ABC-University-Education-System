const User = require('./../models/UserModel');
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const factory = require('./HandlerFactory');
const Email = require('./../utils/Email');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//middleware before get user
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1 crfeate error if user post password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  //2 Update user details
  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'email',
    'phoneNumber'
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    statu: 'sucess',
    data: null
  });
});

// These functional are only accessible to administrators
exports.getUser = factory.getOne(User, null, '+active');
exports.getAllUsers = factory.getAll(User, '+active');
exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Administrator cannot update other user password.', 400)
    );
  }
  //filter object of available options to update by admin
  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'email',
    'role',
    'major',
    'phoneNumber',
    'active',
    'testUser'
  );

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  }).select('+active');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
exports.deleteUser = factory.deleteOne(User);

exports.sendNotificationUser = catchAsync(async (req, res, next) => {
  const { type } = req.params;

  if (type === 'passwordChange') {
    //Users who have not changed their password in the last 2 months
    let users = await User.find({
      passwordChangedAt: {
        $not: { $gt: new Date(new Date() - 1000 * 60 * 60 * 24 * 30 * 2) }
      }
    });

    if (users) {
      const homeURL = `${req.protocol}://${req.get('host')}/`;

      if (process.env.NODE_ENV.trim() === 'development' && users.length > 2) {
        users = users.slice(0, 2);
      }

      users.forEach(async elementUser => {
        await new Email(elementUser, homeURL).sendNotificationChangePassword();
      });
    }
  }

  if (type === 'emailNotificationMaintenance') {
    // Get all users to email
    let users = await User.find();

    const { data } = req.body;

    if (users) {
      const homeURL = `${req.protocol}://${req.get('host')}/`;

      if (process.env.NODE_ENV.trim() === 'development' && users.length > 2) {
        users = users.slice(0, 2);
      }

      users.forEach(async elementUser => {
        await new Email(elementUser, homeURL).sendNotificationEmailNotification(
          data
        );
      });
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      type
    }
  });
});

exports.getUserStats = catchAsync(async (req, res, next) => {
  const baseArrayAggregate = [
    {
      $group: {
        _id: '$role',
        numUsers: { $sum: 1 }
      }
    }
  ];

  const totalBaseArrayAggregate = [
    {
      $group: {
        _id: 'User',
        totalNumUsers: { $sum: '$numUsers' }
      }
    }
  ];

  const statsUserList = await factory.getAggregationStats(
    User,
    baseArrayAggregate,
    totalBaseArrayAggregate
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: statsUserList
    }
  });
});
