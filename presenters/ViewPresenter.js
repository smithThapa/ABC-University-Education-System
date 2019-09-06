const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const axios = require('axios');
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

//get forums page
exports.getForumView = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const objs = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/forums'
    });

    if (objs.data.status === 'success') {
      res.status(200).render('ForumView', {
        title: 'Forums',
        forums: objs.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

//get forums page
exports.getTopicByForumId = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api of tours
    const objTopics = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/${req.params.forumId}/topics`
    });

    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/${req.params.forumId}`
    });

    if (
      objTopics.data.status === 'success' &&
      objForum.data.status === 'success'
    ) {
      res.status(200).render('TopicView', {
        title: 'Topics',
        topics: objTopics.data.data.data,
        forum: objForum.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
