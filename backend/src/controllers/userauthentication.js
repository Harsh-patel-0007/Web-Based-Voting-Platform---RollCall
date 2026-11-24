const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require('uuid');
const {createUser,find_userbyemail} =require("../models/usermodels")

// Generate JWT
const generateToken = (userid,email) => {
    return jwt.sign({ userid, email }, process.env.JWT_SECRET, { expiresIn:"1d"})
};

//register user
const registerUser = asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;
        try{

            if (!username || !email || !password) {
                res.status(400);
                throw new Error("Please add all fields");
            }
            
            // check if user exists
            const userExists = await find_userbyemail(email);
            if (userExists) {
                res.status(400);
                throw new Error("User already exists");
            }
            
            const userid = uuidv4().split('-')[0].toUpperCase();
            
            // create hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // create user
            const user = await createUser(
                username,
                userid,
                email,
                hashedPassword,
            );
            
            if (user) {
                const token =generateToken(
                    user.userid,
                    user.email
                )

                console.log(token)

                //save token into the cookies 
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000
                });

                return res.status(201).json({
                    userid,
                    username,
                    email,
                    message:"users registered successfully"
                });

            } else {
                res.status(400);
                throw new Error("Invalid user data");
            }
        }
        catch(error){
            res.status(500).json({
                message:error.message
            })
        }
});

//login user 
async function loginUser(req,res){

        const { email, password } = req.body;
        try{

            if (!email || !password) {
                res.status(400);
                throw new Error("Please add all fields");
            }
            
            // Check for user email
            const user = await find_userbyemail(email);
            
          

            if (user && (await bcrypt.compare(password, user.password))) {

                const token = generateToken(
                    user.userid,
                    user.email
                );

                //save token into the cookies 
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000
                });

                return res.status(201).json({
                    userid:user.userid,
                    username:user.username,
                    email:user.email,
                    message:"user logged in succesfully"
                });

            } else {
                res.status(400);
                throw new Error("Invalid credentials");
            }
        }
        catch(error){
            res.status(500).json({
                message:error.message
            })
        }
};


module.exports = { registerUser, loginUser }