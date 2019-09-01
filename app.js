const path = require('path');
const express = require('express');

const app = express();

// add pug enginering to log pages
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//server static files
app.use(express.static(path.join(__dirname, 'public')));

const router = express.Router();

router.get('/home', (req, res, next) => {
  res.status(200).render('HomeView', {
    title: 'Home'
  });
});
router.get('/', (req, res, next) => {
  res.status(200).render('LoginView', {
    title: 'Login'
  });
});

app.use('/', router);

module.exports = app;
