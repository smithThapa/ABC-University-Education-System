//Node.js modules to implement
const express = require('express');
//Add presennters to use in the router
const resourcePresenter = require('../presenters/ResourcePresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

//create a router object with Express for (http://127.0.0.1:8000/resources)
const router = express.Router();

// '/' root to get all resources
router.get('/', authenticationPresenter.protect, resourcePresenter.resources);

// '/upload' root to upload a file, protect to all
router.post(
  '/upload',
  authenticationPresenter.protect,
  resourcePresenter.uploadMulterMiddle,
  resourcePresenter.upload
);

// '/files' root to send file protected
router.get('/files', authenticationPresenter.protect, resourcePresenter.files);

// '/files/:filename' root to get file by fineName
router.get(
  '/files/:filename',
  authenticationPresenter.protect,
  resourcePresenter.getFile
);

// '/image/:filename' root to get an image by its name
router.get(
  '/image/:filename',
  authenticationPresenter.protect,
  resourcePresenter.getImage
);

// '/files/del/:id' root to delete a file by id
router.post(
  '/files/del/:id',
  authenticationPresenter.protect,
  resourcePresenter.deleteFile
);

//export router in app.js
module.exports = router;
