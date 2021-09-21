const mongoose = require('mongoose');
const User = require('./user');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const postSchema = new Schema ({

    
    title:{
        type:String,
        required: true
    },

    content:{
        type:String
    },

    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Post', postSchema);
 