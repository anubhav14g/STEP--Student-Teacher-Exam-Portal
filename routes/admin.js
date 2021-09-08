const router = require("express").Router()
const User = require("../models/user");

router.get('/get/all/users',async (req,res)=>{
    try{
        const users= await User.find({});
        res.status(200).json({
            "status": true,
            "message": "List of all users are below",
            "all_users": users
        })
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            "status": "false",
            "message": "Some error occured!",
        });
    }
})

module.exports = router;
