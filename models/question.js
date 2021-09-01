const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    option1: {
        type: String,
    },
    option2: {
        type: String,
    },
    option3: {
        type: String,
    },
    option4: {
        type: String,
    },
    solution: {
        type: String,
    },
    test_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Test" 
    },
}
,
{
  timestamps: true
});

module.exports=mongoose.model("Question",questionSchema);