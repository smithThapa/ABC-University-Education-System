//Node.js modules to implement
const express = require('express');
//Add presenters to use in the router
const userPresenter = require('./../presenters/UserPresenter');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');

//create a router object with Express for (http://127.0.0.1:8000/api/v1/users)
const router = express.Router();

//Roots to access the application

// '/signup' root to create a new user
router.post('/signup', authenticationPresenter.signup);
// '/login' root to log in a user
router.post('/login', authenticationPresenter.login);
// '/logout' root to log out a user
router.get('/logout', authenticationPresenter.logout);
// '/logoutAs' root to log in a test user to return to the team maintenance account
router.get('/logoutAs', authenticationPresenter.logoutAs);

//Roots to rest the password if users have forgotten their password

// '/forgotPassword' root to request a new token to reset password
router.post('/forgotPassword', authenticationPresenter.forgotPassword);
// '/resetPassword/:token' root to create a new password with the given token
router.patch('/resetPassword/:token', authenticationPresenter.resetPassword);

//Protect the router to all logged users
router.use(authenticationPresenter.protect);

//Roots to manage personal account

// '/me' root to get user details
router.get('/me', userPresenter.getMe, userPresenter.getUser);
// '/updatePassword' root to update the user password
router.patch('/updateMyPassword', authenticationPresenter.updatePassword);
// '/updateMe' root to update details
router.patch('/updateMe', userPresenter.updateMe);
// '/delteMe' root to delete own account (it only make account inactive)
router.delete('/deleteMe', userPresenter.deleteMe);

//Roots for admins to manage users

// '/createUser' root to create a user by admins
router.post(
  '/createUser',
  authenticationPresenter.restrictTo('admin'),
  authenticationPresenter.createUser
);

// '/' root
router
  .route('/')
  // get all users in API by Admin
  .get(authenticationPresenter.restrictTo('admin'), userPresenter.getAllUsers);

// '/userStats' root of the system to get all statistics of the users (only Admin)
router.get(
  '/userStats',
  authenticationPresenter.restrictTo('admin'),
  userPresenter.getUserStats
);

// '/:id' root get manage the element in the model by Id, such as get one, update and delete by Id
router
  .route('/:id')
  .get(authenticationPresenter.restrictTo('admin'), userPresenter.getUser)
  .patch(authenticationPresenter.restrictTo('admin'), userPresenter.updateUser)
  .delete(
    authenticationPresenter.restrictTo('admin'),
    userPresenter.deleteUser
  );

// '/notifyUsers/:type' root to send notification to users by email by Admins and Team Maintenance members
router.post(
  '/notifyUsers/:type',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin', 'team-maintenance'),
  userPresenter.sendNotificationUser
);

//export router to the app.js
module.exports = router;
