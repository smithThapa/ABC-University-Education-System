/* eslint-disable no-plusplus */
//Node.js modules to implement
const moment = require('moment');
//utilities of the system to implement
const catchAsync = require('./../utils/CatchAsync');
const AppError = require('./../utils/AppError');
const APIFeatures = require('./../utils/ApiFeatures');

//standardized the array by month, adding zero to values no existing
const standardAggregationArray = array => {
  //get last element in the array
  const lastElement = array[array.length - 1];

  //full data
  const dataToIterateAsObjects = lastElement[1];

  //total data
  const totalValuesObject = lastElement[2][0];

  //convert objects into id values
  const arrayIdValues = [];
  dataToIterateAsObjects.forEach(element => {
    arrayIdValues.push(element._id);
  });

  //get all the attributes
  const allAttributes = Object.getOwnPropertyNames(dataToIterateAsObjects[0]);

  //new array to create and add values
  const newArray = [];

  //for loop through all elements in the array but no the last one
  for (let i = 0; i < array.length - 1; i++) {
    //array by month
    const subArrayEachMonth = [];

    //complete element before
    let start = 0;
    // for loop for the month elements
    for (let j = 0; j < array[i][1].length; j++) {
      //for loop to compare with the attributes
      for (let k = start; k < arrayIdValues.length; k++) {
        if (array[i][1][j]._id === arrayIdValues[k]) {
          subArrayEachMonth[k] = array[i][1][j];
          // console.log(subArrayEachMonth[k]);
          start = k + 1;
          break;
        } else {
          subArrayEachMonth[k] = { _id: arrayIdValues[k] };
          //add extra fields as zero
          for (let m = 1; m < allAttributes.length; m++) {
            subArrayEachMonth[k][allAttributes[m]] = 0;
          }
        }
      }
    }

    //add last element
    if (subArrayEachMonth !== arrayIdValues.length) {
      //check how many element after
      for (let p = subArrayEachMonth.length; p < arrayIdValues.length; p++) {
        const element = { _id: arrayIdValues[p] };
        //add extra fields as zero
        for (let m = 1; m < allAttributes.length; m++) {
          element[allAttributes[m]] = 0;
        }
        //add element
        subArrayEachMonth.push(element);
      }
    }

    //push each month array in the new array
    newArray.push(subArrayEachMonth);
  }

  //New total standard
  const totalNewArray = [];

  //array with all attributes
  const arrayTotalKeysObject = Object.getOwnPropertyNames(totalValuesObject);

  //iterate through all elements
  for (let i = 0; i < array.length - 1; i++) {
    //check if the array is empty
    if (array[i][2].length === 0) {
      //create object variable to append in the array
      const totalObject = {};

      //iterate through the total object property name to append zeros, from the second element
      arrayTotalKeysObject.forEach(element => {
        if (element === '_id') {
          //- append id of the object
          totalObject._id = totalValuesObject._id;
        } else {
          totalObject[element] = 0;
        }
      });

      //push the element in the array
      totalNewArray.push([totalObject]);
    }

    // case that the object is not empty, push the right element
    else {
      totalNewArray.push(array[i][2]);
    }
  }

  //assign the final array to return to the ones given
  const finalArray = array;
  // change the original array with eh new values
  for (let i = 0; i < array.length - 1; i++) {
    //change in the case first element
    finalArray[i][1] = newArray[i];
    //case second element
    finalArray[i][2] = totalNewArray[i];
  }

  //return the array
  return finalArray;
};

//export function to standardized the array to other activities
exports.standardAggregationArrayExports = array => {
  return standardAggregationArray(array);
};

//delete a document from MongoDB by id
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    //get element by id
    const doc = await Model.findById(req.params.id);

    //error if there is not element
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    //remove the object
    await doc.remove();

    //response
    res.status(201).json({
      status: 'success',
      data: null
    });
  });

//update the model by id
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    //get element by id
    const doc = await Model.findById(req.params.id, req.body);

    //if the document does not exist
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    //check all key provided by the user
    // eslint-disable-next-line no-restricted-syntax
    for (const key in req.body) {
      // eslint-disable-next-line no-prototype-builtins
      if (req.body.hasOwnProperty(key)) {
        //do not change the user who created
        if (key !== 'user') doc[key] = req.body[key];
      }
    }

    //update the document
    await doc.save();

    //response
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

//create one document
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    //create document with the data provided
    const doc = await Model.create(req.body);

    //response
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

//get one element by id
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    //query the model
    let query = Model.findById(req.params.id);

    //if user give population
    if (popOptions) {
      query = query.populate(popOptions);
    }

    //await the query to get the element
    const doc = await query;

    //if there is not element
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    //response
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

//get all element in a collection
exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested get review on tours
    let filter = {};
    //if there is forum id
    if (req.params.forumId) {
      filter = {
        forum: req.params.forumId
      };
    }
    //if the there is topic id
    if (req.params.topicId) {
      filter = {
        topic: req.params.topicId
      };
    }

    //Execute query allowing URL queries
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    //populate the options in the query
    if (popOptions) {
      features.query = features.query.populate(popOptions);
    }

    //execute query with all previous options
    const doc = await features.query;

    //Send response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });

