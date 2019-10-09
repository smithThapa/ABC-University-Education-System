//Node.js modules to implement
const express = require('express');
//Add presenters to use in the router
const articlePresenter = require('../presenters/ArticlePresenter');
const authenticationPresenter = require('../presenters/AuthenticationPresenter');

//create a router object with Express for (http://127.0.0.1:8000/api/v1/articles)
const router = express.Router({
  mergeParams: true
});

//Protect the router to students, staff and admin
router.use(
  authenticationPresenter.protect,
  authenticationPresenter.restrictTo('student', 'staff', 'admin')
);

// '/' root
router
  .route('/')
  //get all article in the API
  .get(articlePresenter.getAllArticles)
  //Create a new article, using the set User Id middle ware (staff and admin)
  .post(
    articlePresenter.setUserId,
    authenticationPresenter.restrictTo('staff', 'admin'),
    articlePresenter.createArticle
  );

// 'stats' root to get the number of announcements and news in the articles
router.route('/stats').get(articlePresenter.getArticleType);

// 'announcements' and 'news' roots to get all articles by type
router.route('/news').get(articlePresenter.getAllNews);
router.route('/announcements').get(articlePresenter.getAllAnnouncements);

// '/articleStats' root of the system to get all statistics of the article (only Admin)
router
  .route('/articleStats')
  .get(
    authenticationPresenter.restrictTo('admin'),
    articlePresenter.getArticleStats
  );

// '/:id' root get manage the element in the model by Id, such as get one, update and delete by Id
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

// 'slug/:slug' root to get one element by its slug
router.route('/slug/:slug').get(articlePresenter.getArticleSlug);

//export router to the app.js
module.exports = router;
