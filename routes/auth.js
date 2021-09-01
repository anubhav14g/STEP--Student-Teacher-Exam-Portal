const router = require("express").Router()
const User = require("../models/user");
const jwt = require('jsonwebtoken');

router.post("/register/user",async (req,res)=>{
    
    if(req.body.phone_no.length!=10 || req.body.pin.length!=6){
        return res.status(400).json({
            "status": "false",
            "message": "Incorrect input, Phone no must be of 10 digits and Pin must be of 6 digits"
        });
    }

    if(req.body.type!="Teacher" && req.body.type!="Student"){
        return res.status(400).json({
            "status": "false",
            "message": "Incorrect input, enter correct type"
        });
    }

    const obj ={
        "name": req.body.name,
        "email": req.body.email,
        "phone_no": Number(req.body.phone_no),
        "pin": Number(req.body.pin),
        "type": req.body.type
    }
    try{
        const found= await User.findOne({"email": req.body.email});
        if(found){
            return res.status(400).json({
                "status": "false",
                "message": "User already registered",
            });
        }
        const new_user= await User.create(obj);
        return res.status(200).json({
            "status": "true",
            "message": "User registered successfully, plz login",
        });
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            "status": "false",
            "message": "Some error occured!",
        });
    }
})


router.post("/login/user",async (req,res)=>{
    try{
        const found= await User.findOne({"email": req.body.email});
        if(!found){
            return res.status(400).json({
                "status": "false",
                "message": "No user found, plz register first",
            });
        }
        if(found.pin!=Number(req.body.pin)){
            return res.status(400).json({
                "status": "false",
                "message": "Password does not match",
            });
        }
        const payload={
            userId: found._id
        }
        const token= jwt.sign(payload,process.env.JWT_SECRET_KEY);
        return res.status(200).json({
            "status": "true",
            "message": "User logged in successfully",
            "auth-token": token
        });
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