const express = require('express');
const topicPresenter = require('./../presenters/TopicPresenter');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
const commentRouter = require('./commentRouter');

const router = express.Router({
  mergeParams: true
});

router.use(
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);
// router.use(topicPresenter.setForumIds, authenticationPresenter.setUserId);

//create comment through topic id
router.use('/:topicId/comments', commentRouter);

router
  .route('/')
  .get(topicPresenter.getAllTopics)
  .post(
    topicPresenter.setForumIds,
    topicPresenter.setUserId,
    authenticationPresenter.restrictTo('staff', 'admin'),
    topicPresenter.createTopic
  );

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

router.route('/slug/:slug').get(topicPresenter.getTopicSlug);

module.exports = router;
