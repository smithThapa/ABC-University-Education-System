const { promisify } = require('util');
const jwt = require('jsonwebtoken');
// const axios = require('axios');
const catchAsync = require('./../utils/CatchAsync');
// eslint-disable-next-line no-unused-vars
const AppError = require('./../utils/AppError');
const User = require('./../models/UserModel');

exports.getLoginPage = catchAsync(async (req, res, next) => {
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
        return res.status(200).render('LoginView', {
          title: 'Login'
        });
      }

      // 3 : Check if user change password after the JWT was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return res.status(200).render('LoginView', {
          title: 'Login'
        });
      }

      res.redirect('/home');
    } else {
      return res.status(200).render('LoginView', {
        title: 'Login'
      });
    }
  } catch (err) {
    return res.status(200).render('LoginView', {
      title: 'Login'
    });
  }

  // console.log(req.cookies);
  // res.status(200).render('LoginView', {
  //   title: 'Login'
  // });
});

exports.getHomePage = (req, res) => {
  res.status(200).render('HomeView', {
    title: 'Home'
  });
};
