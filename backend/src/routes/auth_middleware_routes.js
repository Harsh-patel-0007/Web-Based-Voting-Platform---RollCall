const express= require("express");

const router = require("router");

const {protect} = require("../middleware/auth_middleware")

router.get("/profile", protect, (req, res) => {

    res.json({
        message: "You are authenticated",
        user: req.user
    });

});

module.exports =router;