const axios = require('axios');
const AppError = require('./../utils/AppError');

//get announcements page
exports.getAnnouncementView = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const objs = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/articles/announcements'
    });

    if (objs.data.status === 'success') {
      res.status(200).render('AnnouncementView', {
        title: 'Announcements',
        announcements: objs.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.getManageAnnouncementList = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const announcements = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/articles/announcements'
    });

    if (announcements.data.status === 'success') {
      res.status(200).render('AnnouncementListView', {
        title: 'Announcemenets',
        announcements: announcements.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
