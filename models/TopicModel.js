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
      default: Date.now()
    },
    slug: String,
    //   createdBy: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: [true, 'Topic must belong to a user']
    //   },
    forum: {
      type: mongoose.Schema.ObjectId,
      ref: 'Forum',
      required: [true, 'Topic must belong to a given forum']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// topicSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: createdBy,
//     select: 'firstName lastName'
//   }).populate({
//     path: forum,
//     select: 'title'
//   });
//   next();
// });

topicSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'topic',
  localField: '_id'
});

topicSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
