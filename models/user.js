const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // Must be of 10 digits
    phone_no: {
        type: Number,
    },
    // Must be of 6 digits
    pin: {
        type: Number,
        required: true
    },
    is_email_verified: {
        type: Boolean,
        default: false
    },
    // Teacher/Student
    type: {
        type: String,
        required: true
    },
}
,
{
  timestamps: true
});

module.exports=mongoose.model("User",userSchema);