const mongoose = require('mongoose');
const slugify = require('slugify');
const Topic = require('./TopicModel');
const Comment = require('./CommentModel');
// const User = require('./UserModel');

const forumSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
      immutable: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        'Information Technology',
        'Business',
        'Accounting',
        'Project Management',
        'Other'
      ],
      default: 'Other'
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

forumSchema.index({ type: 1, title: 1 }, { unique: true });

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

forumSchema.pre('save', function(next) {
  this.slug = slugify(`${this.type} ${this.title} forum`, {
    remove: null,
    lower: true
  });
  next();
});

//Remove all comments in the topics
forumSchema.pre('remove', async function(next) {
  const topics = await Topic.find({ forum: this._id });

  await Topic.remove({ forum: this._id });
  topics.map(async topic => {
    await Comment.remove({ topic: topic._id });
  });
  next();
});

const Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;
