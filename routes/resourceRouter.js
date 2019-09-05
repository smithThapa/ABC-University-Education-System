const express = require('express');
const resourcePresenter = require('../presenters/ResourcePresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

const router = express.Router();

router.get('/', authenticationPresenter.protect, resourcePresenter.resources);
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
