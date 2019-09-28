/* eslint-disable node/no-unsupported-features/es-syntax */
//Class API Features to add url query in the mongo query
class APIFeatures {
  //class constructor with the query object and URL query from the URL
  constructor(query, queryString) {
    //set both values
    this.query = query;
    this.queryString = queryString;
  }

  //filter method to filter the query by the values add it. Ex. title = 'topic example'
  filter() {
    //copy the query options in anew filter
    const queryObj = { ...this.queryString };
    // exclusion types to omit in this step (following methods will implement them)
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // delete these exclusion fileds from the queryObj copy
    excludedFields.forEach(el => delete queryObj[el]);

    //convert queryObject JSON object into a String
    let queryStr = JSON.stringify(queryObj);
    // replace the <, <=, >, >= values in the string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // convert the string back to a JSON object to add in the mongoose query
    this.query = this.query.find(JSON.parse(queryStr));

    //return query
    return this;
  }

  // sort method to sort the query by the define fields in the URL
  sort() {
    //verifies is the user add the sort Field
    if (this.queryString.sort) {
      //Create an string by joining the fields in the sort attribute
      const sortBy = this.queryString.sort.split(',').join(' ');
      //add the sort string into the mongoose query to further execution
      this.query = this.query.sort(sortBy);
    } else {
      //if there is not added fiels, all query will be sorted by the creation time of the object in ascencion
      this.query = this.query.sort('-createAt');
    }

    //retun query
    return this;
  }

  //limit fields methods to select the fileds to be displayed in the query
  limitFields() {
    //check if the field option is added
    if (this.queryString.fields) {
      //Create an string by joining the values in the filed attribute
      const fields = this.queryString.fields.split(',').join(' ');
      //add the filed string into the mongoose query to further execution
      this.query = this.query.select(fields);
    } else {
      //by default it will be select all but the __v attribute from mongodb
      this.query = this.query.select('-__v');
    }

    //return the query
    return this;
  }

  //pagination method to allows getting a certain numbers of object in order
  pagination() {
    // set the page number (default 1)
    const page = this.queryString.page * 1 || 1;
    //set the number of obejct to display (default 100)
    const limit = this.queryString.limit * 1 || 100;
    //skip values to to set the values in the page selected
    const skip = (page - 1) * limit;

    //set skip values into the query and the limit of the number of elements to be displayed
    this.query = this.query.skip(skip).limit(limit);

    //return the query
    return this;
  }
}

//export the APIFeatures class to be implemented in other fields
module.exports = APIFeatures;
