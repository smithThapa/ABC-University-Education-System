const axios = require('axios');
const AppError = require('./../utils/AppError');

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

exports.getManageForumsList = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const objs = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/forums'
    });

    if (objs.data.status === 'success') {
      res.status(200).render('ForumListView', {
        title: 'Forum',
        forums: objs.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.createForum = async function(req, res, next) {
  res.status(200).render('AddElementView', {
    title: 'Forum',
    user: req.user
  });
};
