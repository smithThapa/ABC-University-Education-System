const mongoose = require('mongoose');
//const User = require('./UserModel');

const mainRequestSchema = mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Rejected'],
    default: 'Pending'
  },
  resolvedMessage: { type: String, select: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  },
  resolvedAt: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'mainRequest must belong to a user']
  }
});

mainRequestSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role email'
  });
  next();
});

const mainRequest = mongoose.model('mainRequest', mainRequestSchema);

module.exports = mainRequest;
