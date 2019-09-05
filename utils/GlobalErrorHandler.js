const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./AppError');
const User = require('./../models/UserModel');

const userIsLogged = async function(err, req, res) {
  let currentUser;
  if (req.cookies.jwt) {
    // 1: Verification signToken
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    //2 : Check if the user still exist
    currentUser = await User.findById(decoded.id);
    if (currentUser) {
      // 3 : Check if user change password after the JWT was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        currentUser = undefined;
      }
    }
  }

  return res.status(err.statusCode).render('AppErrorPage', {
    title: 'Something went wrong!',
    msg: err.message,
    statusCode: err.statusCode,
    user: currentUser
  });
};
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  console.log(value);

  const message = `Duplicate field value: ${
    value[0]
  }. Please use another value`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, please log in again', 401);

const sendErrorDev = async (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  //RENDERED WEBSITE
  console.log('Error!', err);

  userIsLogged(err, req, res);

  // return res.status(err.statusCode).render('AppErrorPage', {
  //   title: 'Something went wrong!',
  //   msg: err.message,
  //   statusCode: err.statusCode,
  //   user: req.user
  // });
};

const sendErrorProd = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        statusCode: err.statusCode
      });
      //Proframmon or other unkonwn error: don't leak error details
    }
    //1 log
    console.log('Error!', err);

    userIsLogged(err, req, res);
    //2 send general message
    // return res.status(500).json({
    //   status: 'error',
    //   message: 'Something went very wrong!'
    // });
  }
  //RENDERED WEBSITE
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
      statusCode: err.statusCode
    });
    //Proframmon or other unkonwn error: don't leak error details
  }
  //1 log
  console.log('Error!', err);

  //2 send general message
  userIsLogged(err, req, res);
  // return res.status(err.statusCode).render('error', {
  //   title: 'Something went wrong!',
  //   msg: 'Please try agian later',
  //   statusCode: err.statusCode
  // });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
