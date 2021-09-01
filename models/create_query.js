const mongoose = require('mongoose');

const createQuerySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User" 
    },
    test_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Test" 
    },
    query: {
        type: String,
        required: true
    },
    upvote: {
        type: Array,
        default: []
    },
    downvote: {
        type: Array,
        default: []
    }
}
,
{
  timestamps: true
});

module.exports=mongoose.model("Create_Query",createQuerySchema);