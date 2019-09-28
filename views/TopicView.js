// Node.js modules to use
const axios = require('axios');
// utilities to use
const AppError = require('./../utils/AppError');

//get topics in the fourm by its slug
exports.getTopicsByForumSlug = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    // get the fourm in the API by its slug
    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    //get all topics by the fourm id in the API
    const objTopics = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/${objForum.data.data.data._id}/topics`
    });

    //check if responses are successful
    if (
      objTopics.data.status === 'success' &&
      objForum.data.status === 'success'
    ) {
      //send data to the pug template
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

// get the management view of the topic to admins
exports.getManageTopicsListByForumSlug = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    // get the forum by its slug from API
    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    //get topics by forum id from API
    const objTopics = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/${objForum.data.data.data._id}/topics`
    });

    //check if responses are valid successful
    if (
      objTopics.data.status === 'success' &&
      objForum.data.status === 'success'
    ) {
      //send data tp the pug template
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

//create a new topic by the forum slug
exports.createTopicByForumSlug = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get the forum by its slug
    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    //check if response is successful
    if (objForum.data.status === 'success') {
      //send ata to the creation view to create a topic
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

// edit a topic view to get the topic details and edit it
exports.editTopic = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get forum by slug from API
    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    // get the topic details by its id from API
    const objTopic = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/topics/slug/${req.params.topicSlug}`
    });

    // cehck if responses are successful
    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success'
    ) {
      //send data to the page
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

// create a topic by the fourm slug
exports.createTopicByForumSlug = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    // get forum bu its lsug from API
    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    // check if response is successful
    if (objForum.data.status === 'success') {
      // send forum to the pug template
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

//edit method to ghet a topci and edit it
exports.editTopic = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get forum by its slug from API
    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    // get topic by its slog from API
    const objTopic = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/topics/slug/${req.params.topicSlug}`
    });

    // check if responses are successful
    if (
      objForum.data.status === 'success' &&
      objTopic.data.status === 'success'
    ) {
      //send data to the dit view
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

// create topic method to create a topic by the staff
exports.createTopic = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get all forums from the API
    const objForums = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums`
    });

    // check if response is successful
    if (objForums.data.status === 'success') {
      //send forum to the pug template
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
