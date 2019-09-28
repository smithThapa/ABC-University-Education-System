//Node.js modules to implement
const express = require('express');
//Add presennters to use in the router
const commentPresenter = require('./../presenters/CommentPresenter');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');

//create a router object with Express for (http://127.0.0.1:8000/api/v1/comments)
const router = express.Router({
  mergeParams: true
});

//Proptect the router to students, staff and admin
router.use(
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

// '/' root
router
  .route('/')
  //get all comments in the API
  .get(commentPresenter.getAllComments)
  //Create a new comment, using the set User and Forum Ids middleware
  .post(
    commentPresenter.setUserId,
    commentPresenter.setForumAndTopicIds,
    commentPresenter.createComment
  );

// '/:id' root get manage the element in the model by Id, such as get one, update and delete by Id
router
  .route('/:id')
  .get(commentPresenter.getComment)
  .patch(commentPresenter.updateComment)
  .delete(commentPresenter.deleteComment);

//export router to app.js
module.exports = router;
