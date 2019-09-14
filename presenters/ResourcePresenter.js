const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const AppError = require('./../utils/AppError');
const Resource = require('../models/ResourceModel');
const factory = require('./HandlerFactory');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// get connection of db
const connection = mongoose.connection.on('error', err => {
  return new AppError(err.message, 404);
});
// mongoose.createConnection(DB, {
//   useNewUrlParser: true
// });

// init gridfsBucket
let gridfsBucket;
connection.once('open', () => {
  // init stream
  gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
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
        //const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: file.originalname,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const uploadMulter = multer({
  storage
});

exports.resources = (req, res) => {
  const userFilesIds = [];
  Resource.find({ userId: req.user.id }, (err, docs) => {
    docs.forEach(doc => {
      userFilesIds.push(doc.fileId);
    });

    gridfsBucket.find().toArray((error, files) => {
      // check if files
      if (!files || files.length === 0) {
        return res.render('ResourceView', {
          files: false
        });
      }
      // eslint-disable-next-line array-callback-return
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
      return res.render('ResourceView', {
        files: files,
        user: req.user,
        userFilesIds
      });
    });
  });
};

exports.uploadMulterMiddle = uploadMulter.single('file');

exports.upload = (req, res) => {
  Resource.create({
    fileId: req.file.id,
    userId: req.user.id
  });
  res.redirect('/resources');
};

exports.files = (req, res) => {
  gridfsBucket.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist'
      });
    }

    return res.json(files);
  });
};

exports.getFile = (req, res) => {
  gridfsBucket
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

      gridfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
    });
};

exports.getImage = (req, res) => {
  // console.log('id', req.params.id)
  gridfsBucket
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'no files exist'
        });
      }
      gridfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
    });
};

exports.deleteFile = (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // eslint-disable-next-line no-unused-vars
  gridfsBucket.delete(id, (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
  });

  res.redirect('/resources');
};
