const mongoose = require('mongoose');
const User = require('./UserModel');

const errorReportSchema = mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'error report must belong to a user']
  }
});
errorReportSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'firstName lastName'
  });
  next();
});

const errorReport = mongoose.model('errorReport', errorReportSchema);

module.exports = errorReport;
