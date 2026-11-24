const express = require("express");
const router =  express.Router();

const {postballotdetails} = require("../controllers/postballotdetails");
const {protect} = require("../middleware/auth_middleware")

router.post("/postballotdetails",protect , postballotdetails);

module.exports = router;