// Node.js modules to use
const axios = require('axios');
// utilities to use
const AppError = require('./../utils/AppError');

// Accepts the array and key to group the array by the keys
const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};

//get topics in the forum by its slug
exports.getTopicsByForumSlug = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    // get the forum in the API by its slug
    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    //get all topics by the forum id in the API
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
    //add authentication to axios
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
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get the forum by its slug
    const objForum = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums/slug/${req.params.forumSlug}`
    });

    //check if response is successful
    if (objForum.data.status === 'success') {
      //send to the creation view to create a topic
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
    //add authentication to axios
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

    // check if responses are successful
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

// create a topic by the forum slug
exports.createTopicByForumSlug = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    // get forum bu its slug from API
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

//edit method to get a topic and edit it
exports.editTopic = async function(req, res, next) {
  try {
    //add authentication to axios
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
      //send data to the view
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
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get all forums from the API
    const objForums = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/forums`
    });

    // array group it by the type to get the selection
    const objectTitlesByType = groupBy(objForums.data.data.data, 'type');

    // check if response is successful
    if (objForums.data.status === 'success') {
      //send forum to the pug template
      res.status(200).render('CreateElementView', {
        title: 'Topic',
        forums: objForums.data.data.data,
        objectTitlesByType
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
