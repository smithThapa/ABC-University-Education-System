// Node.js modules to use
const axios = require('axios');
// utilities to use
const AppError = require('./../utils/AppError');

//get news for user to nagivate thorugh them
exports.getNews = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get the stats with the number of news in the system
    const stats = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/articles/stats`
    });

    //get news from API
    const news = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/articles/news?sort=-createdAt`
    });

    //check if the response is successful
    if (news.data.status === 'success') {
      //send news and numbers of records to the pug template
      res.status(200).render('NewsView', {
        title: 'News',
        news: news.data.data.data,
        records: stats.data.data[1].typeTotal
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

//get new details to be displayed to any user
exports.getNewsDetails = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get new element from API and its slug
    const newElement = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/articles/slug/${req.params.slug}`
    });

    //check fi the response is successful
    if (newElement.data.status === 'success') {
      //send the new to the pug template to be displayed
      res.status(200).render('NewsDetailsView', {
        title: 'News',
        newElement: newElement.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

// get news list to display tot he admin to manage news
exports.getManageNewsList = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get news from API
    const news = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/articles/news'
    });

    // check if response is successful
    if (news.data.status === 'success') {
      //send news to the pug template
      res.status(200).render('NewsListView', {
        title: 'News',
        news: news.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

// create new page
exports.createNews = function(req, res, next) {
  res.status(200).render('CreateArticleView', {
    title: 'News',
    user: req.user
  });
};

// edit method to pen tht e pug teamplete with the news data to be edited
exports.editNews = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get new element from API and its slug
    const newElement = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/articles/slug/${req.params.newsSlug}`
    });

    //check if the response is successful
    if (newElement.data.status === 'success') {
      //send new element to the pug template
      res.status(200).render('EditArticleView', {
        title: 'News',
        article: newElement.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
