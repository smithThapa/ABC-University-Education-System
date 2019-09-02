const express = require('express');
const commentPresenter = require('./../presenters/CommentPresenter');

const router = express.Router({
  mergeParams: true
});

router.use(commentPresenter.setForumAndTopicIds);

router
  .route('/')
  .get(commentPresenter.getAllComments)
  .post(commentPresenter.createComment);

router
  .route('/:id')
  .get(commentPresenter.getComment)
  .patch(commentPresenter.updateComment)
  .delete(commentPresenter.deleteComment);

module.exports = router;
