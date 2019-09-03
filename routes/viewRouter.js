const express = require('express');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
const viewPresenter = require('./../presenters/ViewPresenter');

const router = express.Router();

router.get('/', viewPresenter.getLoginPage);

router.get(
  '/home',
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  viewPresenter.getHomePage
);

module.exports = router;
