const router = require("express").Router()
const Test = require("../models/test");
const Question = require("../models/question");
const Submission = require("../models/submission");
const jwt = require('jsonwebtoken');

router.get("/check/status/:test_id",async (req,res)=>{
    
    const test= await Test.findById(req.params.test_id);
    if(!test){
        return res.status(400).json({
            "status": "false",
            "message": "Test not found",
        });
    }
    
    try{
        
        if(test.type=="Theory"){
            return res.status(400).json({
                "status": "false",
                "message": "You can't take the test as it is of theory not mcq",
            });  
        }
        
        let curr_date = Date.now();
        if(curr_date < test.start_time.valueOf()){
            return res.status(400).json({
                "status": "false",
                "message": "Test not started yet",
            });              
        }
        if(curr_date > test.end_time.valueOf()){
            return res.status(400).json({
                "status": "false",
                "message": "Test has ended",
            });                 
        }

        return res.status(200).json({
            "status": "true",
            "message": "Test is going on",
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

router.get("/view/all/tests", async (req,res)=>{

    try {
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            
            const allTests= await Test.find({"conducted_by_user": verified.userId})

            return res.status(200).json({
                "status": "true",
                "message": "List of all tests conducted by user is below",
                "all_tests": allTests,
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

router.get("/view/all/questions/:test_id", async (req,res)=>{

    const test= await Test.findById(req.params.test_id);
    if(!test){
        return res.status(400).json({
            "status": "false",
            "message": "Test not found",
        });
    }

    try {
        const allQuestions= await Question.find({"test_id": req.params.test_id})

        return res.status(200).json({
            "status": "true",
            "message": "List of all questions of this test is below",
            "allQuestions": allQuestions,
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


router.get("/view/all/submissions/:test_id", async (req,res)=>{

    const test= await Test.findById(req.params.test_id);
    if(!test){
        return res.status(400).json({
            "status": "false",
            "message": "Test not found",
        });
    }

    try {
        const allSubmissions= await Submission.find({"test_id": req.params.test_id})

        return res.status(200).json({
            "status": "true",
            "message": "List of all submissions of this test is below",
            "allSubmissions": allSubmissions,
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


router.post("/create", async (req,res)=>{
    
    if(req.body.type!="Mcq" && req.body.type!="Theory"){
        return res.status(400).json({
            "status": "false",
            "message": "Incorrect input, enter correct type",
        });
    }

    try {
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            const obj ={
                "name": req.body.name,
                "type": req.body.type,
                "total_questions": Number(req.body.total_questions),
                "start_time": new Date(req.body.start_time),
                "end_time": new Date(req.body.end_time),
                "duration": req.body.duration,
                "max_marks": Number(req.body.max_marks),
                "conducted_by_user": verified.userId
            }
            const new_test= await Test.create(obj);
            return res.status(200).json({
                "status": "true",
                "message": "Test created successfully",
                "testId": new_test._id,
                "test": new_test
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

router.post("/add/question/:test_id", async (req,res)=>{
    
    try {
        
        const test= await Test.findById(req.params.test_id);
        if(!test){
            return res.status(400).json({
                "status": "false",
                "message": "Test not found",
            });
        }
        
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            
            if(test.conducted_by_user!=verified.userId){
                return res.status(400).json({
                    "status": "false",
                    "message": "Access Denied, You don't have permission to add question",
                });
            }

            if(test.status_of_questions_added==test.total_questions){
                return res.status(400).json({
                    "status": "false",
                    "message": "You can't add any more question, Limit reached",
                });
            }

            if(test.type=="Mcq"){
                const obj2 = {
                    "question": req.body.question,
                    "option1": req.body.option1,
                    "option2": req.body.option2,
                    "option3": req.body.option3,
                    "option4": req.body.option4,
                    "solution": req.body.solution,
                    "test_id": req.params.test_id
                }
                const new_question= await Question.create(obj2);
            }

            if(test.type=="Theory"){
                const obj2 = {
                    "question": req.body.question,
                    "test_id": req.params.test_id
                }
                const new_question= await Question.create(obj2);
            }
            
            test.status_of_questions_added+=1;
            test.save();
            
            return res.status(200).json({
                "status": "true",
                "message": "New Question added to test successfully",
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