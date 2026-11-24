const db = require("../database/database");
const jwt = require("jsonwebtoken")
require("dotenv").config();

const checkStatus = async(req,res)=>{
try{
    const {electionid , voterid} = req.body

    console.log("voterid:",voterid)
    console.log("electionid",electionid)
        if (!voterid && !electionid) {
            return res.status(400).json({
                sucess: false,
                message: "email and election id  are required"
            })
    }

    const [votes] = await db.execute(
        `SELECT * FROM votes WHERE electionid =? AND voterid = ?`,[electionid,voterid]
    );

    console.log("votes:",votes)

    if (votes.length === 1) {
        return res.status(200).json({
            success: true,
            message: "You have already voted.",
            votes:votes
        })
    }else{
        return res.status(403).json({
            success:false,
            message:"you have not voted yet"
        })
    }
   }catch(error){
    console.error("ERROR loading ballot", error);
    alert("server connection failed")
   }
}

module.exports = { checkStatus };