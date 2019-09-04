const express = require('express');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const authenticationPresenter = require('./../presenters/AuthenticationPresenter');
const viewPresenter = require('./../presenters/ViewPresenter');

const router = express.Router();

router.get('/', viewPresenter.getLoginPage);

router.get(
  '/home',
  authenticationPresenter.protect,
  authenticationPresenter.isLoggedIn,
  viewPresenter.getHomePage
);

// DB

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// const mongoURI =
//   'mongodb+srv://smith:ruKRpUnjUsqudD5A@cluster0-jbhsh.mongodb.net/ABCUniversityFileSystem?retryWrites=true&w=majority';

// connection
const conn = mongoose.createConnection(DB, {
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
  url: DB,
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
router.use(authenticationPresenter.protect);
router.get('/resources', (req, res) => {
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

router.post('/upload', upload.single('file'), (req, res) => {
  // res.json({file : req.file})
  res.redirect('/resources');
});

router.get('/files', (req, res) => {
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

router.get('/files/:filename', (req, res) => {
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

router.get('/image/:filename', (req, res) => {
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

router.post('/files/del/:id', (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  gfs.delete(id, (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
  });

  res.redirect('/resources');
});

module.exports = router;
