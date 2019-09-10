const axios = require('axios');
const AppError = require('./../utils/AppError');

exports.getCommentsByTopicSlug = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    const objTopic = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/topics/slug/${req.params.topicSlug}`
    });

    //get api of tours
    const objComments = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/topics/${objTopic.data.data.data._id}/comments`
    });

    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success' &&
      objComments.data.status === 'success'
    ) {
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

exports.createComment = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    const objTopic = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/topics/slug/${req.params.topicSlug}`
    });

    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success'
    ) {
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

exports.getManageCommentsListByTopicSlug = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    const objTopic = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/topics/slug/${req.params.topicSlug}`
    });

    //get api of tours
    const objComments = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/topics/${objTopic.data.data.data._id}/comments`
    });

    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success' &&
      objComments.data.status === 'success'
    ) {
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

exports.editComment = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    const objTopic = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/topics/slug/${req.params.topicSlug}`
    });

    const objComment = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/comments/${req.params.commentId}`
    });

    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success' &&
      objComment.data.status === 'success'
    ) {
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