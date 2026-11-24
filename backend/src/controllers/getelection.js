const db = require("../database/database");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const {find_elections} = require("../models/find_election");

async function get_users_election(req,res){
    console.log("in get election---")
    try{
        const token = req.cookies.token;
    
        if(!token){
            return res.status(401).json({
                message:"NOT AUTHORISED"
            })
        }
        console.log("token:",token)

        let decodedData

        try
        {
            decodedData = jwt.verify(token,process.env.JWT_SECRET)
        }catch(error){
            return res.status(403);
        }

        console.log("decoded-data:",decodedData.userid)
        const userid = decodedData.userid;

        console.log("userid:",userid)

        const findelections = await find_elections(userid);
        console.log(findelections)

        if(!findelections){
            return res.status(401).json({
                message:"NO ELECTIONS ARE CONTESTED"
            })
        }
        else{
            res.status(201).json({
                findelections
            })
        }

    }
    catch(error){
        message:error.message,
        res.status(500).json({
            message:"internal server error"
        })
    }
}

module.exports = { get_users_election }