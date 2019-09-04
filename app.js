const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const globalErrorHandler = require('./utils/GlobalErrorHandler');

const viewRouter = require('./routes/viewRouter');
const userRouter = require('./routes/userRouter');
const forumRouter = require('./routes/forumRouter');
const topicRouter = require('./routes/topicRouter');
const commentRouter = require('./routes/commentRouter');
const resourceRouter = require('./routes/resourceRouter');
const authenticationPresenter = require('./presenters/AuthenticationPresenter');

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

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/forums', forumRouter);
app.use('/api/v1/topics', topicRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/resources', resourceRouter);

// DB
const mongoURI =
  'mongodb+srv://smith:ruKRpUnjUsqudD5A@cluster0-jbhsh.mongodb.net/ABCUniversityFileSystem?retryWrites=true&w=majority';

// connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true
});

// init gfs
let gfs;
conn.once('open', () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

// Storage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({
  storage
});

// get / page
app.use(authenticationPresenter.protect);
app.get('/resources', (req, res) => {
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.render('resource_page', {
        files: false
      });
    }
    files.map(file => {
      if (
        file.contentType === 'image/png' ||
        file.contentType === 'image/jpeg'
      ) {
        file.isImage = true;
      } else {
        file.isImage = false;
      }
    });
    return res.render('resource_page', {
      files: files
    });
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  // res.json({file : req.file})
  res.redirect('/api/v1/resources');
});

app.get('/files', (req, res) => {
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist'
      });
    }

    return res.json(files);
  });
});

app.get('/files/:filename', (req, res) => {
  gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      // check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'no files exist'
        });
      }

      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

app.get('/image/:filename', (req, res) => {
  // console.log('id', req.params.id)
  gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'no files exist'
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

app.post('/files/del/:id', (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  gfs.delete(id, (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
  });

  res.redirect('/resources');
});

app.use(globalErrorHandler);

module.exports = app;
