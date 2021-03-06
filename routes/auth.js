const router = require("express").Router()
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post("/register/user",async (req,res)=>{
    
    if(!req.body.name || !req.body.email || !req.body.type || !req.body.pin){
        return res.status(400).json({
            "status": "false",
            "message": "Name, email , type & PIN are required"
        });
    }
    
    if(req.body.phone_no && req.body.phone_no.length!=10){
        return res.status(400).json({
            "status": "false",
            "message": "Incorrect input, Phone no must be of 10 digits"
        });
    }

    if(req.body.pin.length!=6){
        return res.status(400).json({
            "status": "false",
            "message": "Incorrect input, Pin must be of 6 digits"
        });
    }

    const hashedPassword = await bcrypt.hash(req.body.pin,7);

    const obj ={
        "name": req.body.name,
        "email": req.body.email,
        "phone_no": Number(req.body.phone_no),
        "pin": hashedPassword,
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

        const isSamePin = await bcrypt.compare(req.body.pin,found.pin);

        if(!isSamePin){
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