const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
  fileId: String,
  userId: {
    type: String,
    ref: 'User',
    required: [true, 'resource must belong to an user']
  }
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
