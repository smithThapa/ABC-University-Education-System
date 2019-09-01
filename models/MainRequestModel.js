const mongoose = require('mongoose');
const User = require('./UserModel');


const mainRequestSchema = mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String
    },
    status: {
        type: String,
        enum: ['Completed', 'Pending', 'Unsuccessful']
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    resolvedAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'mainRequest must belong to a user']
    }
})


mainRequestSchema.pre(/^find/, function(next){
    this.populate({
        path: createdBy,
        select: 'firstName lastName'
    });
    next();
})

const mainRequest = mongoose.model('mainRequest', mainRequestSchema);

module.exports = mainRequest;