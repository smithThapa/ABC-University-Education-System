//require modules to use int the schema
const mongoose = require('mongoose');
const slugify = require('slugify');
const Comment = require('./CommentModel');

//create topic mongoose schema
const topicSchema = mongoose.Schema(
  {
    //add title attribute of the topic
    title: {
      type: String,
      required: true
    },
    //description of the topic
    description: {
      type: String
    },
    //creation date of the object
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
      immutable: true
    },
    //slug of the object to display in the front-end
    slug: String,
    //user who created the topic
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'topic must belong to a user'],
      immutable: true
    },
    //forum which the topic belongs
    forum: {
      type: mongoose.Schema.ObjectId,
      ref: 'Forum',
      required: [true, 'Topic must belong to a given forum'],
      immutable: true
    }
  },
  //allow conversion for virtual attributes
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//add unique topic with the title and forum
topicSchema.index({ title: 1, forum: 1 }, { unique: true });

//populate the topic each time it is found with the user names and role and forum data
topicSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role'
  }).populate({
    path: 'forum',
    select: 'title type'
  });
  next();
});

//create virtual attribute of the comments in the topic
topicSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'topic',
  localField: '_id'
});

//create unique slug with the title and forum id
topicSchema.pre('save', async function(next) {
  this.slug = slugify(`${this.title} ${this.forum} topic`, {
    remove: null,
    lower: true
  });
  next();
});

//Remove all comments in the topics as cascade
topicSchema.pre('remove', async function(next) {
  await Comment.remove({ topic: this._id });
  next();
});

//create collection in the db from the schema
const Topic = mongoose.model('Topic', topicSchema);

//export the model to manage the data in the collection
module.exports = Topic;
