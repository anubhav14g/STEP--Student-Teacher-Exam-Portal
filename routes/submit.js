const router = require("express").Router()
const Test = require("../models/test");
const Question = require("../models/question");
const User_Saved_Answer = require("../models/user_saved_answer");
const Submission = require("../models/submission");
const jwt = require('jsonwebtoken');


router.post("/save/answer/:question_id", async (req,res)=>{

    const question= await Question.findById(req.params.question_id);
    if(!question){
        return res.status(400).json({
            "status": "false",
            "message": "Question not found",
        });
    }

    try {
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            
            var found=0;
            const all_answers_array = await User_Saved_Answer.find({"user_id": verified.userId})
            for(var i=0;i<all_answers_array.length;i++){
                if(all_answers_array[i].question_id==req.params.question_id){
                    found=1;
                    break;
                }
            }
            
            if(found==0){
                const obj={
                    "user_id": verified.userId,
                    "question_id": req.params.question_id,
                    "test_id": question.test_id,
                    "submitted_answer": req.body.submitted_answer,
                    "score": question.solution==req.body.submitted_answer ? 1 : 0
                }
                const saved_answer= await User_Saved_Answer.create(obj);
                return res.status(200).json({
                    "status": "true",
                    "message": "Answer saved successfully",
                });
            }
            else{
                return res.status(400).json({
                    "status": "false",
                    "message": "Your answer is saved already, you can't change it now",
                });
            }
            
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


router.get("/test/submit/:test_id", async (req,res)=>{

    const test= await Test.findById(req.params.test_id);
    if(!test){
        return res.status(400).json({
            "status": "false",
            "message": "Test not found",
        });
    }

    try {
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            
            let all_submissions= await Submission.find({"user_id": verified.userId});
            var found=0;
            for(var i=0;i<all_submissions.length;i++){
                if(all_submissions[i].test_id==req.params.test_id){
                    found=1;
                    break;
                }
            }

            if(found==0){
                let all_saved_answers = await User_Saved_Answer.find({"user_id":verified.userId});
                let total_score=0;
                for(var i=0;i<all_saved_answers.length;i++){
                    if(all_saved_answers[i].test_id==req.params.test_id){
                        total_score+=all_saved_answers[i].score;
                    }
                }
                const obj={
                    "user_id": verified.userId,
                    "test_id": req.params.test_id,
                    "total_score": total_score
                }
                const submit_test= await Submission.create(obj);

                return res.status(200).json({
                    "status": "true",
                    "message": "Test submitted successfully",
                });
            }
            else{
                return res.status(400).json({
                    "status": "false",
                    "message": "You have already submitted the test",
                });
            }
            
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