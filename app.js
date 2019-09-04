const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
// const crypto = require('crypto');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');

const globalErrorHandler = require('./utils/GlobalErrorHandler');

const viewRouter = require('./routes/viewRouter');
const userRouter = require('./routes/userRouter');
const forumRouter = require('./routes/forumRouter');
const topicRouter = require('./routes/topicRouter');
const commentRouter = require('./routes/commentRouter');
// const resourceRouter = require('./routes/resourceRouter');
// const authenticationPresenter = require('./presenters/AuthenticationPresenter');

const app = express();

// const router = express.Router();

// add pug enginering to log pages
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//server static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(helmet());

//limite the number of requers into the api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //1 hour
  message: 'Too many request from this IP, please try again in an hour!'
});

app.use('/api', limiter);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//body parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
//   app.use(
//     express.json({
//       limit: '10kb' //limit of size
//     })
//   ); //middleware

// data sanitization -- clean data - NoSQl query injection
app.use(mongoSanitize());

// data sanitization -- aganings XSS
app.use(xss());

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/forums', forumRouter);
app.use('/api/v1/topics', topicRouter);
app.use('/api/v1/comments', commentRouter);
// app.use('/api/v1/resources', resourceRouter);

app.use(globalErrorHandler);

module.exports = app;
