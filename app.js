const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./utils/GlobalErrorHandler');
const AppError = require('./utils/AppError');

const viewRouter = require('./routes/viewRouter');
const userRouter = require('./routes/userRouter');
const forumRouter = require('./routes/forumRouter');
const topicRouter = require('./routes/topicRouter');
const commentRouter = require('./routes/commentRouter');
const resourceRouter = require('./routes/resourceRouter');

const app = express();

// add pug enginering to log pages
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//server static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
//app.use(helmet());

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
// app.use(
//   express.json({
//     limit: '10kb' //limit of size
//   })
// ); //middleware

// data sanitization -- clean data - NoSQl query injection
app.use(mongoSanitize());

// data sanitization -- aganings XSS
app.use(xss());

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/forums', forumRouter);
app.use('/api/v1/topics', topicRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/resources', resourceRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
