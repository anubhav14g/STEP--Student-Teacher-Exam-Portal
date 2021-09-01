const mongoose = require('mongoose');

const userSavedAnswerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User" 
    },
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Question" 
    },
    test_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Test" 
    },
    submitted_answer: {
        type: String,
        required: true
    },
    // 0/1
    score: {
        type: Number,
        required: true
    },
}
,
{
  timestamps: true
});

module.exports=mongoose.model("User_Saved_Answer",userSavedAnswerSchema);