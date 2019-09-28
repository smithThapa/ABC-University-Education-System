// ROUTER FOR THE APPLICATION VIEW

//Node.js modules to implement
const express = require('express');
//Add presennters to use in the router
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
//Router and presenters to use (Resources)
const resourceRouter = require('./resourceRouter');
const resourcePresenter = require('./../presenters/ResourcePresenter');
//View management classes to manage the view routers
const homeView = require('./../views/HomeView');
const forumView = require('./../views/ForumView');
const topicView = require('./../views/TopicView');
const commentView = require('./../views/CommentView');
const announcementView = require('./../views/AnnouncementView');
const newsView = require('./../views/NewsView');
const userView = require('./../views/UserView');
const maintenanceRequestView = require('./../views/MaintenanceRequestView');
const loginInAsView = require('./../views/LoginInAsView');
const errorReportView = require('./../views/ErrorReportView');
const statisticsView = require('./../views/StatisticsView');
const reportGenerationView = require('./../views/ReportGenerationView');

//create a router object with Express for (http://127.0.0.1:8000/)
const router = express.Router();

//----------------------------
//----No Logged Users---------
//----------------------------

// '/' root, start root which chech if the users is logged in to redirect to home page. This root allows users to log in
router.get('/', authenticationPresenter.isLoggedIn, homeView.getLoginPage);

// '/my_details/forgot_password' root to require a new token to access the application
router.get('/my_details/forgot_password', userView.forgotPassword);

// '/my_details/reset_Password/:token' to reset password with the right token in the root
router.get('/my_details/reset_Password/:token', userView.resetPassword);

//----------------------
//----All Users---------
//----------------------

// '/home' root to access first page after log in
router.get('/home', authenticationPresenter.protect, homeView.getHomePage);

// '/my_details/me' root to see personal details
router.get(
  '/my_details/me',
  authenticationPresenter.protect,
  userView.getMyDetails
);

// '/maintenance_request' root to send request of errors in the website
router.get(
  '/maintenance_request',
  authenticationPresenter.protect,
  maintenanceRequestView.getMaintenancePage
);

//-------------------------------------
//----Stundet, Staff and Admin---------
//-------------------------------------

// '/resources' root to access the resource router
router.use(
  '/resources',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin'),
  resourceRouter
);

// '/forums' root protection to all its roots
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

// '/forums' root to see all forums
router.get('/forums', forumView.getForums);
// '/forums/:forumSlug/topics' root to see all topics ijn the forum by its slug
router.get('/forums/:forumSlug/topics', topicView.getTopicsByForumSlug);
// '/forums/:forumSlug/topics/:topicSlug/comments' root to see all comments in a topic by its slug
router.get(
  '/forums/:forumSlug/topics/:topicSlug/comments',
  commentView.getCommentsByTopicSlug
);

// '/forums/:forumSlug/topics/:topicSlug/comments/new_comment' root to create a new comment
router.get(
  `/forums/:forumSlug/topics/:topicSlug/comments/new_comment`,
  commentView.createComment
);
// '/forums/:forumSlug/topics/:topicSlug/comments/:commentId/edit_comment' root to edit a new comment
router.get(
  `/forums/:forumSlug/topics/:topicSlug/comments/:commentId/edit_comment`,
  commentView.editComment
);

// '/news' root to get all news
router.get(
  '/news',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin'),
  newsView.getNews
);
// '/news/:slug' root to a new by its slug
router.get(
  '/news/:slug',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin'),
  newsView.getNewsDetails
);
// '/announcements' root to get all announcements
router.get(
  '/announcements',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin'),
  announcementView.getAnnouncementView
);

// //------------------
// //----Staff---------
// //------------------

// '/create_forum' root to create a forum by staff
router.get(
  '/create_forum',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('staff'),
  forumView.createForum
);
// '/create_topic' root to create a topic by staff
router.get(
  '/create_topic',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('staff'),
  topicView.createTopic
);
// '/create_news' root to create a news by staff
router.get(
  '/create_news',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('staff'),
  newsView.createNews
);
// '/create_announcement' root to create an announcement by staff
router.get(
  '/create_announcement',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('staff'),
  announcementView.createAnnouncement
);

// //------------------
// //----Admin---------
// //------------------

// '/manage_users' root protection to all its roots
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

// 'manage_users' root to get all users
router.get('/manage_users', userView.getManageUsersList);
// 'manage_users/new_user' root to create a new user
router.get('/manage_users/new_user', userView.createUser);
// 'manage_users/:currentUserId/edit_user' root to edit a new by its ID
router.get('/manage_users/:currentUserId/edit_user', userView.editUser);

// '/manage_forums' root protection to all its roots
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

