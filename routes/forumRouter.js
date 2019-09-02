const express = require('express');
const forumPresenter = require('./../presenters/ForumPresenter');
const topicRouter = require('./topicRouter');

const router = express.Router();

//create topic through forum id
router.use('/:forumId/topics', topicRouter);

router
  .route('/')
  .get(forumPresenter.getAllForums)
  .post(forumPresenter.createForum);

router
  .route('/:id')
  .get(forumPresenter.getForum)
  .patch(forumPresenter.updateForum)
  .delete(forumPresenter.deleteForum);

module.exports = router;
