const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
  fileId: String,
  userId: {
    type: String,
    ref: 'User',
    required: [true, 'resource must belong to an user']
  }
});

resourceSchema.index({ fileId: 1, userId: 1 }, { unique: true });

resourceSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'firstName lastName role'
  });
  next();
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