// '/manage_forums' root to get all forums
router.get('/manage_forums', forumView.getManageForumsList);
// '/manage_forums/new_forum' root to create a new forum
router.get('/manage_forums/new_forum', forumView.createForum);
// '/manage_forums/:forumSlug//edit_forum' root to edit a forum by its ID
router.get('/manage_forums/:forumSlug/edit_forum', forumView.editForum);

// '/manage_forums/:forumSlug/manage_topics' root to get all topics
router.get(
  '/manage_forums/:forumSlug/manage_topics',
  topicView.getManageTopicsListByForumSlug
);
// '/manage_forums/:forumSlug/manage_topics/new_topic' root to create a new topic
router.get(
  '/manage_forums/:forumSlug/manage_topics/new_topic',
  topicView.createTopicByForumSlug
);
// '/manage_forums/:forumSlug/manage_topics/:topicSlug/edit_topic' root to edit a topic by its ID
router.get(
  '/manage_forums/:forumSlug/manage_topics/:topicSlug/edit_topic',
  topicView.editTopic
);

// '/manage_forums/:forumSlug/manage_topics/:topicSlug/manage_comments' root to manage comments
router.get(
  '/manage_forums/:forumSlug/manage_topics/:topicSlug/manage_comments',
  commentView.getManageCommentsListByTopicSlug
);
// '/manage_forums/:forumSlug/manage_topics/:topicSlug/manage_comments/new_comment' root to create comment
router.get(
  '/manage_forums/:forumSlug/manage_topics/:topicSlug/manage_comments/new_comment',
  commentView.createComment
);

// '/manage_news' root protection to all its roots
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

// '/manage_news' root to manage news
router.get('/manage_news', newsView.getManageNewsList);
// '/manage_news/new_news' to create a new
router.get('/manage_news/new_news', newsView.createNews);
// '/manage_news/:newsSlug/edit_news' to edit a new by its slug
router.get('/manage_news/:newsSlug/edit_news', newsView.editNews);

// '/manage_announcements' root protection to all its roots
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

// '/manage_announcements' root to manage announcements
router.get('/manage_announcements', announcementView.getManageAnnouncementList);
// '/manage_announcements/new_announcement' to create an announcement
router.get(
  '/manage_announcements/new_announcement',
  announcementView.createAnnouncement
);
// '/manage_announcements/:announcementSlug/edit_announcement' to edit an announcement by its slug
router.get(
  '/manage_announcements/:announcementSlug/edit_announcement',
  announcementView.editAnnouncement
);

// '/manage_resources' to manage resources through resource Router
router.use(
  '/manage_resources',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin'),
  resourceRouter
);

// '/statistics' root to get all statistics by the admin
router.get(
  '/statistics',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin'),
  statisticsView.getStatisticsView
);

// '/report_generation/sendHtml' root to send the stadistics data page to the root as a html string
router.post(
  '/report_generation/sendHtml',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin'),
  reportGenerationView.getResourceStatsByHTML
);

// '/report_generation/:textReport' root to request an specific statistic table to send as a pdf tan to print it out
router.get(
  '/report_generation/:textReport',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin'),
  reportGenerationView.getResourceHtml
);

//-------------------------------------
//----Admin & Team-Maintenance---------
//-------------------------------------

// '/send_notifications' root to send emaqil notification to users by the admin and team-maintenance
router.get(
  '/send_notifications',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin', 'team-maintenance'),
  userView.getSendNotificationPage
);

//-----------------------------
//----Team-Maintenance---------
//-----------------------------

// '/manage_maintenance_requests' root to manage the maintenance request by the team-maintenance
router.get(
  '/manage_maintenance_requests',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('team-maintenance'),
  maintenanceRequestView.getManageMaintenanceRequestsList
);

// '/login_in_as' root to allows team management members to log in as test users
router.get(
  '/login_in_as',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('team-maintenance'),
  loginInAsView.getLoginAsPage
);
// 'login_as_student' root to login as a test student user
router.get(
  '/login_as_student',
  authenticationPresenter.protect,
  loginInAsView.getLoginStudentPage
);
// 'login_as_staff' root to login as a test staff user
router.get(
  '/login_as_staff',
  authenticationPresenter.protect,
  loginInAsView.getLoginStaffPage
);
// 'login_as_admin' root to login as a test admin user
router.get(
  '/login_as_admin',
  authenticationPresenter.protect,
  loginInAsView.getLoginAdminPage
);

// '/error_reports' root to send an error report to the development team and view all error reports sent
router.get(
  '/error_reports',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('team-maintenance'),
  errorReportView.getErrorReportsPage
);

//-----------------------------
//----API Additions------------
//-----------------------------

// '/api/v1/resources/resourceStats' root to get all the resources stats by the admin
router.get(
  '/api/v1/resources/resourceStats',
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('admin'),
  resourcePresenter.getResourceStats
);

// exports router to the app.js
module.exports = router;
