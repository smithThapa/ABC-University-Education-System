// require node modulates to use in the schema
const mongoose = require('mongoose');

//MongoDB schema with the comment
const commentSchema = mongoose.Schema(
  {
    //title variable of the comment
    title: {
      type: String,
      required: true
    },
    //description variable with the content of the comment object
    description: {
      type: String
    },
    //creation date of the object
    createdAt: {
      type: Date,
      default: Date.now(),
      immutable: true
    },
    //user who create the comment
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user'],
      immutable: true
    },
    //topic related with the comment
    topic: {
      type: mongoose.Schema.ObjectId,
      ref: 'Topic',
      required: [true, 'Comment must belong to a given topic'],
      immutable: true
    }
  },
  //convert virtual attributes
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//populate the comment with user names and roles, as well as topic title
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

//comment model for MongoDB
const Comment = mongoose.model('Comment', commentSchema);

//export the module for use in app.js
module.exports = Comment;
