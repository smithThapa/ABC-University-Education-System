const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./UserModel');

const forumSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
      immutable: true
    },
    type: {
      type: String,
      enum: [
        'Information Technology',
        'Business',
        'Accounting',
        'Project Management',
        'NOT A STUDENT'
      ]
    },
    slug: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Forum must belong to a user'],
      immutable: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

forumSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role'
  });
  next();
});

forumSchema.virtual('topics', {
  ref: 'Topic',
  foreignField: 'forum',
  localField: '_id'
});

// forumSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'topics',
//     select: 'title -_id -forum'
//   });
//   next();
// });

forumSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;
