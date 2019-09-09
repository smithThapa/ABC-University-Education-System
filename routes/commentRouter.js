const express = require('express');
const commentPresenter = require('./../presenters/CommentPresenter');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');

const router = express.Router({
  mergeParams: true
});

router.use(
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

router
  .route('/')
  .get(commentPresenter.getAllComments)
  .post(
    commentPresenter.setUserId,
    commentPresenter.setForumAndTopicIds,
    commentPresenter.createComment
  );

router
  .route('/:id')
  .get(commentPresenter.getComment)
  .patch(commentPresenter.updateComment)
  .delete(
    authenticationPresenter.restrictTo('admin'),
    commentPresenter.deleteComment
  );

module.exports = router;
