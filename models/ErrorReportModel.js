const mongoose = require('mongoose');
//const User = require('./UserModel');

const errorReportSchema = mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
    immutable: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Rejected'],
    default: 'Pending'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'error report must belong to a user']
  }
});

errorReportSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role'
  });
  next();
});

const errorReport = mongoose.model('errorReport', errorReportSchema);

module.exports = errorReport;
