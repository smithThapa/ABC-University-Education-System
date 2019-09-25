//get node modules for schema
const mongoose = require('mongoose');
const slugify = require('slugify');
const moment = require('moment');

//Article Mongo schema to save records into DB
const articleSchema = new mongoose.Schema(
  {
    //title variable of the article
    title: {
      type: String,
      required: [true, 'Please enter the title']
    },
    //describe vraible with the content of the object
    description: {
      type: String
    },
    //moment of creation
    createdAt: {
      type: Date,
      default: Date.now()
    },
    //Two types of article, for news and announcements
    type: {
      type: String,
      enum: ['News', 'Announcements'],
      required: true,
      immutable: true
    },
    //hunique string to display in the front=end
    slug: String,
    //relational variable with user model
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Article must belong a user']
    }
  },
  //virtuals varaible convertible
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//unique title and type for object. Ex. one news with a title
articleSchema.index({ type: 1, title: 1 }, { unique: true });

//pre middleware to populate the user vaibale with the names and roles
articleSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role'
  });
  next();
});

//pre save(create and update) to update the slug varaible (unique), with title, type and time
articleSchema.pre('save', function(next) {
  this.slug = slugify(
    `${this.title} ${this.type} ${moment(this.createdAt).format(
      'DD MMM YYYY HH:mm'
    )}`,
    {
      remove: /[*+~.()'"!:@]/g,
      lower: true
    }
  );
  next();
});

//define the article model
const Article = mongoose.model('Article', articleSchema);

//export model
module.exports = Article;
