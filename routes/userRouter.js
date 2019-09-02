const express = require('express');
// const userPresenter = require('./../presenters/UserPresenter');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');

const router = express.Router();

router.route('/signup').post(authenticationPresenter.signup);

module.exports = router;
