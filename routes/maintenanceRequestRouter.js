//Node.js modules to implement
const express = require('express');
//Add presenters to use in the router
const maintenanceRequestPresenter = require('../presenters/MaintenanceRequestPresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

//create a router object with Express for (http://127.0.0.1:8000/api/v1/topics)
const router = express.Router({
  mergeParams: true
});

//Protect the router to any user who is logged in
router.use(authenticationPresenter.protect);

// '/' root
router
  .route('/')
  //get all maintenanceRequests in the API by team maintenance
  .get(
    authenticationPresenter.restrictTo('team-maintenance'),
    maintenanceRequestPresenter.getAllMaintenanceRequests
  )
  //Create a new forum, using the set User Id middle ware
  .post(
    maintenanceRequestPresenter.setUserId,
    maintenanceRequestPresenter.createMaintenanceRequest
  );

// '/:id' root get manage the element in the model by Id, such as get one, update and delete by Id (by team maintenance)
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

//export router to the app.js
module.exports = router;