//get aggregation for stats
exports.getAggregationStatsArray = async function(
  Model,
  baseArrayAggregate,
  totalBaseArrayAggregate
) {
  //empty array to return
  const arrayList = [];

  //months to iterate and get
  const arrayMonths = [1, 2, 3, 6, 12];

  //aggregation option to sort by id after group
  const sortBaseArrayAggregate = [{ $sort: { _id: 1 } }];

  //await all before all the total
  await Promise.all(
    //iterate through all months
    arrayMonths.map(async month => {
      //create data for query the months, this will query from the frist date of the month
      const dateQuery = moment()
        .startOf('month')
        .subtract(month - 1, 'months')
        .format();

      //array to query by the date
      const queryMatchArray = [
        {
          $match: {
            createdAt: {
              $gt: new Date(dateQuery)
            }
          }
        }
      ];

      //aggregate the model by the data, base array provided and sort it
      const statsMonth = await Model.aggregate(
        queryMatchArray
          .concat(baseArrayAggregate)
          .concat(sortBaseArrayAggregate)
      );

      //aggregate the model and get the total
      const statsTotalMonth = await Model.aggregate(
        queryMatchArray
          .concat(baseArrayAggregate)
          .concat(totalBaseArrayAggregate)
          .concat(sortBaseArrayAggregate)
      );

      //push the element in the array with month description, stats of each month and their total
      arrayList.push([
        `${month.toString().length === 1 ? `0${month}` : month} Months`,
        statsMonth,
        statsTotalMonth
      ]);
    })
  );

  //aggregate to get final element with not matching date
  const stats = await Model.aggregate(
    baseArrayAggregate.concat(sortBaseArrayAggregate)
  );

  //Case that stats is empty array
  if (stats.length === 0) {
    //switch through the models
    switch (Model.collection.collectionName) {
      // Model = User
      case 'users':
        //Create empty Object to push in the array
        // eslint-disable-next-line no-case-declarations
        const userStatsObject = {
          _id: 'none',
          numUsers: 0,
          numAccounting: 0,
          numBusiness: 0,
          numInformationTechnology: 0,
          numProjectManagement: 0,
          numNOTAMAJOR: 0
        };
        //add the element to the array stats
        stats.push(userStatsObject);
        break;

      // Model = Forum
      case 'forums':
        //Create empty Object to push in the array
        // eslint-disable-next-line no-case-declarations
        const forumStatsObject = {
          _id: 'none',
          numForums: 0,
          totalNumTopics: 0
        };
        //add the element to the array stats
        stats.push(forumStatsObject);
        break;

      // Model = Topic
      case 'topics':
        //Create empty Object to push in the array
        // eslint-disable-next-line no-case-declarations
        const topicStatsObject = {
          _id: 'none',
          numTopics: 0,
          totalNumComments: 0
        };
        //add the element to the array stats
        stats.push(topicStatsObject);
        break;

      // Model = Article
      case 'articles':
        //Create empty Object to push in the array
        // eslint-disable-next-line no-case-declarations
        const articleStatsObject = {
          _id: 'none',
          numArticle: 0
        };
        //add the element to the array stats
        stats.push(articleStatsObject);
        break;

      //default case
      default:
        //Create empty Object to push in the array
        // eslint-disable-next-line no-case-declarations
        const defaultStatsObject = {
          _id: 'none',
          num: 0
        };
        //add the element to the array stats
        stats.push(defaultStatsObject);
    }
  }

  //total values of the stats of the model
  const statsTotal = await Model.aggregate(
    baseArrayAggregate
      .concat(totalBaseArrayAggregate)
      .concat(sortBaseArrayAggregate)
  );

  //Case that the statsTotal is empty array
  if (statsTotal.length === 0) {
    //switch through the models
    switch (Model.collection.collectionName) {
      // Model = User
      case 'users':
        //Create empty Object to push in the array
        // eslint-disable-next-line no-case-declarations
        const userStatsTotalObject = {
          _id: 'User',
          totalNumUsers: 0,
          totalNumAccounting: 0,
          totalNumBusiness: 0,
          totalNumInformationTechnology: 0,
          totalNumProjectManagement: 0,
          totalNumNOTAMAJOR: 0
        };
        //add the element to the array stats
        stats.push(userStatsTotalObject);
        break;

      // Model = Forum
      case 'forums':
        //Create empty Object to push in the array
        // eslint-disable-next-line no-case-declarations
        const forumStatsTotalObject = {
          _id: 'Forum',
          totalNumForums: 0,
          totalNumTopicsAllForums: 0
        };
        //add the element to the array stats
        stats.push(forumStatsTotalObject);
        break;

      // Model = Topic
      case 'topics':
        //Create empty Object to push in the array
        // eslint-disable-next-line no-case-declarations
        const topicStatsTotalObject = {
          _id: 'Topic',
          totalNumTopics: 0,
          totalNumCommentsAllTopics: 0
        };
        //add the element to the array stats
        stats.push(topicStatsTotalObject);
        break;

      // Model = Article
      case 'articles':
        //Create empty Object to push in the array
        // eslint-disable-next-line no-case-declarations
        const articleStatsTotalObject = {
          _id: 'Article',
          totalNumArticle: 0
        };
        //add the element to the array stats
        stats.push(articleStatsTotalObject);
        break;

      //default case
      default:
        //Create empty Object to push in the array
        // eslint-disable-next-line no-case-declarations
        const defaultStatsTotalObject = {
          _id: 'NONE',
          totalNum: 0
        };
        //add the element to the array stats
        stats.push(defaultStatsTotalObject);
    }
  }

  //push total in the array
  arrayList.push(['Total', stats, statsTotal]);

  //sort the array to avoid conflicts
  arrayList.sort();

  //return the standard array
  return standardAggregationArray(arrayList);
};
