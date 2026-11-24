const db = require("../database/database");
require("dotenv").config();

async function get_voter_elections(email,election_id){
    if(!election_id && !email){
        return res.status(403).json({
            message:"email or electionid not get"
        })

    }
    try{

        const [result] = await db.query(
            `SELECT voterId , email , voter_name,electionid FROM voters WHERE email=? AND electionid =?`, [email, election_id]
        );

        return result;

    }catch(error){
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

async function get_ballot_candidates(election_id){
    if (!election_id) {
        return res.status(403).json({
            message: "electionid not get"
        })
    }
    try{
        const [result] = await db.query(`
            SELECT candidatename FROM candidates WHERE electionid =?`, [election_id]
            )

            return result;

    }catch(error){
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { get_voter_elections, get_ballot_candidates }