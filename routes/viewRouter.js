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

router.get(
  '/maintenance_request',
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  viewPresenter.getMaintenancePage
);

//Forum page
router.use(
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

router.get('/forums', viewPresenter.getForumView);
router.get('/forum/:forumId', viewPresenter.getTopicByForumId);

router.use(authenticationPresenter.restrictTo('staff', 'admin'));

router.get('/manageForums', viewPresenter.getManageForumsList);

module.exports = router;
