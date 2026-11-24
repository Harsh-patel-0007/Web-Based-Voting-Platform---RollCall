const db = require("../database/database");
require("dotenv").config();
const {get_voter_elections} = require("../models/get_single_election")

const { get_ballot_candidates } = require("../models/get_single_election")

const jwt = require("jsonwebtoken");

async function get_single_election(req,res){
    const {email,election_id} = req.body
    try{
        let decodedData 
        const token = req.cookies.token;
        if (!token) return res.sendStatus(401);
        try{
            decodedData = jwt.verify(token,process.env.JWT_SECRET)

        }catch(error)
        {
            return res.status(403);
        }

        //verify if it voter or not
        const get_election_byid = await get_voter_elections(
            email,
            election_id
        );

        if(get_election_byid.length==0){
            return res.status(400).json({
                message: "election not had been created"
            });
        }

        //get candidates  of the election
        const get_candidate = await get_ballot_candidates(election_id)

        console.log(
            "election",get_election_byid
        )

        console.log("candidate:" ,get_candidate)

        res.status(201).json({
            election:get_election_byid,
            candidate:get_candidate
        })


    }catch(error){
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { get_single_election }