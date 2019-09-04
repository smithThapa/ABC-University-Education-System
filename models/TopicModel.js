const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./UserModel');
// const Forum = require('./ForumModel');

const topicSchema = mongoose.Schema(
  {
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
    slug: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'topic must belong to a user'],
      immutable: true
    },
    forum: {
      type: mongoose.Schema.ObjectId,
      ref: 'Forum',
      required: [true, 'Topic must belong to a given forum'],
      immutable: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

topicSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role'
  }).populate({
    path: 'forum',
    select: 'title'
  });
  next();
});

topicSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'topic',
  localField: '_id'
});

topicSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

topicSchema.pre('save', function(next) {
  if (this.isNew) return next();

  if (this.isModified('user') || this.isModified('forum')) return next();
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
