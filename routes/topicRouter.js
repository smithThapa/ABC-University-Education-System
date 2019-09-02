const express = require('express');
const topicPresenter = require('./../presenters/TopicPresenter');

const router = express.Router({
  mergeParams: true
});

router.use(topicPresenter.setForumIds);

router
  .route('/')
  .get(topicPresenter.getAllTopics)
  .post(topicPresenter.createTopic);

router
  .route('/:id')
  .get(topicPresenter.getTopic)
  .patch(topicPresenter.updateTopic)
  .delete(topicPresenter.deleteTopic);

module.exports = router;
