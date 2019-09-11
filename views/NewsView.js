const axios = require('axios');
const AppError = require('./../utils/AppError');

//get announcements page
exports.getNews = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const objs = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/articles/news'
    });

    if (objs.data.status === 'success') {
      res.status(200).render('NewsView', {
        title: 'News',
        news: objs.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.getNewsDetails = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const obj = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/articles/slug/${req.params.slug}`
    });

    if (obj.data.status === 'success') {
      res.status(200).render('NewsDetailsView', {
        title: 'News',
        newElement: obj.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.getManageNewsList = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const objs = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/articles/news'
    });

    if (objs.data.status === 'success') {
      res.status(200).render('NewsListView', {
        title: 'News',
        news: objs.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.createNews = function(req, res, next) {
  res.status(200).render('CreateArticleView', {
    title: 'News',
    user: req.user
  });
};

exports.editNews = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const obj = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/articles/slug/${req.params.newsSlug}`
    });

    if (obj.data.status === 'success') {
      res.status(200).render('EditArticleView', {
        title: 'News',
        article: obj.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
