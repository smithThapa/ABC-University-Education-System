//Node.js modules to implement
const express = require('express');
//Add presennters to use in the router
const forumPresenter = require('./../presenters/ForumPresenter');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
//Add routers to implement creation of collection related
const topicRouter = require('./topicRouter');
const commentRouter = require('./commentRouter');

//create a router object with Express for (http://127.0.0.1:8000/api/v1/forums)
const router = express.Router();

//Proptect the router to students, staff and admin
router.use(
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

// '/:forumId/topics' root to manage topics by adding the forum id in the root
router.use('/:forumId/topics', topicRouter);
// '/:forumId/topics/:topicId/comments' root to manage comments by adding the forum and topic ids in the root
router.use('/:forumId/topics/:topicId/comments', commentRouter);

// '/' root
router
  .route('/')
  //get all forums in the API
  .get(forumPresenter.getAllForums)
  //Create a new forum, using the set User Id middleware (staff and admin))
  .post(
    forumPresenter.setUserId,
    authenticationPresenter.restrictTo('staff', 'admin'),
    forumPresenter.createForum
  );

// 'forumStats' root of the system to get all statistics of the forum (only Admin)
router.get(
  '/forumStats',
  authenticationPresenter.restrictTo('admin'),
  forumPresenter.getForumStats
);

// '/:id' root get manage the element in the model by Id, such as get one, update and delete by Id
router
  .route('/:id')
  .get(forumPresenter.getForum)
  .patch(
    authenticationPresenter.restrictTo('admin'),
    forumPresenter.updateForum
  )
  .delete(
    authenticationPresenter.restrictTo('admin'),
    forumPresenter.deleteForum
  );

// 'slug/:slug' root to get one element by its slug
router.route('/slug/:slug').get(forumPresenter.getForumSlug);

//export router to the app.js
module.exports = router;
