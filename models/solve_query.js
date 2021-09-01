const mongoose = require('mongoose');

const solveQuerySchema = new mongoose.Schema({
    query_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Create_Query" 
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User" 
    },
    solution: {
        type: String,
        required: true
    },
}
,
{
  timestamps: true
});

module.exports=mongoose.model("Solve_Query",solveQuerySchema);