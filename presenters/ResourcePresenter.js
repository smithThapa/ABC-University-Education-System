/* eslint-disable no-unused-vars */
//Node.js modules to user
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const moment = require('moment');
//models to users
const Resource = require('../models/ResourceModel');
//factory to manage the module
const factory = require('./HandlerFactory');
//utilities of the application
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');

//get DB connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// get connection of db
const connection = mongoose.connection.on('error', err => {
  return new AppError(err.message, 404);
});

// initialize gridfsBucket
let gridfsBucket;
//connect to the database and assign gridfsBucket to upload collections
connection.once('open', () => {
  // initialize stream
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

//middle ware to store the files with multre
const uploadMulter = multer({
  storage
});

exports.resources = catchAsync(async (req, res, next) => {
  //get all resources
  const files = await gridfsBucket.find().toArray();

  // check if files and the URL com from the manage_resources
  if (
    (!files || files.length === 0) &&
    req._parsedOriginalUrl.pathname.startsWith('/manage_resources')
  ) {
    return res.render('ResourceListView', {
      files: false
    });
  } //if the request comes from the resource URL
  if (!files || files.length === 0) {
    return res.render('ResourceView', {
      files: false
    });
  }

  //wait all the files
  await Promise.all(
    //iterate through all files
    files.map(async file => {
      //f the file is an image, assign the attribute to image
      if (
        file.contentType === 'image/png' ||
        file.contentType === 'image/jpeg'
      ) {
        file.isImage = true;
      } else {
        file.isImage = false;
      }

      //get the file from the resource model and assign the user in the file object
      const resource = await Resource.findOne({ fileId: file._id });
      if (resource) {
        file.user = resource.userId;
      }
    })
  );

  //response to manage_resources URL
  if (req._parsedOriginalUrl.pathname === '/manage_resources') {
    return res.render('ResourceListView', {
      files: files,
      user: req.user
    });
  }
  //response to resources URL
  return res.render('ResourceView', {
    files: files,
    user: req.user
    // userFilesIds
  });
});

//upload the file with multer middle ware
exports.uploadMulterMiddle = uploadMulter.single('file');

//function to upload the file
exports.upload = (req, res) => {
  try {
    //create the resource record in the database to connect file and user
    Resource.create({
      fileId: req.file.id,
      userId: req.user.id
    });

    //is the URL to return the the right one
    if (req.baseUrl.startsWith('/manage_resources'))
      res.redirect('/manage_resources');
    else res.redirect('/resources');
  } catch (err) {
    console.log(err.message);
  }
};

//get the file from the gridfsBucket
exports.files = (req, res) => {
  gridfsBucket.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist'
      });
    }
    //response as JSON
    return res.json(files);
  });
};

//get file
exports.getFile = catchAsync(async (req, res, next) => {
  //query by the filename
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
  //open stream to download
  gridfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
});

//case the file is object
exports.getImage = (req, res) => {
  //query files
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
      //open stream to download
      gridfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
    });
};

//delete the file
exports.deleteFile = catchAsync(async (req, res, next) => {
  //get the id
  const id = mongoose.Types.ObjectId(req.params.id);
  // eslint-disable-next-line no-unused-vars
  await gridfsBucket.delete(id, (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
  });

  //delete file from resources (reduce wrong data)
  await Resource.findOneAndDelete({ fileId: id }, (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
  });

  //redirect user to the right URL
  if (req.baseUrl.startsWith('/manage_resources'))
    res.redirect('/manage_resources');
  else res.redirect('/resources');
});

// Accepts the array and key to group the array by the keys
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

//get resource stats
exports.getResourceStats = catchAsync(async (req, res, next) => {
  //empty array to return
  const arrayList = [];

  //months to query
  const arrayMonths = [1, 2, 3, 6, 12];

  //await all months first
  await Promise.all(
    //iterate over all months
    arrayMonths.map(async month => {
      //get the data of the first date of the month to query
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

      // group by the type the array
      const resourceStatsGroup = groupBy(statsResourceList, 'contentType');

      //get stats of the array by _id and the total number of resource
      const monthArray = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const key in resourceStatsGroup) {
        // eslint-disable-next-line no-prototype-builtins
        if (resourceStatsGroup.hasOwnProperty(key)) {
          //push object
          const objectType = {
            _id: key,
            numResources: resourceStatsGroup[key].length
          };
          monthArray.push(objectType);
        }
      }

      //array of each month
      const baseMonthArray = [
        `${month.toString().length === 1 ? `0${month}` : month} Months`,
        monthArray,
        [{ _id: 'Resources', totalNumResources: statsResourceList.length }]
      ];
      //ad the array to the array to return
      arrayList.push(baseMonthArray);
    })
  );

  //sort array before add total
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
    // eslint-disable-next-line no-prototype-builtins
    if (resourceStatsGroup.hasOwnProperty(key)) {
      //push object
      const objectType = {
        _id: key,
        numResources: resourceStatsGroup[key].length
      };
      arrayTotal.push(objectType);
    }
  }

  //total array with all values
  const totalMonthArray = [
    `Total`,
    arrayTotal,
    [{ _id: 'Resources', totalNumResources: statsResourceList.length }]
  ];

  //push the total to the end of the array
  arrayList.push(totalMonthArray);

  //standard the array to avoid missing data
  const statsArrayStandard = factory.standardAggregationArrayExports(arrayList);

  //response
  res.status(200).json({
    status: 'success',
    data: {
      data: statsArrayStandard
    }
  });
});
