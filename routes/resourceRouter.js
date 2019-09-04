const express = require('express');
const resourcePresenter = require('../presenters/ResourcePresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

const router = express.Router({
  mergeParams: true
});

router.use(authenticationPresenter.protect);
router
  .route('/')
  .get(resourcePresenter.getAllResources)
  .post(resourcePresenter.upload, resourcePresenter.uploadResource);

module.exports = router;
