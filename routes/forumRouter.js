const express = require('express');
const forumPresenter = require('./../presenters/ForumPresenter');
const topicRouter = require('./topicRouter');
const commentRouter = require('./commentRouter');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');

const router = express.Router();

//protect the creation
router.use(authenticationPresenter.protect);

//create topic through forum id
router.use('/:forumId/topics', topicRouter);
//create comment through forum and topci ids
router.use('/:forumId/topics/:topicId/comments', commentRouter);

//restrict data to student, staff and administrators
router.use(authenticationPresenter.restrictTo('student', 'staff', 'admin'));

router
  .route('/')
  .get(forumPresenter.getAllForums)
  .post(
    authenticationPresenter.setUserId,
    authenticationPresenter.restrictTo('staff', 'admin'),
    forumPresenter.createForum
  );

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

module.exports = router;
