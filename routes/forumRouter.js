const express = require('express');
const forumPresenter = require('./../presenters/ForumPresenter');

const router = express.Router();

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
