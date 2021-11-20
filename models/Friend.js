const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
    friendName:{
        type:String,
        required:true
    },
    friendEmail:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});

const Friend = mongoose.model('friend', FriendSchema);

module.exports = Friend;