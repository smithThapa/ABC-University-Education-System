// Node.js modules to use
const axios = require('axios');
// utilities to implement
const AppError = require('./../utils/AppError');

// method to get all comment by the topic slug to be display to all users
exports.getCommentsByTopicSlug = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get object forum by its slug in the URL
    const objForum = await axios({
      method: 'GET',
      url: `${href}api/v1/forums/slug/${req.params.forumSlug}`
    });

    //get object topic by its slug
    const objTopic = await axios({
      method: 'GET',
      url: `${href}api/v1/topics/slug/${req.params.topicSlug}`
    });

    //get all comments in the current topic
    const objComments = await axios({
      method: 'GET',
      url: `${href}api/v1/topics/${objTopic.data.data.data._id}/comments`
    });

    //check if forum, topic and comments were successfully gotten
    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success' &&
      objComments.data.status === 'success'
    ) {
      //render the data to the comment page
      res.status(200).render('CommentView', {
        title: 'Comments',
        comments: objComments.data.data.data,
        topic: objTopic.data.data.data,
        forum: objForum.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

//cerate method to redirect the user to the creation comment page
exports.createComment = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get forum by its slug
    const objForum = await axios({
      method: 'GET',
      url: `${href}api/v1/forums/slug/${req.params.forumSlug}`
    });

    //get topic by its slug
    const objTopic = await axios({
      method: 'GET',
      url: `${href}api/v1/topics/slug/${req.params.topicSlug}`
    });

    //check if both, forum and topic were successfully created
    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success'
    ) {
      //send data to the pug template to create an element
      res.status(200).render('CreateElementView', {
        title: 'Comment',
        topic: objTopic.data.data.data,
        forum: objForum.data.data.data,
        user: req.user,
        originalUrl: req.originalUrl
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

// get the management comment list byt its topic slug to manage the comment by the admin
exports.getManageCommentsListByTopicSlug = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get the forum object from the API by its slug
    const objForum = await axios({
      method: 'GET',
      url: `${href}api/v1/forums/slug/${req.params.forumSlug}`
    });

    //get topic object by its slug from API
    const objTopic = await axios({
      method: 'GET',
      url: `${href}api/v1/topics/slug/${req.params.topicSlug}`
    });

    //get comments by the topic ID from API
    const objComments = await axios({
      method: 'GET',
      url: `${href}api/v1/topics/${objTopic.data.data.data._id}/comments`
    });

    //check if the data was successfully received
    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success' &&
      objComments.data.status === 'success'
    ) {
      //send data to the management comment view
      res.status(200).render('CommentListView', {
        title: 'Comment',
        comments: objComments.data.data.data,
        topic: objTopic.data.data.data,
        forum: objForum.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

// edit method to get the comment details and by edited by the user who created
exports.editComment = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get forum by its slug from api
    const objForum = await axios({
      method: 'GET',
      url: `${href}api/v1/forums/slug/${req.params.forumSlug}`
    });

    //get topic by its slug from API
    const objTopic = await axios({
      method: 'GET',
      url: `${href}api/v1/topics/slug/${req.params.topicSlug}`
    });

    //get the comment by its id through API
    const objComment = await axios({
      method: 'GET',
      url: `${href}api/v1/comments/${req.params.commentId}`
    });

    //check if all responses were successful
    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success' &&
      objComment.data.status === 'success'
    ) {
      //send data tp the pug template to edit the comment
      res.status(200).render('EditElementView', {
        title: 'Comment',
        forum: objForum.data.data.data,
        topic: objTopic.data.data.data,
        comment: objComment.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
