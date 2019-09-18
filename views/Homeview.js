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
};

exports.getHomePage = async function(req, res, next) {
  //get last three news
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    if (req.user.role !== 'team-maintenance') {
      //get api
      const news = await axios({
        method: 'GET',
        url:
          'http://127.0.0.1:8000/api/v1/articles/news?sort=-createdAt&limit=3'
      });

      const announcements = await axios({
        method: 'GET',
        url:
          'http://127.0.0.1:8000/api/v1/articles/announcements?sort=-createdAt&limit=3'
      });

      if (news.data.status === 'success') {
        res.status(200).render('HomeView', {
          title: 'Home',
          news: news.data.data.data,
          announcements: announcements.data.data.data
        });
      }
    } else {
      res.status(200).render('HomeView', {
        title: 'Home'
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
