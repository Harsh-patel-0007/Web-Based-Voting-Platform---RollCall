const express = require("express");
const router =  express.Router();

const { verifyVoter, submitVote } = require("../controllers/verifyvoters");

router.post("/verify-voter", verifyVoter)
router.post("/submit-vote",(req,res,next)=>{
    console.log("submit vote route reched here")
    next();
}, submitVote)

module.exports = router;