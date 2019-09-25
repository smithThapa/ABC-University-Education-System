// require Node.js modules into the schema
const mongoose = require('mongoose');
const slugify = require('slugify');
const Topic = require('./TopicModel');
const Comment = require('./CommentModel');

// Mongoose schema to store into the db
const forumSchema = mongoose.Schema(
  {
    //title variable of the forum
    title: {
      type: String,
      required: true
    },
    //creation date of the object
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
      immutable: true
    },
    //foru type in an enum to restrict values
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
    //slug value for the front-end
    slug: String,
    //user who created the forum
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

//unique record of within type and title
forumSchema.index({ type: 1, title: 1 }, { unique: true });

//populate the forum with the user who created with its names and role
forumSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role'
  });
  next();
});

//createa  virtual atribute for the topics associated with the dorum
forumSchema.virtual('topics', {
  ref: 'Topic',
  foreignField: 'forum',
  localField: '_id'
});

//add slug with the type and title to the object every time is saved
forumSchema.pre('save', function(next) {
  this.slug = slugify(`${this.type} ${this.title} forum`, {
    remove: null,
    lower: true
  });
  next();
});

//Remove all comments in the topics in cascaded
forumSchema.pre('remove', async function(next) {
  //get topic by id
  const topics = await Topic.find({ forum: this._id });

  //remove the all topic
  await Topic.remove({ forum: this._id });
  topics.map(async topic => {
    //iterate in the topic to remove the commentes with topic id
    await Comment.remove({ topic: topic._id });
  });
  next();
});

//create sceham object to store in the collection
const Forum = mongoose.model('Forum', forumSchema);

//export the model
module.exports = Forum;
