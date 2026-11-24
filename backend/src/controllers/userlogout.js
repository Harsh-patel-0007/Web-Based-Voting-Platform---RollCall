const jwt = require("jsonwebtoken");

async function logout(req,res){
    try{
        const userid = req.user.userid;
        
        const io = req.app.get("io");
        console.log(!!io);

        //disconnect all sockets.io belongs to the user 
        if(io){
            for(const socket of io.sockets.sockets.values()){
                if(socket.data.userid===userid){
                    socket.disconnect(true);
                }
            }
        }

        //clear the jwt cookie
        res.clearCookie("token",{
            httpOnly:true,
            secure:process.env.JWT_SECRET,
            sameSite:"lax",
            path:"/"
        })

        //send response
        return res.status(200).json({
            success:true,
            message:"LOG OUT SUCCESSFULLY"
        })
    }
    catch(error){
        console.log(error)

        return res.status(500).json({
            success:false,
            message:"internsl server error"
        })
    }
}

module.exports = { logout }