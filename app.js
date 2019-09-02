const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// const userRouter = require('./routes/userRouter');
const forumRouter = require('./routes/forumRouter');
const topicRouter = require('./routes/topicRouter');

const app = express();

// const router = express.Router();

// add pug enginering to log pages
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//server static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// router.get('/home', (req, res, next) => {
//   res.status(200).render('HomeView', {
//     title: 'Home'
//   });
// });
// router.get('/', (req, res, next) => {
//   res.status(200).render('LoginView', {
//     title: 'Login'
//   });
// });

// app.use('/', router);
// app.use('/api/v1/users', userRouter);
app.use('/api/v1/forums', forumRouter);
app.use('/api/v1/topics', topicRouter);

module.exports = app;
