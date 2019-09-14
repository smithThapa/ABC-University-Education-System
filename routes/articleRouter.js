const express = require('express');
const articlePresenter = require('../presenters/ArticlePresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

const router = express.Router({
  mergeParams: true
});

//protect the creation
router.use(
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

router
  .route('/')
  .get(articlePresenter.getAllArticles)
  .post(
    articlePresenter.setUserId,
    authenticationPresenter.restrictTo('staff', 'admin'),
    articlePresenter.createArticle
  );

router.route('/stats').get(articlePresenter.getArticleStats);

router.route('/news').get(articlePresenter.getAllNews);
router.route('/announcements').get(articlePresenter.getAllAnnouncements);

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

router.route('/slug/:slug').get(articlePresenter.getArticleSlug);

module.exports = router;
