const jwt =require("jsonwebtoken");

const protect = (req,res,next)=>{
    const token = req.cookies.token;
    console.log("tokeninmiddleware:",token)

    if(!token){
        return res.status(401).json({
            message:"Not authorised ,token missing"
        })
    }
    try{
        console.log("in try")
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("decoded:",decoded)
        req.user = decoded;
        next();
    }
    catch(error){
        console.log("JWT Verification error",error.name)
        console.log("JWT Verification error",error.message)

        return res.status(401).json({
            message:"authentication failed",
            error:error.message

        })
    }
}
module.exports={protect}