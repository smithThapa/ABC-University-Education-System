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

router.get('/', viewPresenter.getLoginPage);

router.get(
  '/home',
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  viewPresenter.getHomePage
);

module.exports = router;
