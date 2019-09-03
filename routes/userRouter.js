const express = require('express');
// const userPresenter = require('./../presenters/UserPresenter');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');

const router = express.Router();

// Sign up user, log in and out of users
router.post('/signup', authenticationPresenter.signup);
router.post('/login', authenticationPresenter.login);
router.get('/logout', authenticationPresenter.logout);

//Add protection to all following routers
router.use(authenticationPresenter.protect);

router.patch('/updateMyPassword', authenticationPresenter.updatePassword);

module.exports = router;
