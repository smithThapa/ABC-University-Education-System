// Node.js modules to use
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
// utilities to use
const globalErrorHandler = require('./utils/GlobalErrorHandler');
const AppError = require('./utils/AppError');
// Router to attach in the app
const viewRouter = require('./routes/viewRouter');
const userRouter = require('./routes/userRouter');
const forumRouter = require('./routes/forumRouter');
const topicRouter = require('./routes/topicRouter');
const commentRouter = require('./routes/commentRouter');
const articleRouter = require('./routes/articleRouter');
const errorReportRouter = require('./routes/errorReportRouter');
const maintenanceRequestRouter = require('./routes/maintenanceRequestRouter');

//create the app object with express
const app = express();

// add pug engine to log pages
app.set('view engine', 'pug');
//direction of where are the pug files
app.set('views', path.join(__dirname, 'views', 'pages'));
//implement moment module to the front-end application
app.locals.moment = require('moment');

//server static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
//app.use(helmet());

//limit the number of requests into the api
const limiter = rateLimit({
  max: 2000,
  windowMs: 60 * 60 * 1000, //1 hour
  message: 'Too many request from this IP, please try again in an hour!'
});

//limit the api request
app.use('/api', limiter);
//limit size packages in the app
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
//add cookies parser in the application
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

// data sanitization -- against XSS
app.use(xss());

//set favicon to the application
app.use(favicon(`${__dirname}/public/img/favicon.ico`));

// API routers to manage the mongodb
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/forums', forumRouter);
app.use('/api/v1/topics', topicRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/errorReports', errorReportRouter);
app.use('/api/v1/maintenanceRequests', maintenanceRequestRouter);

//set all view router to the front-end
app.use('/', viewRouter);
// add to all no defined pages the AppError to display the no existence of the current page
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

//ad globalErrorHandler to get extra error handling
app.use(globalErrorHandler);

// export the app to be used in the server
module.exports = app;
