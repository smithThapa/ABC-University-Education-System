const express = require('express');
const forumPresenter = require('./../presenters/ForumPresenter');

const router = express.Router();

router.route('/').post(forumPresenter.createForum);

module.exports = router;
