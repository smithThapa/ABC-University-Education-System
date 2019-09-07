const express = require('express');

const maintenanceRequestPresenter = require('../presenters/MaintenanceRequestPresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

const router = express.Router({
  mergeParams: true
});

router.use(authenticationPresenter.protect);

router
  .route('/')
  .get(maintenanceRequestPresenter.getAllMaintenanceRequests)
  .post(maintenanceRequestPresenter.createMaintenanceRequest);

router
  .route('/:id')
  .get(maintenanceRequestPresenter.getMaintenanceRequest)
  .delete(maintenanceRequestPresenter.deleteMaintenanceRequest);

module.exports = router;
