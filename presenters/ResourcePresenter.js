const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connection = mongoose.createConnection(DB, {
  useNewUrlParser: true
});

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

const uploadMulter = multer({
  storage
});

exports.resources = (req, res) => {
  gridfsBucket.find().toArray((err, files) => {
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
      files: files
    });
  });
};

// app.post('/upload', upload.single('file'), (req, res) => {
// res.json({file : req.file})
//   res.redirect('/api/v1/resources');
// });

exports.uploadMulterMiddle = uploadMulter.single('file');

exports.upload = (req, res) => {
  // uploadMulter.single('file');
  console.log(req.file);
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
