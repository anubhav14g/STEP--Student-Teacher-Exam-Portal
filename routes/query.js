const router = require("express").Router()
const Create_Query = require("../models/create_query");
const Test = require("../models/test");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

router.get("/view/all/queries", async (req,res)=>{

    try {
        
        let mapQueriesArray=[];
        
        const allQueries= await Create_Query.find({})

        for(var i=0;i<allQueries.length;i++){
            var found=0;
            for(var j=0;j<mapQueriesArray.length;j++){
                if(String(mapQueriesArray[j]['test_id'])==String(allQueries[i].test_id)){
                    found=1;
                    const user= await User.findById(allQueries[i].user_id)
                    const obj={
                        'email':     user.email,
                        'query_id':  allQueries[i]._id,
                        'query':     allQueries[i].query,    
                        'upvote':    allQueries[i].upvote,
                        'downvote':  allQueries[i].downvote,
                        'createdAt': allQueries[i].createdAt
                    }
                    mapQueriesArray[j]['array'].push(obj);
                    break;
                }
            }
            if(found==0){
                let array=[];
                const user= await User.findById(allQueries[i].user_id)
                const obj={
                    'email':     user.email,
                    'query_id':  allQueries[i]._id,
                    'query':     allQueries[i].query,    
                    'upvote':    allQueries[i].upvote,
                    'downvote':  allQueries[i].downvote,
                    'createdAt': allQueries[i].createdAt
                }
                array.push(obj);
                const obj2={
                    'test_id': allQueries[i].test_id,
                    'array': array
                }
                mapQueriesArray.push(obj2);
            }
        }

        for(var i=0;i<mapQueriesArray.length;i++){
            mapQueriesArray[i].array.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
        }

        return res.status(200).json({
            "status": "true",
            "message": "List of all queries is below",
            "allQueries": mapQueriesArray,
            'total_queries': mapQueriesArray.length
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
            "message": "Some error occured, May be you are not logged in",
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
            "message": "Some error occured, May be you are not logged in",
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
            "message": "Some error occured, May be you are not logged in",
        });
    }

})

module.exports = router;