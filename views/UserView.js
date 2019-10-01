// Node,js modules to use
const axios = require('axios');
//utilities to use
const AppError = require('./../utils/AppError');

//get maintenance users view to admins
exports.getManageUsersList = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get users from the API
    const users = await axios({
      method: 'GET',
      url: `${href}api/v1/users`
    });

    //check if response is successful
    if (users.data.status === 'success') {
      //send users to the pug template
      res.status(200).render('UserListView', {
        title: 'User',
        users: users.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

//create user method to open a view to create a new user
exports.createUser = async function(req, res, next) {
  try {
    //open pug template to create user
    res.status(200).render('CreateUserView', {
      title: 'User',
      user: req.user
    });
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

//edit method to edit a user
exports.editUser = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get current User from API by Id
    const currentUser = await axios({
      method: 'GET',
      url: `${href}api/v1/users/${req.params.currentUserId}`
    });

    //check if response is successful
    if (currentUser.data.status === 'success') {
      // send user to the edit user view
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

// reset password page after user click in the URL in their email to reset password
exports.resetPassword = async function(req, res, next) {
  //send token to the page
  res.status(200).render('ResetPasswordView', {
    title: 'User',
    token: req.params.token
  });
};

// forgot password page to users to require a new token to login
exports.forgotPassword = async function(req, res, next) {
  res.status(200).render('ForgotPasswordView', {
    title: 'User'
  });
};

//get my details page to check detail users
exports.getMyDetails = async function(req, res, next) {
  res.status(200).render('UserDetailsView', {
    title: 'User'
  });
};

//get send notification page to email notification to users
exports.getSendNotificationPage = function(req, res) {
  res.status(200).render('SendNotificationPage', {
    title: 'Send Notifications'
  });
};
