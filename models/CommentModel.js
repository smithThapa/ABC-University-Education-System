const mongoose = require('mongoose');
const User = require('./UserModel');
const Topic = require('./TopicModel');


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
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Comment must belong to a user']
    },
    topic: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topic',
        required: [true, 'Comment must belong to a given topic']
    }
})

commentSchema.pre(/^find/, function(next){
    this.populate({
        path: author,
        select: 'firstName lastName'
    }).populate({
        path: topic,
        select: 'title'
    });
    next();
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;