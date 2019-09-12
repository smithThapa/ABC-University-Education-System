const express = require('express');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
// const viewPresenter = require('./../presenters/ViewPresenter');

const resourceRouter = require('./resourceRouter');

const homeView = require('./../views/HomeView');
const forumView = require('./../views/ForumView');
const topicView = require('./../views/TopicView');
const commentView = require('./../views/CommentView');
const announcementView = require('./../views/AnnouncementView');
const newsView = require('./../views/NewsView');
const userView = require('./../views/UserView');
const maintenanceRequestView = require('./../views/MaintenanceRequestView');

const router = express.Router();

//Start
router.get('/', authenticationPresenter.isLoggedIn, homeView.getLoginPage);

router.get('/my_details/reset_Password/:token', userView.resetPassword);

router.get('/my_details/forgot_password', userView.forgotPassword);

//------------------
//----All Users---------
//------------------

router.get('/home', authenticationPresenter.protect, homeView.getHomePage);

router.get(
  '/my_details/me',
  authenticationPresenter.protect,
  userView.getMyDetails
);

router.get(
  '/maintenance_request',
  authenticationPresenter.protect,
  maintenanceRequestView.getMaintenancePage
);

//------------------
//----Stundet, Staff and Admin---------
//------------------

//Resource view
router.use(
  '/resources',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin'),
  resourceRouter
);

router.all(
  '/forums',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);
router.all(
  '/forums/*',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

//Forum, Topics and comments views
router.get('/forums', forumView.getForums);
router.get('/forums/:forumSlug/topics', topicView.getTopicsByForumSlug);
router.get(
  '/forums/:forumSlug/topics/:topicSlug/comments',
  commentView.getCommentsByTopicSlug
);
//Create comments
router.get(
  `/forums/:forumSlug/topics/:topicSlug/comments/new_comment`,
  commentView.createComment
);
//Create comments
router.get(
  `/forums/:forumSlug/topics/:topicSlug/comments/:commentId/edit_comment`,
  commentView.editComment
);

router.get(
  '/news',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin'),
  newsView.getNews
);
router.get(
  '/news/:slug',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin'),
  newsView.getNewsDetails
);

router.get(
  '/announcements',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin'),
  announcementView.getAnnouncementView
);
// router.all(
//   '/announcements/*',
//   authenticationPresenter.protect,
//   authenticationPresenter.restrictTo('student', 'staff', 'admin')
// );

// //------------------
// //----Staff---------
// //------------------
router.get(
  '/create_forum',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('staff'),
  forumView.createForum
);
router.get(
  '/create_topic',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('staff'),
  topicView.createTopic
);
router.get(
  '/create_news',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('staff'),
  newsView.createNews
);
router.get(
  '/create_announcement',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('staff'),
  announcementView.createAnnouncement
);

// //------------------
// //----Admin---------
// //------------------
router.all(
  '/manage_users',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin')
);
router.all(
  '/manage_users/*',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin')
);

// //User Management
router.get('/manage_users', userView.getManageUsersList);
router.get('/manage_users/new_user', userView.createUser);
router.get('/manage_users/:currentUserId/edit_user', userView.editUser);

router.all(
  '/manage_forums',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin')
);
router.all(
  '/manage_forums/*',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin')
);

// Forum management
router.get('/manage_forums', forumView.getManageForumsList);
router.get('/manage_forums/new_forum', forumView.createForum);
router.get('/manage_forums/:forumSlug/edit_forum', forumView.editForum);

//Topic Management
router.get(
  '/manage_forums/:forumSlug/manage_topics',
  topicView.getManageTopicsListByForumSlug
);
router.get(
  '/manage_forums/:forumSlug/manage_topics/new_topic',
  topicView.createTopicByForumSlug
);
router.get(
  '/manage_forums/:forumSlug/manage_topics/:topicSlug/edit_topic',
  topicView.editTopic
);

//Comment Managament
router.get(
  '/manage_forums/:forumSlug/manage_topics/:topicSlug/manage_comments',
  commentView.getManageCommentsListByTopicSlug
);
router.get(
  '/manage_forums/:forumSlug/manage_topics/:topicSlug/manage_comments/new_comment',
  commentView.createComment
);

router.all(
  '/manage_news',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin')
);
router.all(
  '/manage_news/*',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin')
);

// Forum management
router.get('/manage_news', newsView.getManageNewsList);
router.get('/manage_news/new_news', newsView.createNews);
router.get('/manage_news/:newsSlug/edit_news', newsView.editNews);

router.all(
  '/manage_announcements',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin')
);
router.all(
  '/manage_announcements/*',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin')
);

// Announcements management
router.get('/manage_announcements', announcementView.getManageAnnouncementList);
router.get(
  '/manage_announcements/new_announcement',
  announcementView.createAnnouncement
);
router.get(
  '/manage_announcements/:announcementSlug/edit_announcement',
  announcementView.editAnnouncement
);

//------------------
//----Team-Maintenance---------
//------------------

router.all(
  '/manage_maintenance_requests',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('team-maintenance')
);

//Maintenance requests management
router.get(
  '/manage_maintenance_requests',
  maintenanceRequestView.getManageMaintenanceRequestsList
);

module.exports = router;
