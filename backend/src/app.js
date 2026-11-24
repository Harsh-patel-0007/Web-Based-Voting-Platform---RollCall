const express = require("express");

const app = express();

const cors = require('cors');

const multer = require('multer');

const XLSX = require('xlsx');

const env = require('dotenv').config(); 

const cookieParser = require("cookie-parser");

console.log(process.env.SESSION_SECRET)

const session = require("express-session");

app.use(session({
    name:"rollcall.sid",
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge:15*60*1000
    }
}));

app.use(cors({
    origin: ['http://localhost:5500',
        "http://127.0.0.1:5500"
    ],  // ← your frontend port (Live Server default)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const Database  = require("./database/database");

//api routes connected
const authroutes = require("./routes/authenticationroutes");

const electroutes = require("../src/routes/saveelection");

const get_electionroutes = require("./routes/get_election_routes");


const check_auth = require("../src/routes/auth_check_routes");

const get_voter_electionroutes = require("./routes/get_voter_election");

const logout = require("./routes/logout_routes");

const postballotdetails  = require("./routes/postballotdetailsroot");

const verifyVoterRoutes = require("./routes/verifyvoterroutes");

const get_result = require("../src/routes/getresultroutes")

const veirfy_votes =require("./routes/checkvotesroutes");
//----------------------------------------------------//

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

const upload = multer({ storage: multer.memoryStorage() })
//----------------------------------------------------------//

//api calls 
app.use("/api/auth",authroutes);

app.use("/api",electroutes);

app.use("/api",get_electionroutes);

app.use("/api", get_voter_electionroutes);

app.use("/api/auth",check_auth);

app.use("/api/auth",logout);

app.use("/api",postballotdetails);

app.use("/api", verifyVoterRoutes);

app.use("/api",get_result);

app.use("/api",veirfy_votes)
//-----------------------------------------------------------//

module.exports = app;
