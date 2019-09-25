//require node modules for the schema
const mongoose = require('mongoose');

//create schema to integrate in the database
const errorReportSchema = mongoose.Schema({
  //subject varaiable to add a title in the error report
  subject: {
    type: String,
    required: true
  },
  //description variabel with the contentof the report
  description: {
    type: String,
    required: true
  },
  //creation date variable of the object
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true
  },
  //status of the error report
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Rejected'],
    default: 'Pending'
  },
  //user who created the report from user model
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'error report must belong to a user']
  }
});

//populate the user in the error report object with names and role
errorReportSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role'
  });
  next();
});

//create model into the mongodb
const ErrorReport = mongoose.model('ErrorReport', errorReportSchema);
//exports the module to manage the collection
module.exports = ErrorReport;
