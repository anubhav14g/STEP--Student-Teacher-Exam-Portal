const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User" 
    },
    test_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Test" 
    },
    total_score: {
        type: Number,
        required: true
    },
}
,
{
  timestamps: true
});

module.exports=mongoose.model("Submission",submissionSchema);