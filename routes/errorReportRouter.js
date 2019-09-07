const express = require('express');

const errorReportPresenter = require('../presenters/ErrorReportPresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

const router = express.Router({
  mergeParams: true
});

router.use(authenticationPresenter.protect);
router.use(authenticationPresenter.restrictTo('admin', 'team-maintenance'));

router
  .route('/')
  .get(errorReportPresenter.getAllErrorReports)
  .post(errorReportPresenter.createErrorReport);

router
  .route('/:id')
  .get(errorReportPresenter.getErrorReport)
  .patch(errorReportPresenter.updateErrorReport)
  .delete(errorReportPresenter.deleteErrorReport);

module.exports = router;
