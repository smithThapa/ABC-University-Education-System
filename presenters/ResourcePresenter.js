const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const moment = require('moment');

const catchAsync = require('./../utils/CatchAsync');
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

exports.resources = catchAsync(async (req, res, next) => {
  // const userFilesIds = [];
  // const docs = await Resource.find({ userId: req.user.id });

  // if (docs) {
  //   docs.forEach(doc => {
  //     userFilesIds.push(doc.fileId);
  //   });
  // }

  const files = await gridfsBucket.find().toArray();
  // check if files
  if (
    (!files || files.length === 0) &&
    req._parsedOriginalUrl.pathname.startsWith('/manage_resources')
  ) {
    return res.render('ResourceListView', {
      files: false
    });
  }
  if (!files || files.length === 0) {
    return res.render('ResourceView', {
      files: false
    });
  }

  await Promise.all(
    files.map(async file => {
      if (
        file.contentType === 'image/png' ||
        file.contentType === 'image/jpeg'
      ) {
        file.isImage = true;
      } else {
        file.isImage = false;
      }

      const resource = await Resource.findOne({ fileId: file._id });
      if (resource) {
        file.user = resource.userId;
      }
    })
  );

  if (req._parsedOriginalUrl.pathname === '/manage_resources') {
    return res.render('ResourceListView', {
      files: files,
      user: req.user
      // userFilesIds
    });
  }
  return res.render('ResourceView', {
    files: files,
    user: req.user
    // userFilesIds
  });

  // Resource.find({ userId: req.user.id }, (err, docs) => {
  //   docs.forEach(doc => {
  //     userFilesIds.push(doc.fileId);
  //   });

  //   gridfsBucket
  //     .find()
  //     .toArray((error, files) => {
  //       // check if files
  //       if (
  //         (!files || files.length === 0) &&
  //         req._parsedOriginalUrl.pathname.startsWith('/manage_resources')
  //       ) {
  //         return res.render('ResourceListView', {
  //           files: false
  //         });
  //       }
  //       if (!files || files.length === 0) {
  //         return res.render('ResourceView', {
  //           files: false
  //         });
  //       }
  //       // eslint-disable-next-line array-callback-return
  //       files.map(file => {
  //         if (
  //           file.contentType === 'image/png' ||
  //           file.contentType === 'image/jpeg'
  //         ) {
  //           file.isImage = true;
  //         } else {
  //           file.isImage = false;
  //         }

  //         Resource.where({ fileId: file._id }).findOne((error2, resource) => {
  //           if (resource) console.log('hola');
  //         });

  //         // file.user = resource.userId;
  //       });
  //     })
  //     .exec((error, files) => {
  //       if (req._parsedOriginalUrl.pathname === '/manage_resources') {
  //         return res.render('ResourceListView', {
  //           files: files,
  //           user: req.user,
  //           userFilesIds
  //         });
  //       }
  //       console.log(files);
  //       return res.render('ResourceView', {
  //         files: files,
  //         user: req.user,
  //         userFilesIds
  //       });
  //     });
  // });
});

exports.uploadMulterMiddle = uploadMulter.single('file');

exports.upload = (req, res) => {
  try {
    Resource.create({
      fileId: req.file.id,
      userId: req.user.id
    });

    // console.log(req);
    if (req.baseUrl.startsWith('/manage_resources'))
      res.redirect('/manage_resources');
    else res.redirect('/resources');
  } catch (err) {
    console.log(err.message);
  }
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

exports.getFile = catchAsync(async (req, res, next) => {
  const files = await gridfsBucket
    .find({
      filename: req.params.filename
    })
    .toArray();
  // check if files
  if (!files || files.length === 0) {
    return res.status(404).json({
      err: 'no files exist'
    });
  }
  gridfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
});

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

exports.deleteFile = catchAsync(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // eslint-disable-next-line no-unused-vars
  await gridfsBucket.delete(id, (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
  });

  //delete file from resources
  await Resource.findOneAndDelete({ fileId: id }, (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
  });

  if (req.baseUrl.startsWith('/manage_resources'))
    res.redirect('/manage_resources');
  else res.redirect('/resources');
});

// Accepts the array and key
const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};

exports.getResourceStats = catchAsync(async (req, res, next) => {
  const arrayList = [];

  const arrayMonths = [1, 2, 3, 6, 12];

  await Promise.all(
    arrayMonths.map(async month => {
      const dateQuery = moment()
        .startOf('month')
        .subtract(month - 1, 'months')
        .format();

      //get list with query
      const statsResourceList = await gridfsBucket
        .find({
          uploadDate: { $gt: new Date(dateQuery) }
        })
        .toArray();

      // group by the type
      const resourceStatsGroup = groupBy(statsResourceList, 'contentType');

      //get stats of the array by _id and the total number of resource
      const monthArray = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const key in resourceStatsGroup) {
        if (resourceStatsGroup.hasOwnProperty(key)) {
          //push object
          const objectType = {
            _id: key,
            numResources: resourceStatsGroup[key].length
          };
          monthArray.push(objectType);
        }
      }

      const baseMonthArray = [
        `${month.toString().length === 1 ? `0${month}` : month} Months`,
        monthArray,
        [{ _id: 'Resources', totalNumResources: statsResourceList.length }]
      ];

      arrayList.push(baseMonthArray);
    })
  );

  arrayList.sort();

  // get total values of all
  //get list with query
  const statsResourceList = await gridfsBucket.find().toArray();

  // group by the type
  const resourceStatsGroup = groupBy(statsResourceList, 'contentType');

  //get stats of the array by _id and the total number of resource
  const arrayTotal = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in resourceStatsGroup) {
    if (resourceStatsGroup.hasOwnProperty(key)) {
      //push object
      const objectType = {
        _id: key,
        numResources: resourceStatsGroup[key].length
      };
      arrayTotal.push(objectType);
    }
  }

  const totalMonthArray = [
    `Total`,
    arrayTotal,
    [{ _id: 'Resources', totalNumResources: statsResourceList.length }]
  ];

  arrayList.push(totalMonthArray);

  const statsArrayStandard = factory.standardAggregationArrayExports(arrayList);

  res.status(200).json({
    status: 'success',
    data: {
      data: statsArrayStandard
    }
  });
});
