const express = require('express');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
const viewPresenter = require('./../presenters/ViewPresenter');

const router = express.Router();

//Start
router.get('/', viewPresenter.getLoginPage);

router.get(
  '/home',
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  viewPresenter.getHomePage
);

//Forum page
router.use(
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

router.get('/forums', viewPresenter.getForumView);
router.get('/forum/:forumId', viewPresenter.getTopicByForumId);

module.exports = router;
