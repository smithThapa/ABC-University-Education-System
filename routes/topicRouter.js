//Node.js modules to implement
const express = require('express');
//Add presennters to use in the router
const topicPresenter = require('./../presenters/TopicPresenter');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
//Add routers to implement creation of collection related
const commentRouter = require('./commentRouter');

//create a router object with Express for (http://127.0.0.1:8000/api/v1/topics)
const router = express.Router({
  mergeParams: true
});

//Proptect the router to students, staff and admin
router.use(
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

// '/:topicId/comments' root to manage comments by adding the topic id in the root
router.use('/:topicId/comments', commentRouter);

// '/' root
router
  .route('/')
  //get all topics in the API
  .get(topicPresenter.getAllTopics)
  //Create a new article, using the set User and Forum Ids middleware (staff and admin)
  .post(
    topicPresenter.setForumIds,
    topicPresenter.setUserId,
    authenticationPresenter.restrictTo('staff', 'admin'),
    topicPresenter.createTopic
  );

// '/topicStats' root of the system to get all statistics of the topics (only Admin)
router.get(
  '/topicStats',
  authenticationPresenter.restrictTo('admin'),
  topicPresenter.getTopicStats
);

// '/:id' root get manage the element in the model by Id, such as get one, update and delete by Id
router
  .route('/:id')
  .get(topicPresenter.getTopic)
  .patch(
    authenticationPresenter.restrictTo('admin'),
    topicPresenter.updateTopic
  )
  .delete(
    authenticationPresenter.restrictTo('admin'),
    topicPresenter.deleteTopic
  );

// 'slug/:slug' root to get one element by its slug
router.route('/slug/:slug').get(topicPresenter.getTopicSlug);

//export router to the app.js
module.exports = router;
