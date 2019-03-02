const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    postId: {
        type: String,
    },
    content: {
        type: String,
    },
    post: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
});

module.exports =  mongoose.model('Comment', userSchema);