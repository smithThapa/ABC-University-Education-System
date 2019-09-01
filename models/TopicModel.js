const mongoose = require('mongoose');
const User = require('./UserModel');
const Forum = require('./ForumModel');


const topicSchema = mongoose.Schema({
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
        default: Date.now(),
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Topic must belong to a user']
    },
    forum: {
        type: mongoose.Schema.ObjectId,
        ref: 'Forum',
        required: [true, 'Topic must belong to a given forum']
    }
})

topicSchema.pre(/^find/, function(next){
    this.populate({
        path: createdBy,
        select: 'firstName lastName'
    }).populate({
        path: forum,
        select: 'title'
    });
    next();
})

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;