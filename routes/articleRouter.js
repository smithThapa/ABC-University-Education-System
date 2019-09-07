const express = require('express');

const articlePresenter = require('../presenters/ArticlePresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

const router = express.Router({
  mergeParams: true
});

router.use(authenticationPresenter.protect);

router
  .route('/')
  .get(articlePresenter.getAllArticles)
  .post(
    authenticationPresenter.restrictTo('staff', 'admin'),
    articlePresenter.createArticle
  );

router
  .route('/:id')
  .get(articlePresenter.getArticle)
  .patch(
    authenticationPresenter.restrictTo('admin'),
    articlePresenter.updateArticle
  )
  .delete(
    authenticationPresenter.restrictTo('admin'),
    articlePresenter.deleteArticle
  );

module.exports = router;
