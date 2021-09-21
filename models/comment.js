const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;


const commentSchema = new Schema ({
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },      
   
    
    comment:{
        type:String,
        required:true
    }


});

module.exports = mongoose.model('Comment', commentSchema);
 