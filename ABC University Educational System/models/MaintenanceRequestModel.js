//require Node.js modules to use in the schema
const mongoose = require('mongoose');

//create a mongoose schema object
const mainRequestSchema = mongoose.Schema({
  //subject attribute in the object with title
  subject: {
    type: String,
    required: true
  },
  //description attribute in the object with the content
  description: {
    type: String,
    required: true
  },
  //status of the maintenance request
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Rejected'],
    default: 'Pending'
  },
  //resolved message to the user who created
  resolvedMessage: { type: String, select: true },
  //when the object was created
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  },
  //when the maintenance request was resolved
  resolvedAt: {
    type: Date
  },
  //user who created the request
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'mainRequest must belong to a user']
  }
});

//populate the users with their names and roles
mainRequestSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName role email'
  });
  next();
});

//add schema in the MongoDB
const MainRequest = mongoose.model('MainRequest', mainRequestSchema);

//export the model to manage the collection data
module.exports = MainRequest;
