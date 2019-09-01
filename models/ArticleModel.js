const mongoose = require('mongoose');
const User = require('./UserModel');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the tile" ]
    },
    body: {
        type: String 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['News', 'Annoucements'],
        default: 'News',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Article must belong a user']
    }
})

articleSchema.pre(/^find/, function(next){
    this.populate({
        path: createdBy,
        select: 'firstName lastName'
    });
    next();
})

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;