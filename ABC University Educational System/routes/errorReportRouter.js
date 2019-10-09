//Node.js modules to implement
const express = require('express');
//Add presenters to use in the router
const errorReportPresenter = require('../presenters/ErrorReportPresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

//create a router object with Express for (http://127.0.0.1:8000/api/v1/errorReport)
const router = express.Router({
  mergeParams: true
});

//Protect the router to team maintenance
router.use(
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('team-maintenance')
);

// '/' root
router
  .route('/')
  //get all article in the API
  .get(errorReportPresenter.getAllErrorReports)
  //Create a new article, using the set User Id middle ware
  .post(errorReportPresenter.setUserId, errorReportPresenter.createErrorReport);

// '/:id' root get manage the element in the model by Id, such as get one, update and delete by Id
router
  .route('/:id')
  .get(errorReportPresenter.getErrorReport)
  .patch(errorReportPresenter.updateErrorReport)
  .delete(errorReportPresenter.deleteErrorReport);

//export router to app.js
module.exports = router;
