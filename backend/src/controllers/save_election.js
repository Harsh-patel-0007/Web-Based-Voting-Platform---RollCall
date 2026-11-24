const db= require("../database/database");
const { v4: uuidv4 } = require('uuid');
const XLSX = require('xlsx');
const {newElection } = require("../models/electionModels");
const {newcandidate} = require("../models/candidatemodels");
const {newvoters} = require("../models/votersmodel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function save_election (req,res){

    const { Title, Description, Open_time, Close_time, Candidates } = req.body

    const file = req.file;

    if(!file){
        return res.status.json({
            message:"FILE NOT RECEIVED"
        })
    }

    try{
        const token = req.cookies.token;

        if (!token) return res.sendStatus(401);
        let decodedData;
        try{
            decodedData = jwt.verify(token,process.env.JWT_SECRET);
            
        } catch(error){
            return res.status(403);
        }
    
       const userid = decodedData.userid;

        if (!userid) return res.sendStatus(401);

        if(!Title||!Description||!Open_time||!Close_time){
            res.status(400)
            throw new Error("Please fill all required field")
        }

        const electionId = uuidv4().split('-')[0].toUpperCase();

        const newElectiion = await newElection(
            electionId,
            Title,
            userid,
            Description,
            Open_time,
            Close_time
        );

        if (!newElectiion){
            return res.status(400).json({
                message: "election not created"
            });
        } 

        const createdcandidate = JSON.parse(req.body.Candidates);


        const election_id =electionId;

        for (i = 0; i < createdcandidate.length; i++){

            const candidate_id = uuidv4().split('-')[0].toUpperCase();

            const candidate_name = createdcandidate[i];

            const candidate = await newcandidate(
                candidate_name,
                candidate_id,
                election_id
            );

            // createdcandidate.push(candidate);
        }

        if (!file||file.length==0) {
            return res.status(400).json({
                message:"file not uploaded"
            })
        }

        // Load workbook and get the first sheet
        const workbook = XLSX.readFile('uploads\\1791615672310-458132344.xlsx');
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // 1. Array of Objects [ { Name: 'Alice', Age: 25 }, { Name: 'Bob', Age: 30 } ]
        const arrayOfObjects = XLSX.utils.sheet_to_json(sheet);

        //now copy voters from the email and name 
        const values = arrayOfObjects.map(voters => [
            voters.email,
            voters.name,
            election_id
        ]);
        
        //voters are now sent to the database 
        const voters = await newvoters(values);
        
        const io = req.app.get("io");
        if(io){

            io.emit("elections-changed");
        }

        res.status(201).json({
            message:"candidates created successfully",
            candidates:createdcandidate,
            election:newElectiion,
            voters:voters
        });


    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports={save_election}