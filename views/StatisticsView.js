// Node.js modules to use
const axios = require('axios');
// utilities to use
const AppError = require('./../utils/AppError');

//get statistics of the website to be displayed to admins
exports.getStatisticsView = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get user statistics from API
    const userStatistics = await axios({
      method: 'GET',
      url: `${href}api/v1/users/userStats`
    });

    //get forum statistics from API
    const forumStatistics = await axios({
      method: 'GET',
      url: `${href}api/v1/forums/forumStats`
    });

    //get topics statistics from API
    const topicStatistics = await axios({
      method: 'GET',
      url: `${href}api/v1/topics/topicStats`
    });

    //get article Statistics statistics from API
    const articleStatistics = await axios({
      method: 'GET',
      url: `${href}api/v1/articles/articleStats`
    });

    //get resources statistics from API
    const resourceStatistics = await axios({
      method: 'GET',
      url: `${href}api/v1/resources/resourceStats`
    });

    //if all stats were successful gotten
    if (
      userStatistics.data.status === 'success' &&
      topicStatistics.data.status === 'success' &&
      forumStatistics.data.status === 'success' &&
      articleStatistics.data.status === 'success' &&
      resourceStatistics.data.status === 'success'
    ) {
      // send the statistics object to the pug template
      res.status(200).render('StatisticsView', {
        title: 'Statistics',
        userStatistics: userStatistics.data.data.data,
        forumStatistics: forumStatistics.data.data.data,
        topicStatistics: topicStatistics.data.data.data,
        articleStatistics: articleStatistics.data.data.data,
        resourceStatistics: resourceStatistics.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
