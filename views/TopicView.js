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
        title: 'Manage Topics',
        topics: objTopics.data.data.data,
        forum: objForum.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
