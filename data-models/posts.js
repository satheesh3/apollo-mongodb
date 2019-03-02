const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
});

module.exports = mongoose.model('Post', userSchema);