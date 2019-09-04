const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

// app.set('view engine', 'ejs');

// DB
// dotenv.config({ path: './config.env' });
// const DB_URI = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

const DB_URI =
  'mongodb+srv://smith:ruKRpUnjUsqudD5A@cluster0-jbhsh.mongodb.net/ABCUniversityFileSystem?retryWrites=true&w=majority';

async function DBconnection() {
  // connection
  const conn = mongoose.createConnection(DB_URI, {
    useNewUrlParser: true
  });

  // init gfs
  let gfs;
  await conn.once('open', () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
  });
  return gfs;
}

// Storage
const storage = new GridFsStorage({
  url: DB_URI,
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

exports.getAllResources = async (req, res, next) => {
  const gfs = await DBconnection();
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.render('index', {
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
    return res.status(200).render('resource_page', {
      title: 'YOLO',
      files: files
    });

    // return res.json(files);
  });
};

exports.upload = async (req, res, next) => {
  await DBconnection();
  upload.single('file');
  next();
};

exports.uploadResource = async (req, res, next) => {
  res.redirect('/api/v1/resources');
};

// app.post('/upload', upload.single('file'), (req, res) => {
//   // res.json({file : req.file})
//   res.redirect('/');
// });

// app.get('/files', (req, res) => {
//   gfs.find().toArray((err, files) => {
//     // check if files
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         err: 'no files exist'
//       });
//     }

//     return res.json(files);
//   });
// });

// app.get('/files/:filename', (req, res) => {
//   gfs
//     .find({
//       filename: req.params.filename
//     })
//     .toArray((err, files) => {
//       // check if files
//       if (!files || files.length === 0) {
//         return res.status(404).json({
//           err: 'no files exist'
//         });
//       }

//       gfs.openDownloadStreamByName(req.params.filename).pipe(res);
//     });
// });

// app.get('/image/:filename', (req, res) => {
//   // console.log('id', req.params.id)
//   gfs
//     .find({
//       filename: req.params.filename
//     })
//     .toArray((err, files) => {
//       if (!files || files.length === 0) {
//         return res.status(404).json({
//           err: 'no files exist'
//         });
//       }
//       gfs.openDownloadStreamByName(req.params.filename).pipe(res);
//     });
// });

// app.post('/files/del/:id', (req, res) => {
//   const id = mongoose.Types.ObjectId(req.params.id);
//   gfs.delete(id, (err, data) => {
//     if (err) return res.status(404).json({ err: err.message });
//   });

//   res.redirect('/');
// });
