// const { promisify } = require('util');
// const jwt = require('jsonwebtoken');
const axios = require('axios');
// // const catchAsync = require('./../utils/CatchAsync');
// // eslint-disable-next-line no-unused-vars
const AppError = require('./../utils/AppError');
// const User = require('./../models/UserModel');

exports.getLoginPage = async function(req, res, next) {
  if (res.locals.user) {
    res.redirect('/home');
  }
  res.status(200).render('LoginView', {
    title: 'Login'
  });
  // try {
  //   if (req.cookies.jwt) {
  //     // 1: Verification signToken
  //     const decoded = await promisify(jwt.verify)(
  //       req.cookies.jwt,
  //       process.env.JWT_SECRET
  //     );
  //     //console.log(decoded);

  //     // 2 : Check if the user still exist
  //     const currentUser = await User.findById(decoded.id);
  //     if (!currentUser) {
  //       return res.status(200).render('LoginView', {
  //         title: 'Login'
  //       });
  //     }

  //     // 3 : Check if user change password after the JWT was issued
  //     if (currentUser.changedPasswordAfter(decoded.iat)) {
  //       return res.status(200).render('LoginView', {
  //         title: 'Login'
  //       });
  //     }

  //     res.redirect('/home');
  //   } else {
  //     return res.status(200).render('LoginView', {
  //       title: 'Login'
  //     });
  //   }
  // } catch (err) {
  //   return res.status(200).render('LoginView', {
  //     title: 'Login'
  //   });
  // }
  // console.log(req.cookies);
  // res.status(200).render('LoginView', {
  //   title: 'Login'
  // });
};

exports.getHomePage = async function(req, res, next) {
  //get last three news
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const news = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/articles/news?sort=-createdAt&limit=3'
    });

    if (news.data.status === 'success') {
      res.status(200).render('HomeView', {
        title: 'Home',
        news: news.data.data.data
      });
    }
  } catch (err) {
    res.status(200).render('HomeView', {
      title: 'Home'
    });
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
