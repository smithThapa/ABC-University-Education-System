const axios = require('axios');
const AppError = require('./../utils/AppError');

exports.getStatisticsView = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const userStatistics = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/userStats'
    });

    const forumStatistics = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/forums/forumStats'
    });

    const topicStatistics = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/topics/topicStats'
    });
    // console.log(forumStatistics.data.data.data[0]);

    if (forumStatistics.data.status === 'success') {
      res.status(200).render('StatisticsView', {
        title: 'Statistics',
        userStatistics: userStatistics.data.data.data,
        forumStatistics: forumStatistics.data.data.data,
        topicStatistics: topicStatistics.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
