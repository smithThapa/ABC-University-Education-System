const express = require('express');

const maintenanceRequestPresenter = require('../presenters/MaintenanceRequestPresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

const router = express.Router({
  mergeParams: true
});

router.use(authenticationPresenter.protect);

router
  .route('/')
  .get(
    authenticationPresenter.restrictTo('team-maintenance'),
    maintenanceRequestPresenter.getAllMaintenanceRequests
  )
  .post(
    maintenanceRequestPresenter.setUserId,
    maintenanceRequestPresenter.createMaintenanceRequest
  );

router
  .route('/:id')
  .get(
    authenticationPresenter.restrictTo('team-maintenance'),
    maintenanceRequestPresenter.getMaintenanceRequest
  )
  .patch(
    authenticationPresenter.restrictTo('team-maintenance'),
    maintenanceRequestPresenter.updateMaintenanceRequest
  )
  .delete(
    authenticationPresenter.restrictTo('team-maintenance'),
    maintenanceRequestPresenter.deleteMaintenanceRequest
  );

module.exports = router;
