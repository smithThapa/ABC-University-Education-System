const axios = require('axios');
const AppError = require('./../utils/AppError');

exports.getManageUsersList = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    const obj = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/users`
    });

    if (obj.data.status === 'success') {
      res.status(200).render('UserListView', {
        title: 'User',
        users: obj.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.createUser = async function(req, res, next) {
  try {
    res.status(200).render('CreateUserView', {
      title: 'User',
      user: req.user
    });
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.editUser = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const currentUser = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/users/${req.params.currentUserId}`
    });

    if (currentUser.data.status === 'success') {
      res.status(200).render('EditUserView', {
        title: 'User',
        currentUser: currentUser.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

exports.resetPassword = async function(req, res, next) {
  res.status(200).render('ResetPasswordView', {
    title: 'User',
    token: req.params.token
  });
};

exports.forgotPassword = async function(req, res, next) {
  res.status(200).render('ForgotPasswordView', {
    title: 'User'
  });
};

exports.getMyDetails = async function(req, res, next) {
  res.status(200).render('UserDetailsView', {
    title: 'User'
  });
};
