const express = require('express');
const forumPresenter = require('./../presenters/ForumPresenter');
const topicRouter = require('./topicRouter');
const commentRouter = require('./commentRouter');

const router = express.Router();

//create topic through forum id
router.use('/:forumId/topics', topicRouter);
//create comment through forum and topci ids
router.use('/:forumId/topics/:topicId/comments', commentRouter);

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
