const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post');


const subSchema = new Schema ({
    subName:{
        type: String,
        required:true
    },

    posts:[{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

module.exports = mongoose.model('Sub', subSchema);
 