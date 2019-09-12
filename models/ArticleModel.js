const mongoose = require('mongoose');
const slugify = require('slugify');
const moment = require('moment');
//const User = require('./UserModel');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter the title']
    },
    description: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    type: {
      type: String,
      enum: ['News', 'Announcements'],
      required: true,
      immutable: true
    },
    slug: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Article must belong a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

articleSchema.index({ type: 1, title: 1 }, { unique: true });

articleSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role'
  });
  next();
});

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

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
