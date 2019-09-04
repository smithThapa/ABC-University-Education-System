const mongoose = require('mongoose');
// const User = require('./UserModel');

const commentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  body: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
    immutable: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Comment must belong to a user'],
    immutable: true
  },
  topic: {
    type: mongoose.Schema.ObjectId,
    ref: 'Topic',
    required: [true, 'Comment must belong to a given topic'],
    immutable: true
  }
});

commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role'
  }).populate({
    path: 'topic',
    select: 'title'
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
