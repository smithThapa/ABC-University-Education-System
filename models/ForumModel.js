const mongoose = require('mongoose');
const User = require('./UserModel');


const forumSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    type: {
        type: String,
        enum: ['Information Technology', "Business", "Accounting", "Project Management", "NOT A STUDENT"]
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Forum must belong to a user']
    }
})


forumSchema.pre(/^find/, function(next){
    this.populate({
        path: author,
        select: 'firstName lastName'
    });
    next();
})

const Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;