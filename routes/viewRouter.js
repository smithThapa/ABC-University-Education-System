const express = require('express');
// const mongoose = require('mongoose');
// const GridFsStorage = require('multer-gridfs-storage');
// const multer = require('multer');
// const path = require('path');
// const crypto = require('crypto');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
const viewPresenter = require('./../presenters/ViewPresenter');
const resourcePresenter = require('./../presenters/ResourcePresenter');

const router = express.Router();

//Start
router.get('/', viewPresenter.getLoginPage);

router.get(
  '/home',
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  viewPresenter.getHomePage
);

//Forum page
router.use(
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

router.get('/forums', viewPresenter.getForumView);

// Resources
router.get(
  '/resources',
  authenticationPresenter.protect,
  resourcePresenter.resources
);
router.post(
  '/upload',
  authenticationPresenter.protect,
  resourcePresenter.uploadMulterMiddle,
  resourcePresenter.upload
);

router.get('/files', authenticationPresenter.protect, resourcePresenter.files);

router.get(
  '/files/:filename',
  authenticationPresenter.protect,
  resourcePresenter.getFile
);

router.get(
  '/image/:filename',
  authenticationPresenter.protect,
  resourcePresenter.getImage
);

router.post(
  '/files/del/:id',
  authenticationPresenter.protect,
  resourcePresenter.deleteFile
);

module.exports = router;
