const express = require('express');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
// const viewPresenter = require('./../presenters/ViewPresenter');

const resourceRouter = require('./resourceRouter');

const homeView = require('./../views/HomeView');
const forumView = require('./../views/ForumView');
const topicView = require('./../views/TopicView');
const commentView = require('./../views/CommentView');
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
//Resource view
router.use('/resources', resourceRouter);

//Forum, Topics and comments views
router.get('/forums', forumView.getForumView);
router.get('/forums/:forumSlug/topics', topicView.getTopicsByForumSlug);
router.get(
  '/forums/:forumSlug/topics/:topicSlug/comments',
  commentView.getCommentsByTopicSlug
);
//Create comments
router.get(
  `/forums/:forumSlug/topics/:topicSlug/comments/newComment`,
  commentView.createComment
);

router.use(authenticationPresenter.restrictTo('admin'));

router.get('/manageUsers', userView.getManageUsersList);

router.get('/manageForums', forumView.getManageForumsList);

router.get(
  '/manageForums/:forumSlug/manageTopics',
  topicView.getManageTopicsListByForumSlug
);

module.exports = router;
