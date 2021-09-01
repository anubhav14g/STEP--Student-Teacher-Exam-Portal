const router = require("express").Router()
const Create_Query = require("../models/create_query");
const Solve_Query = require("../models/solve_query");
const Test = require("../models/test");
const jwt = require('jsonwebtoken');

router.get("/view/all/queries", async (req,res)=>{

    try {
        const allQueries= await Create_Query.find({})

        return res.status(200).json({
            "status": "true",
            "message": "List of all queries is below",
            "allQueries": allQueries,
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


router.get("/update/upvote/:query_id", async (req,res)=>{

    const query = await Create_Query.findById(req.params.query_id)
    if(!query){
        return res.status(400).json({
            "status": "false",
            "message": "Query not found",
        });
    }

    try {
        
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            
            if(!query.upvote.includes(verified.userId)){
                query.upvote.push(verified.userId)
            }
            query.save();

            return res.status(200).json({
                "status": "true",
                "message": "Query upvote updated successfully",
                "total_upvotes": query.upvote.length,
            });

        }
        else{
            // Access Denied
            return res.status(400).json({
                "status": "false",
                "message": "Access Denied, Plz login again",
            });
        }

    }
    catch(err){
        console.log(err);
        res.status(400).json({
            "status": "false",
            "message": "Some error occured!",
        });
    }

})


router.get("/update/downvote/:query_id", async (req,res)=>{

    const query = await Create_Query.findById(req.params.query_id)
    if(!query){
        return res.status(400).json({
            "status": "false",
            "message": "Query not found",
        });
    }

    try {
        
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            
            if(!query.downvote.includes(verified.userId)){
                query.downvote.push(verified.userId)
            }
            query.save();

            return res.status(200).json({
                "status": "true",
                "message": "Query downvote updated successfully",
                "total_downvotes": query.downvote.length,
            });

        }
        else{
            // Access Denied
            return res.status(400).json({
                "status": "false",
                "message": "Access Denied, Plz login again",
            });
        }

    }
    catch(err){
        console.log(err);
        res.status(400).json({
            "status": "false",
            "message": "Some error occured!",
        });
    }

})


router.post("/create/:test_id",async (req,res)=>{
    
    const test= await Test.findById(req.params.test_id);
    if(!test){
        return res.status(400).json({
            "status": "false",
            "message": "Test not found",
        });
    }
    
    try{
        
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            
            const obj={
                "user_id": verified.userId,
                "test_id": req.params.test_id,
                "query": req.body.query,
            }
            const saved_query= await Create_Query.create(obj);

            return res.status(200).json({
                "status": "true",
                "message": "Query is created successfully",
            });

        }
        else{
            // Access Denied
            return res.status(400).json({
                "status": "false",
                "message": "Access Denied, Plz login again",
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            "status": "false",
            "message": "Some error occured!",
        });
    }

})


router.post("/solve/:query_id",async (req,res)=>{
    
    const query= await Create_Query.findById(req.params.query_id);
    if(!query){
        return res.status(400).json({
            "status": "false",
            "message": "Query not found",
        });
    }
    
    try{
        
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            
            const obj={
                "user_id": verified.userId,
                "query_id": req.params.query_id,
                "solution": req.body.solution,
            }
            const solved_query= await Solve_Query.create(obj);

            return res.status(200).json({
                "status": "true",
                "message": "Query is solved successfully",
            });

        }
        else{
            // Access Denied
            return res.status(400).json({
                "status": "false",
                "message": "Access Denied, Plz login again",
            });
        }
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