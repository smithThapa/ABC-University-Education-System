//require Node.js modules to use in the schema
const mongoose = require('mongoose');

//mongoose schema to unified files and users who create them
const resourceSchema = mongoose.Schema({
  // file id from gridfsBucket
  fileId: String,
  //userId with the user information as id
  userId: {
    type: String,
    ref: 'User',
    required: [true, 'resource must belong to an user']
  }
});

//unique file id and user id
resourceSchema.index({ fileId: 1, userId: 1 }, { unique: true });

//populate the user when the file is searched with names and role
resourceSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'firstName lastName role'
  });
  next();
});

//create module to store collection into db
const Resource = mongoose.model('Resource', resourceSchema);

//export the module to manage the data in the collection
module.exports = Resource;
