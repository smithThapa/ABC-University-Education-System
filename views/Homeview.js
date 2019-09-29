// Node.js modules to use
const axios = require('axios');
// utilities to use
const AppError = require('./../utils/AppError');

// get login page to start the application
exports.getLoginPage = async function(req, res, next) {
  //check if the user is login to redirect it to the home page
  if (res.locals.user) {
    res.redirect('/home');
  }
  //otherwise open the log in page
  else {
    res.status(200).render('LoginView', {
      title: 'Login'
    });
  }
};

// get the home page to all users after log in
exports.getHomePage = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //check if the user is not a team maintenance member
    if (req.user.role !== 'team-maintenance') {
      // get last three news from the API
      const news = await axios({
        method: 'GET',
        url:
          'http://127.0.0.1:8000/api/v1/articles/news?sort=-createdAt&limit=3'
      });

      // get last three announcements from the API
      const announcements = await axios({
        method: 'GET',
        url:
          'http://127.0.0.1:8000/api/v1/articles/announcements?sort=-createdAt&limit=3'
      });

      //check if last three news and announcements were successfully received
      if (
        news.data.status === 'success' &&
        announcements.data.status === 'success'
      ) {
        //send user to the home page with news and announcements
        res.status(200).render('HomeView', {
          title: 'Home',
          news: news.data.data.data,
          announcements: announcements.data.data.data
        });
      }
    }
    //if users is a team-maintenance
    else {
      res.status(200).render('HomeView', {
        title: 'Home'
      });
    }
  } catch (err) {
    //other wise redirect to the home page again
    res.status(200).render('HomeView', {
      title: 'Home'
    });
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
