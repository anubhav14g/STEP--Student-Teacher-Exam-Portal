const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // Mcq/Theory
    type: {
        type: String,
        required: true
    },
    total_questions: {
        type: Number,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    max_marks: {
        type: Number,
        required: true
    },
    conducted_by_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User" 
    },
    status_of_questions_added: {
        type: Number,
        default: 0
    }
}
,
{
  timestamps: true
});

module.exports=mongoose.model("Test",testSchema);