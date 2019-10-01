// Node.js modules
const axios = require('axios');
// utilities to to use
const AppError = require('./../utils/AppError');

//get forum view to all users
exports.getForums = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get forums from the API
    const forums = await axios({
      method: 'GET',
      url: `${href}api/v1/forums`
    });

    //check if response is successful
    if (forums.data.status === 'success') {
      //send forums to the view page
      res.status(200).render('ForumView', {
        title: 'Forums',
        forums: forums.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

//get all forum to send to the management view to admins
exports.getManageForumsList = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get forum from the AI
    const forums = await axios({
      method: 'GET',
      url: `${href}api/v1/forums`
    });

    //check if response is successful
    if (forums.data.status === 'success') {
      //send forum to the pug templates
      res.status(200).render('ForumListView', {
        title: 'Forum',
        forums: forums.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

// create forum method to create a new forum
exports.createForum = function(req, res) {
  //render the pug template to create a forum
  res.status(200).render('CreateElementView', {
    title: 'Forum',
    user: req.user
  });
};

// edit the forum method
exports.editForum = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get from form API
    const forums = await axios({
      method: 'GET',
      url: `${href}api/v1/forums/slug/${req.params.forumSlug}`
    });

    //check if response is successful
    if (forums.data.status === 'success') {
      //send forum data to the pug template
      res.status(200).render('EditElementView', {
        title: 'Forum',
        forum: forums.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
