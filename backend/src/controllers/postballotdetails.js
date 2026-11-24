const db = require("../database/database");
const jwt = require("jsonwebtoken")
require("dotenv").config();

const postballotdetails= async(req,res)=>{
    try{
        const {email,electionid} = req.body;

        if(!email&&!electionid){
            return res.status(400).json({
                sucess : false,
                message : "email and election id  are required"
            })
        }

        //verify the eligibility
        const [voters] = await db.execute(
            `SELECT *
            FROM voters
            WHERE email = ? AND electionid = ?`,[email,electionid]
        );

        if(voters.length === 0){
            return res.status(403).json({
                success : false,
                message : "You are not elligible to vote"
            })
        }

        //2.GET election details
        const [elections]  = await db.execute(
            `SELECT electionId as electionid,title,description,open_time,close_time
            FROM elections
            Where electionid = ?`,[electionid]
        );

        if(elections.length === 0){
            return res.status(404).json({
                success : false ,
                message : "ELECTION not found"
            })
        }

        //3.get candidates for the elections
        const [candidates] = await db.query(
            `SELECT candidateid as candidateid , candidatename
            FROM candidates 
            WHERE electionid =?`,[electionid]
        );

        if (candidates.length === 0) {
            return res.status(404).json({
                success: false,
                message: "candidates not found"
            })
        }

        return res.status(200).json({
            success:true,
            election:elections[0],
            candidates
        })
    }catch(error){
        console.error("ERROR loading ballot",error);
        alert("server connection failed")
    }
}

module.exports = { postballotdetails };