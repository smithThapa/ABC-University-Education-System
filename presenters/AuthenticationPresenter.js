const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/UserModel');
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const Email = require('./../utils/Email');
// const viewPresenter = require('./ViewPresenter');

//create a JWT token with the id, key and expired day
const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

//create token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id); //sign token of a user
  //create cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // if (process.env.NODE_ENV.trim() === 'production') cookieOptions.secure = true;
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions); //add token into the cookies

  //remove password from data that the user sees
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

//create a new user
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: req.body.role,
    major: req.body.major,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  //   const url = `${req.protocol}://${req.get('host')}/me`;
  //   console.log(url);
  //   await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

//log in the user
exports.login = catchAsync(async (req, res, next) => {
  //get email and password
  const { email, password } = req.body;

  // 1: Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2: user exist and the password exist active to cheack status
  const user = await User.findOne({ email: email }).select('+password +active');

  // await of the correct pasword in order to avoid probles comparin poasswoird for the user
  if (
    !user ||
    !(await user.correctPassword(password, user.password)) ||
    !user.active
  ) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3: if everything ok, send token to client
  createSendToken(user, 200, res);
});

//log out user by destructing token
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1: Getting the token and check if it's threr
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('Your are not logged in! Please login to get access', 401)
    );
  }
  // 2: Verification signToken
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);

  // 3: Check if the user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The use belonging to this token does not longer exist!')
    );
  }

  // 4 : Check if user change password after the JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed passsword! Please log in again.', 401)
    );
  }

  //GRand access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

//Only for render pages, no errors
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 1: Verification signToken
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //console.log(decoded);

      // 2 : Check if the user still exist
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3 : Check if user change password after the JWT was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      //There is a logged in Uses
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this actions', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1: get user based on post email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  //2: generate the random reset passwordChangedAt
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // 3: send it to the users's email
    const resetURL = `${req.protocol}://${req.get('host')}${
      req.body.resetURL
    }/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1: get user based on the Token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2 : if token has not expired, and the is used, set the new passsword

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3: update changePasswordAt, property for the users

  //4 : log the user in, send jwt

  // 3: if everything ok, send token to client
  createSendToken(user, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1: get user from collection

  const user = await User.findById(req.user.id).select('+password');

  // 2: check is the posted current password is correctPassword
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // 3: if so, update passwordConfirm
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4 log user in, send jwt
  createSendToken(user, 200, res);
});

// function to create account account
//create a new user
exports.createUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Administrator cannot create account with password', 400)
    );
  }
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: req.body.role,
    major: req.body.major,
    phoneNumber: req.body.phoneNumber
    //It can not be added the passwords

    // password: req.body.password,
    // passwordConfirm: req.body.passwordConfirm
  });

  //2: generate the random reset passwordChangedAt
  const resetToken = newUser.createPasswordResetToken();
  await newUser.save({ validateBeforeSave: false });

  try {
    // 3: send it to the users's email
    const resetURL = `${req.protocol}://${req.get('host')}${
      req.body.resetURL
    }/${resetToken}`;

    await new Email(newUser, resetURL).sendWelcome();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    newUser.passwordResetToken = undefined;
    newUser.passwordResetExpired = undefined;
    await newUser.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});
