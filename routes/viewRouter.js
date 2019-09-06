const express = require('express');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
// const viewPresenter = require('./../presenters/ViewPresenter');

const homeView = require('./../views/HomeView');
const forumView = require('./../views/ForumView');
const topicView = require('./../views/TopicView');
const userView = require('./../views/UserView');

const router = express.Router();

//Start
router.get('/', homeView.getLoginPage);

router.get(
  '/home',
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  homeView.getHomePage
);

//Forum page
router.use(
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

router.get('/forums', forumView.getForumView);
// router.get('/forum/:forumId', viewPresenter.getTopicByForumId);
router.get('/forums/:forumSlug/topics', topicView.getTopicByForumSlug);

router.use(authenticationPresenter.restrictTo('admin'));

router.get('/manageUsers', userView.getManageUsersList);

router.get('/manageForums', forumView.getManageForumsList);

router.get(
  '/manageForums/:forumSlug/manageTopics',
  topicView.getManageTopicsListByForumSlug
);

module.exports = router;
