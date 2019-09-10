const axios = require('axios');
const AppError = require('./../utils/AppError');
//get forums page
exports.getTopicsByForumSlug = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    //get api of tours
    const objTopics = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/${objForum.data.data.data._id}/topics`
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

exports.getManageTopicsListByForumSlug = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    //get api of tours
    const objTopics = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/${objForum.data.data.data._id}/topics`
    });

    if (
      objTopics.data.status === 'success' &&
      objForum.data.status === 'success'
    ) {
      res.status(200).render('TopicListView', {
        title: 'Topic',
        topics: objTopics.data.data.data,
        forum: objForum.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.createTopicByForumSlug = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    if (objForum.data.status === 'success') {
      res.status(200).render('CreateElementView', {
        title: 'Topic',
        forum: objForum.data.data.data,
        user: req.user
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.editTopic = async function(req, res, next) {
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

    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success'
    ) {
      res.status(200).render('EditElementView', {
        title: 'Topic',
        forum: objForum.data.data.data,
        topic: objTopic.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
exports.createTopicByForumSlug = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    if (objForum.data.status === 'success') {
      res.status(200).render('CreateElementView', {
        title: 'Topic',
        forum: objForum.data.data.data,
        user: req.user
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.editTopic = async function(req, res, next) {
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

    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success'
    ) {
      res.status(200).render('EditElementView', {
        title: 'Topic',
        forum: objForum.data.data.data,
        topic: objTopic.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.createTopic = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const objForums = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums`
    });

    if (objForums.data.status === 'success') {
      res.status(200).render('CreateElementView', {
        title: 'Topic',
        forums: objForums.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
