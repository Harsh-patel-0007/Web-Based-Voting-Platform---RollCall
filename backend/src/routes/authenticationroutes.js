const express = require("express");

const router = express.Router()

const authenticationcontrollers= require("../controllers/userauthentication");

router.post("/registerUser", authenticationcontrollers.registerUser);

router.post("/loginUser", authenticationcontrollers.loginUser);

module.exports = router ;  


