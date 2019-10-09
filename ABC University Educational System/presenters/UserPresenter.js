//models to use
const User = require('./../models/UserModel');
//factory methods to manage models
const factory = require('./HandlerFactory');
//utilities of the application
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const Email = require('./../utils/Email');

//filter object method with the filed
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  //return new object
  return newObj;
};

//middle ware before get user
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//function to update personal account (not password)
exports.updateMe = catchAsync(async (req, res, next) => {
  //1 create error if user post password
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

  //update the4 user by id and attributes
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  //response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

//delete personal account function
exports.deleteMe = catchAsync(async (req, res, next) => {
  //set account as inactive
  await User.findByIdAndUpdate(req.user.id, { active: false });

  //response
  res.status(204).json({
    statu: 'sucess',
    data: null
  });
});

//get user by id
exports.getUser = factory.getOne(User);
//get all users
exports.getAllUsers = factory.getAll(User);
//update user by admin
exports.updateUser = catchAsync(async (req, res, next) => {
  //do not allow update password
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

  //update user with no validation
  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  }).select('+active');

  //user not updated
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  //response
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
//delete user by id
exports.deleteUser = factory.deleteOne(User);

//send notification user for team-maintenance
exports.sendNotificationUser = catchAsync(async (req, res, next) => {
  //check type notification
  const { type } = req.params;

  //if it is to change password
  if (type === 'passwordChange') {
    //Users who have not changed their password in the last 2 months
    let users = await User.find({
      passwordChangedAt: {
        $not: { $gt: new Date(new Date() - 1000 * 60 * 60 * 24 * 30 * 2) }
      }
    });

    //if there is users to change password
    if (users) {
      const homeURL = `${req.protocol}://${req.get('host')}/`;

      if (process.env.NODE_ENV.trim() === 'development' && users.length > 2) {
        users = users.slice(0, 2);
      }
      //email all users
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
        await new Email(elementUser, homeURL).sendEmailNotification(data);
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
      $project: {
        role: 1,
        major: 1
      }
    },

    {
      $group: {
        _id: '$role',
        numUsers: { $sum: 1 },
        numAccounting: {
          $sum: {
            $cond: {
              if: { $eq: ['$major', 'Accounting'] },
              then: 1,
              else: 0
            }
          }
        },
        numBusiness: {
          $sum: {
            $cond: {
              if: { $eq: ['$major', 'Business'] },
              then: 1,
              else: 0
            }
          }
        },
        numInformationTechnology: {
          $sum: {
            $cond: {
              if: { $eq: ['$major', 'Information Technology'] },
              then: 1,
              else: 0
            }
          }
        },
        numProjectManagement: {
          $sum: {
            $cond: {
              if: { $eq: ['$major', 'Project Management'] },
              then: 1,
              else: 0
            }
          }
        },
        numNOTAMAJOR: {
          $sum: {
            $cond: {
              if: { $eq: ['$major', 'NOT A MAJOR'] },
              then: 1,
              else: 0
            }
          }
        }
      }
    }
  ];

  const totalBaseArrayAggregate = [
    {
      $group: {
        _id: 'User',
        totalNumUsers: { $sum: '$numUsers' },
        totalNumAccounting: { $sum: '$numAccounting' },
        totalNumBusiness: { $sum: '$numBusiness' },
        totalNumInformationTechnology: { $sum: '$numInformationTechnology' },
        totalNumProjectManagement: { $sum: '$numProjectManagement' },
        totalNumNOTAMAJOR: { $sum: '$numNOTAMAJOR' }
      }
    }
  ];

  const statsUserList = await factory.getAggregationStatsArray(
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
