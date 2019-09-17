const express = require('express');
const userPresenter = require('./../presenters/UserPresenter');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');

const router = express.Router();

// Sign up user, log in and out of users
router.post('/signup', authenticationPresenter.signup); // This router will not be used
router.post('/login', authenticationPresenter.login);
router.get('/logout', authenticationPresenter.logout);
router.get('/logoutas', authenticationPresenter.logoutAs);

//forget password and reset password
router.post('/forgotPassword', authenticationPresenter.forgotPassword);
router.patch('/resetPassword/:token', authenticationPresenter.resetPassword);

//Add protection to all following routers
router.use(authenticationPresenter.protect);

//manage personal account
router.patch('/updateMyPassword', authenticationPresenter.updatePassword);
router.get('/me', userPresenter.getMe, userPresenter.getUser);
router.patch('/updateMe', userPresenter.updateMe);
router.delete('/deleteMe', userPresenter.deleteMe);

//all by admin
router.post(
  '/createUser',
  authenticationPresenter.restrictTo('admin'),
  authenticationPresenter.createUser
);

router
  .route('/')
  .get(authenticationPresenter.restrictTo('admin'), userPresenter.getAllUsers);
//.post(userPresenter.createNewUsers);

router
  .route('/:id')
  .get(authenticationPresenter.restrictTo('admin'), userPresenter.getUser)
  .patch(authenticationPresenter.restrictTo('admin'), userPresenter.updateUser)
  .delete(
    authenticationPresenter.restrictTo('admin'),
    userPresenter.deleteUser
  );

router.post(
  '/notifyUsers/:type',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin', 'team-maintenance'),
  userPresenter.sendNotificationUser
);

module.exports = router;
