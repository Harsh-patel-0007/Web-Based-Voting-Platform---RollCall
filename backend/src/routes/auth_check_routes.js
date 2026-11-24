const express = require("express");

const router = express.Router()

const {protect} = require("../middleware/auth_middleware");

router.get("/check",protect,(req,res)=>{

    console.log("check auth reached")
    
    res.status(200).json({
        authenticated:true,
        user:req.user
    })
})

module.exports = router;