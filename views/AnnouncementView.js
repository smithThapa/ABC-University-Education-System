//Node,js modules to use
const axios = require('axios');
// utilities to use
const AppError = require('./../utils/AppError');

//get announcements page to all users
exports.getAnnouncementView = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get stats of numbers of announcements and news from API
    const stats = await axios({
      method: 'GET',
      url: `${href}api/v1/articles/stats`
    });

    //get articles from the API sorted
    const announcements = await axios({
      method: 'GET',
      url: `${href}api/v1/articles/announcements?sort=-createdAt`
    });

    //if both axios responses were successful
    if (
      announcements.data.status === 'success' &&
      stats.data.status === 'success'
    ) {
      //send data to the pug render
      res.status(200).render('AnnouncementView', {
        title: 'Announcements',
        announcements: announcements.data.data.data,
        records: stats.data.data[0].typeTotal
      });
    }
  } catch (err) {
    //catch error
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

//get all announcements to send to the management view
exports.getManageAnnouncementList = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get announcements from the API
    const announcements = await axios({
      method: 'GET',
      url: `${href}api/v1/articles/announcements`
    });

    //check if axios response was successful
    if (announcements.data.status === 'success') {
      //render data to the pug template
      res.status(200).render('AnnouncementListView', {
        title: 'Announcement',
        announcements: announcements.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

//create announcement view to add a new announcement into the system
exports.createAnnouncement = function(req, res, next) {
  //render the article view to create a new announcement
  res.status(200).render('CreateArticleView', {
    title: 'Announcements',
    user: req.user
  });
};

// edit method to send the user to the edit page with the current data of the announcement
exports.editAnnouncement = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get announcement by its slug from API
    const announcement = await axios({
      method: 'GET',
      url: `${href}api/v1/articles/slug/${req.params.announcementSlug}`
    });

    //check if the response was successful
    if (announcement.data.status === 'success') {
      //send the announcement data to the pug template
      res.status(200).render('EditArticleView', {
        title: 'Announcements',
        article: announcement.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
