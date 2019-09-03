// eslint-disable-next-line no-unused-vars
const catchAsync = require('./../utils/CatchAsync');
// eslint-disable-next-line no-unused-vars
const AppError = require('./../utils/AppError');

exports.getLoginPage = (req, res) => {
  res.status(200).render('LoginView', {
    title: 'Login'
  });
};

exports.getHomePage = (req, res) => {
  res.status(200).render('HomeView', {
    title: 'Home'
  });
};
